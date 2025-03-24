import os from "os";
import { execSync } from "child_process";
import chalk from "chalk";

interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  npmVersion: string;
  memory: string;
  cpuCores: number;
}

const getSystemInfo = (): SystemInfo => {
  let npmVersion = "未知";
  try {
    npmVersion = execSync("npm --version").toString().trim();
  } catch (error) {
    // 忽略错误
  }

  const totalMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));

  return {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    npmVersion,
    memory: `${totalMem} GB`,
    cpuCores: os.cpus().length
  };
};

export const infoCommand = (program: any) => {
  program
    .command("info")
    .description("显示系统信息")
    .action(async () => {
      const info = getSystemInfo();

      console.log();
      console.log(chalk.cyan("╭───────────────────────────────────────╮"));
      console.log(chalk.cyan("│          系统信息                     │"));
      console.log(chalk.cyan("├───────────────────────────────────────┤"));
      console.log(chalk.cyan(`│ 平台:       ${chalk.green(info.platform.padEnd(22))} │`));
      console.log(chalk.cyan(`│ 架构:       ${chalk.green(info.arch.padEnd(22))} │`));
      console.log(chalk.cyan(`│ Node版本:   ${chalk.green(info.nodeVersion.padEnd(22))} │`));
      console.log(chalk.cyan(`│ NPM版本:    ${chalk.green(info.npmVersion.padEnd(22))} │`));
      console.log(chalk.cyan(`│ 内存:       ${chalk.green(info.memory.padEnd(22))} │`));
      console.log(chalk.cyan(`│ CPU核心数:  ${chalk.green(String(info.cpuCores).padEnd(22))} │`));
      console.log(chalk.cyan("╰───────────────────────────────────────╯"));
      console.log();
    });
}; 