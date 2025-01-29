import fs from 'fs';
import path from 'path';
import { getComponentTemplate } from '../templates/component';

export const generateCommand = (program: any) => {
  program
    .command("generate")
    .alias("g")
    .description("生成组件或其他代码文件")
    .argument("<type>", "生成类型 (component/page/service)")
    .argument("<name>", "文件名称")
    .action((type: string, name: string) => {
      const cwd = process.cwd();
      const componentDir = path.join(cwd, 'src', type + 's');
      
      if (!fs.existsSync(componentDir)) {
        fs.mkdirSync(componentDir, { recursive: true });
      }

      const template = getComponentTemplate(name);

      fs.writeFileSync(
        path.join(componentDir, `${name}.tsx`),
        template
      );
      
      console.log(`Generated ${type}: ${name}`);
    });
};