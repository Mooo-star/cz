import { program } from "commander";
import { registerCommands } from "./commands";
import { checkVersion } from "./commands/version-check";

// 首先执行版本检查，然后再初始化程序
const init = async () => {
  try {
    // 在程序启动时立即检查版本
    await checkVersion();

    // 配置基础程序信息
    program.name("cz-cli").description("前端开发脚手架工具").version("0.0.1");

    // 注册所有命令
    await registerCommands(program);

    // 解析命令行参数并执行命令
    program.parse();
  } catch (error) {
    // 版本检查失败时，继续执行其他操作
    console.error("版本检查失败，但继续执行命令:", error);

    program.name("cz-cli").description("前端开发脚手架工具").version("0.0.1");

    await registerCommands(program);
    program.parse();
  }
};

// 执行初始化
init().catch((error) => {
  console.error("初始化失败:", error);
  process.exit(1);
});
