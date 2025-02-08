// 全局请求配置
import { IS_PROD } from '@/scripts/constants';
import oauth from '@/scripts/oauth';
import type {
  RequestConfig,
  RequestError,
  RequestInterceptor,
  ResponseInterceptor,
} from '@umijs/max';
import { message, notification } from 'antd';
import queryString from 'query-string';

const codeMap = {
  403: '暂无权限',
  404: '资源不存在',
  500: '服务器异常',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

const authHeaderInterceptor: RequestInterceptor = (url, options) => {
  const token = oauth.getStoreToken() as string;

  // @ts-ignore
  // 添加 token
  options.headers.Authorization = token;

  return {
    url,
    options: { ...options, interceptors: true },
  };
};

const zapiMockOptionsInterceptor: RequestInterceptor = (
  url,
  { mock, ...options },
) => {
  return {
    url: mock && !IS_PROD ? `/mock/zapiId${url}` : url,
    options: {
      ...options,
      interceptors: true,
      paramsSerializer: function (params: any) {
        return queryString.stringify(params, { arrayFormat: 'comma' });
      },
    },
  };
};

const noPermissionSubmitInterceptor: ResponseInterceptor = (response) => {
  const {
    config: { method },
    status,
  } = response;

  // 处理提交出现401跳转导致数据丢失问题
  if (method !== 'GET' && status === 401) {
    message.warning('登录失效，请刷新页面', 5000);
  }

  return response;
};

export const request: RequestConfig = {
  // TODO
  // adapter: async (resData) => {
  //   return new Promise((res) => {
  //     const { msg, code, data, ...otherRes } = resData.data || {};
  //     if (code !== 0) {
  //       otherRes.errorCode = code;
  //       otherRes.errorMessage = msg;
  //     }
  //     res({
  //       ...otherRes,
  //       success: code === 0,
  //       data,
  //     });
  //   });
  // },

  errorConfig: {
    errorHandler: (error: RequestError) => {
      const {
        name,
        // @ts-ignore
        response: { data },
      } = error;
      if (name === 'BizError') {
        notification.error({
          message: `返回错误 ${data?.code}`,
          description: data?.msg,
        });

        return Promise.reject(data);
      }

      // @ts-ignore
      if (error?.response) {
        // @ts-ignore
        const { status } = error.response;
        const {
          // @ts-ignore
          config: { method, url },
        } = error;

        if (status === 401 && method.toUpperCase() === 'GET') {
          oauth.login();
          return null;
        }

        notification.error({
          message: `请求错误 ${status} ${status >= 500 ? url : ''}`,
          // @ts-ignore
          description: data?.msg || codeMap[status] || '请求异常',
        });
      } else {
        // 请求初始化时出错或者没有响应返回的异常
        notification.error({
          message: '请求没有响应',
        });
      }

      throw error;
    },
  },

  requestInterceptors: [zapiMockOptionsInterceptor, authHeaderInterceptor],

  responseInterceptors: [noPermissionSubmitInterceptor],
};
