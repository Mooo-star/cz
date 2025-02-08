export default [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: '登录',
    path: '/login',
    component: '@/pages/Login',
    layout: false,
  },
  {
    name: '工作台',
    path: '/dashboard',
    key: 'dashboard',
    icon: 'https://pica.zhimg.com/v2-258dcb56304cae5e118c9232a128ada9.png',
    hideInMenu: true,
    component: '@/pages/Dashboard',
  },
  { path: '/*', component: '@/pages/404' },
];
