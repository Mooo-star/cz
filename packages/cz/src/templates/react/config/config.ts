import { defineConfig } from '@umijs/max';
import proxy from './proxy';
import qiankun from './qiankun';
import routes from './routes/index';
import theme from './theme';

const env = process.env.NODE_ENV;

export default defineConfig({
  mako: {},
  scripts: [],
  hash: true,
  theme,
  antd: {
    configProvider: {
      cssVar: true,
    },
  },
  // monorepoRedirect: {},
  favicons: [],
  proxy,
  mock: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {},
  routes,
  qiankun: {
    slave: {},
    master: {
      apps: qiankun,
      perfetch: false,
    },
  },
  esbuildMinifyIIFE: true,
  jsMinifier: 'terser',
  npmClient: 'pnpm',
  metas: [
    {
      'http-equiv': 'Cache-Control',
      content: 'no-cache',
    },
    {
      'http-equiv': 'Pragma',
      content: 'no-cache',
    },
    {
      'http-equiv': 'Expires',
      content: '0',
    },
  ],
});
