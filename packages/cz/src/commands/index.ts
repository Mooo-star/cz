import { createCommand } from "./create";
import { infoCommand } from "./info";
import { Command } from "commander";

// 简化后的 registerCommands 函数
export const registerCommands = async (program: Command) => {
  // 注册所有命令
  createCommand(program);
  infoCommand(program);
};
