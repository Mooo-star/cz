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
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json", // 指定 TypeScript 配置文件路径
      declaration: true, // 生成 .d.ts 文件
      declarationDir: "dist/types", // 指定 .d.ts 文件输出目录
      outputToFilesystem: true, // 显式设置为 true，以便在构建过程中输出.d.ts 文件  ps: 让控制台不要报警告了
    }),
    resolve({
      preferBuiltins: true,
      extensions: [".js", ".ts", ".json"],
      moduleDirectories: ["node_modules"],
      mainFields: ["module", "main"],
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
      babelHelpers: "bundled", // 显式声明这个选项
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
    "https",
    "http",
    "url",
    "zlib",
    "degit",
    /^node:/, // 排除所有 node: 协议的内置模块
  ],
};
