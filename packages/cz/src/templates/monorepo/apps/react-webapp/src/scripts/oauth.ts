import { fetchOauthToken } from '@/services';
import queryString from 'query-string';

const { protocol, host, pathname, origin, search } = window.location;

const LOGOUT_URL = `https://staff.zhihu.com/login/profile/logout?redirect_uri=${origin}`;
const OAUTH_URL = `${protocol}//staff.zhihu.com/oidc/auth`;
const CLIENT_ID = '62fb75de22ba10f20897c64e';
const RESPONSE_CODE = 'code';
const SCOPE = 'openid username email';
const STATE = `${protocol}//${host}${pathname}${search}`;

export const OAUTH_TOKEN_URL = `${OAUTH_URL}/token`;
export const REDIRECT_URI = `${protocol}//${host}/new-one/login`;
// export const REDIRECT_URI = `${protocol}//${host}/login`;

class Oauth {
  static login() {
    Oauth.removeStoreToken();
    const href = queryString.stringifyUrl({
      url: OAUTH_URL,
      query: {
        client_id: CLIENT_ID,
        response_type: RESPONSE_CODE,
        redirect_uri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
      },
    });

    window.location.href = href;
  }

  static logout() {
    Oauth.removeStoreToken();
    window.location.href = LOGOUT_URL;
  }

  static async getAccessToken(code: string) {
    const { data } = await fetchOauthToken({
      code,
      redirectUri: REDIRECT_URI,
    });
    Oauth.setStoreToken(data.oneAuthorization);
  }

  static getStoreToken() {
    return window.localStorage.getItem('token');
  }

  static setStoreToken(token: string) {
    if (!token) return;
    window.localStorage.setItem('token', token);
  }

  static removeStoreToken() {
    window.localStorage.removeItem('token');
  }

  static isLoginPage() {
    return window.location.pathname === '/new-one/login';
    // return window.location.pathname === '/login';
  }
}

export default Oauth;
