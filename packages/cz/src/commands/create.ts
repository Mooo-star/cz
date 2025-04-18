import { execSync } from "child_process";
import { Command } from "commander";
import degit from "degit";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

const getGitUser = () => {
  try {
    const name = execSync("git config user.name").toString().trim();
    const email = execSync("git config user.email").toString().trim();
    return { name, email };
  } catch {
    return { name: "", email: "" };
  }
};

const downloadWithRetry = async (
  template: string,
  target: string,
  maxRetries = 3,
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const emitter = degit(template, {
        cache: false,
        force: true,
        verbose: true,
      });

      await emitter.clone(target);

      return true;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`\n⚠️ 下载失败，正在进行第 ${i + 1} 次重试...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return false;
};

interface ProjectAnswers {
  framework: string;
  typescript: boolean;
  packageManager: string;
  features: string[];
}

export const createCommand = (program: Command) => {
  program
    .command("create")
    .description("创建新项目")
    .argument("<name>", "项目名称")
    .action(async (name: string) => {
      const projectPath = path.resolve(process.cwd(), name);

      if (fs.existsSync(projectPath)) {
        console.error(`错误: 目录 ${name} 已存在`);
        process.exit(1);
      }

      const answers = await inquirer.prompt<ProjectAnswers>([
        {
          type: "list",
          name: "framework",
          message: "选择框架:",
          choices: [
            { name: "monorepo", value: "monorepo" },
            { name: "react", value: "react" },
          ],
        },
      ]);

      console.log("\n正在创建项目...");

      // 下载模板
      try {
        // degit 使用不同的 URL 格式
        const template = `Mooo-star/cz/packages/cz/src/templates/${
          answers.framework
        }`;
        const success = await downloadWithRetry(template, projectPath);
        if (success) {
          console.log("sccess", success);
          console.log("✅ 模板下载完成");
        } else {
          throw new Error("下载失败");
        }
      } catch (err) {
        console.error("❌ 模板下载失败:", err);
        console.log("\n💡 建议：");
        console.log("1. 检查网络连接");
        console.log("2. 尝试使用代理");
        console.log("3. 确认仓库地址是否正确");
        process.exit(1);
      }

      // 更新 package.json
      const packageJsonPath = path.join(projectPath, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );
        packageJson.name = name;
        const gitUser = getGitUser();
        packageJson.author = gitUser.name
          ? `${gitUser.name} <${gitUser.email}>`
          : "";
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      // 初始化 git
      try {
        execSync("git init", { cwd: projectPath });
      } catch (err) {
        console.error("❌ git 初始化失败:", err);
      }

      console.log(`
✨ 项目创建成功！使用以下命令开始开发：

  cd ${name}
  pnpm install
      `);
    });
};
