import { program } from "commander";
import { registerCommands } from './commands';

program
  .name("cz-cli")
  .description("前端开发脚手架工具")
  .version("0.0.1");

registerCommands(program);

program.parse();
