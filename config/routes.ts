// 路由配置
export default [
  {
    path: '/user',
    layout: false,
    component: '@/layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'home',
    icon: 'home',
    path: '/home',
    component: './Home',
  },
  {
    name: 'transfer',
    icon: 'transaction',
    path: '/transfer',
    routes: [
      { path: '/transfer', redirect: '/transfer/index' },
      { path: '/transfer/index', component: './Transfer' },
      { path: '/transfer/step1', component: './Transfer/Step1' },
      { path: '/transfer/step2', component: './Transfer/Step2' },
      { path: '/transfer/step3', component: './Transfer/Step3' },
    ],
  },
  {
    name: 'assets',
    icon: 'wallet',
    path: '/assets',
    component: './Assets',
  },
  {
    name: 'vote',
    icon: 'like',
    path: '/vote',
    component: './Vote',
  },
  {
    name: 'multi',
    icon: 'team',
    path: '/multi',
    component: './Multi',
  },
  {
    name: 'dapp',
    icon: 'appstore',
    path: '/dapp',
    component: './Dapp',
  },
  {
    name: 'contact',
    icon: 'contacts',
    path: '/contact',
    component: './Contact',
  },
  {
    name: 'lock',
    icon: 'lock',
    path: '/lock',
    component: './Lock',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
