import { createCommand } from "./create";
import { Command } from "commander";

export const registerCommands = (program: Command) => {
  createCommand(program);
};
