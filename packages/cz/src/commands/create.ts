import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import degit from "degit";

const downloadWithRetry = async (template: string, target: string, maxRetries = 3) => {
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

export const createCommand = (program: any) => {
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
            { name: "React", value: "react" },
            { name: "Vue", value: "vue" },
            { name: "Vanilla", value: "vanilla" },
          ],
        },
        {
          type: "confirm",
          name: "typescript",
          message: "是否使用 TypeScript?",
          default: true,
        },
        {
          type: "list",
          name: "packageManager",
          message: "选择包管理器:",
          choices: [
            { name: "npm", value: "npm" },
            { name: "yarn", value: "yarn" },
            { name: "pnpm", value: "pnpm" },
          ],
        },
        {
          type: "checkbox",
          name: "features",
          message: "选择项目特性:",
          choices: [
            { name: "ESLint", value: "eslint" },
            { name: "Prettier", value: "prettier" },
            { name: "Router", value: "router" },
            { name: "状态管理", value: "state-management" },
          ],
        },
      ]);

      console.log("\n正在创建项目...");

      // 下载模板
      try {
        // degit 使用不同的 URL 格式
        const template = `Mooo-star/cz#main/packages/cz/src/templates/${
          answers.framework
        }${answers.typescript ? "-ts" : ""}`;
        
        const success = await downloadWithRetry(template, projectPath);
        if (success) {
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
          fs.readFileSync(packageJsonPath, "utf-8")
        );
        packageJson.name = name;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      console.log(`
✨ 项目创建成功！使用以下命令开始开发：

  cd ${name}
  ${answers.packageManager} install
  ${answers.packageManager === "npm" ? "npm run" : answers.packageManager} dev
      `);
    });
};
