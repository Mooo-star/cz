const path = require("path");
const degit = require("degit");

const downloadWithRetry = async (template, target, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const emitter = degit(template, {
        cache: false,
        force: true,
        verbose: true,
      });
      emitter.on("info", (info) => {
        console.log("emitter info", info.message);
      });
      await emitter.clone(target).then((res) => {
        console.log("-------- clone down -------------", res);
      });

      return true;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`\n⚠️ 下载失败，正在进行第 ${i + 1} 次重试...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return false;
};

async function main() {
  try {
    // degit 使用不同的 URL 格式
    const template = `Mooo-star/cz/packages/cz/src/templates/react-ts`;
    const success = await downloadWithRetry(
      template,
      "/Users/zhihu/Desktop/demo/test_cli/demo4"
    );
    if (success) {
      console.log("sccess", success);
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
}

main();
