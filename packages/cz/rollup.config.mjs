import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { cleandir } from "rollup-plugin-cleandir";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    // 注释掉其他两种打包方式吧，暂时用不到，因为只运行在 node 端
    // {
    //   file: "dist/esm.js",
    //   format: "esm",
    //   sourcemap: true,
    // },
    // {
    //   file: "dist/umd.js",
    //   name: "Sunny",
    //   format: "umd",
    //   sourcemap: true,
    // },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json", // 指定 TypeScript 配置文件路径
      declaration: true, // 生成 .d.ts 文件
      declarationDir: "dist/types", // 指定 .d.ts 文件输出目录
      outputToFilesystem: true, // 显式设置为 true，以便在构建过程中输出.d.ts 文件  ps: 让控制台不要报警告了
    }),
    resolve({
      extensions: [".js", ".ts", ".json"],
      // 只解析 ES6 模块（即使用 import/export 语法的模块），而忽略 CommonJS 模块（使用 require/module.exports 的模块）。
      // 所以这里将这个配置改为 false
      modulesOnly: false,
      preferBuiltins: true, // 改为 true，优先使用 Node.js 内置模块
      moduleDirectories: ["node_modules"], // 明确指定查找模块的目录
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
    json(),
    babel({
      babelrc: false,
      presets: [["@babel/preset-env", { modules: false, loose: true }]],
      plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]],
      exclude: "node_modules/**",
    }),
    cleandir("./dist"),
  ],
  // 只保留 Node.js 内置模块作为外部依赖
  external: [
    "fs",
    "path",
    "child_process",
    "events",
    "util",
    "os",
    "stream",
    "readline",
    /^node:/, // 添加这一行，排除所有 node: 协议的内置模块
  ],
};
