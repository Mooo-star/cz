import axios from "axios";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import chalk from "chalk";

// 获取当前包的信息
const getPackageInfo = () => {
  try {
    const packageJsonPath = path.resolve(__dirname, "../package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } catch (error) {
    console.error("获取包信息失败:", error);
    return { name: "", version: "" };
  }
};

// 从npm registry获取最新版本
const getLatestVersion = async (
  packageName: string,
): Promise<string | null> => {
  try {
    const response = await axios.get(
      `https://registry.npmjs.org/${packageName}`,
    );
    return response.data["dist-tags"].latest;
  } catch (error) {
    console.error("获取最新版本失败:", error);
    return null;
  }
};

// 比较版本号
const compareVersions = (current: string, latest: string): boolean => {
  const currentParts = current.split(".").map(Number);
  const latestParts = latest.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (latestParts[i] > currentParts[i]) {
      return true;
    } else if (latestParts[i] < currentParts[i]) {
      return false;
    }
  }

  return false;
};

// 检查版本并提示更新
export const checkVersion = async (): Promise<void> => {
  const { name, version } = getPackageInfo();

  if (!name || !version) {
    return;
  }

  try {
    const latestVersion = await getLatestVersion(name);
    if (latestVersion && compareVersions(version, latestVersion)) {
      // 计算每行所需的固定长度
      const updateCommand = `npm install -g ${name}`;
      // 确保所有内容行的长度一致
      console.log();
      console.log(
        chalk.bold(
          chalk.yellow(
            "╭───────────────────────────────────────────────────────╮",
          ),
        ),
      );
      console.log(
        chalk.bold(
          chalk.yellow(
            "│                                                       │",
          ),
        ),
      );
      console.log(
        chalk.bold(
          chalk.yellow(
            "│  ✨ 更新提示                                          │",
          ),
        ),
      );
      console.log(
        chalk.bold(
          chalk.yellow(
            `│  发现新版本 ${chalk.green(latestVersion)} (当前版本 ${chalk.red(version)})${" ".repeat(20)}│`,
          ),
        ),
      );
      console.log(
        chalk.bold(
          chalk.yellow(
            `│  运行 ${chalk.cyan(updateCommand)} 更新到最新版本  │`,
          ),
        ),
      );
      console.log(
        chalk.bold(
          chalk.yellow(
            "│                                                       │",
          ),
        ),
      );
      console.log(
        chalk.bold(
          chalk.yellow(
            "╰───────────────────────────────────────────────────────╯",
          ),
        ),
      );
      console.log();
    }
  } catch (error) {
    // 静默失败，不影响命令执行
  }
};
