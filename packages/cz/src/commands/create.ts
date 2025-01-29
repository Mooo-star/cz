import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import download from "download-git-repo";
import { promisify } from "util";

const downloadTemplate = promisify(download);

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
        // 假设你的模板都放在 templates 目录下
        const template = `sunny/project-templates/templates/${answers.framework}${
          answers.typescript ? "-ts" : ""
        }`;
        // 或者使用完整 URL
        // const template = `direct:https://github.com/sunny/project-templates.git#main/templates/${answers.framework}`;
        
        await downloadTemplate(template, projectPath, { clone: true });
        console.log("✅ 模板下载完成");
      } catch (err) {
        console.error("❌ 模板下载失败:", err);
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
