import { createCommand } from "./create";
import { generateCommand } from "./generate";
import { Command } from "commander";

export const registerCommands = (program: Command) => {
  createCommand(program);
  generateCommand(program);
};
