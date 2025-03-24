// 运行时配置
import oauth from '@/scripts/oauth';
import { request } from '@/scripts/request';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
async function getInitialState() {
  if (oauth.isLoginPage()) {
    return {};
  }

  // TODO Authing 的工作

  // 1. 请求用户信息 / 判断有没有权限的接口

  // 2. 存用户信息 token ...

  return {};
}

export { getInitialState, request };
