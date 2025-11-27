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
    name: 'contract',
    icon: 'code',
    path: '/contract',
    routes: [
      { path: '/contract', redirect: '/contract/list' },
      { path: '/contract/list', component: './Contract/List' },
      { path: '/contract/detail/:id', component: './Contract/Detail' },
      { path: '/contract/deploy', component: './Contract/Deploy' },
      { path: '/contract/interact/:id', component: './Contract/Interact' },
    ],
  },
  // {
  //   name: 'dao',
  //   icon: 'cluster',
  //   path: '/dao',
  //   component: './Dao',
  // },
  {
    name: 'assets',
    icon: 'wallet',
    path: '/assets',
    component: './Assets',
  },
  {
    name: 'evidence',
    icon: 'SafetyCertificateOutlined',
    path: '/evidence',
    routes: [
      { path: '/evidence', redirect: '/evidence/list' },
      { path: '/evidence/list', component: './Evidence/List' },
      { path: '/evidence/detail/:id', component: './Evidence/Detail' },
      { path: '/evidence/create', component: './Evidence/Create' },
      { path: '/evidence/verify', component: './Evidence/Verify' },
    ],
  },
  {
    name: 'multi',
    icon: 'team',
    path: '/multi',
    component: './Multi',
  },
  {
    name: 'account',
    icon: 'bank',
    path: '/account',
    routes: [
      { path: '/account', component: './Account' },
      { path: '/account/detail/:address', component: './Account/detail' },
    ],
  },
  {
    name: 'others',
    icon: 'appstore',
    path: '/others',
    routes: [
      { path: '', redirect: '/others/transfer' },
      {
        name: 'transfer',
        path: 'transfer',
        component: './Transfer',
      },
      {
        name: 'vote',
        path: 'vote',
        component: './Vote',
      },
      {
        name: 'lock',
        path: 'lock',
        component: './Lock',
      },
      {
        name: 'dapp',
        path: 'dapp',
        component: './Dapp',
      },
    ],
  },
  // 保留原始路由以确保直接访问这些页面仍然有效
  {
    path: '/transfer',
    hideInMenu: true,
    routes: [
      { path: '', redirect: '/transfer/index' },
      { path: 'index', component: './Transfer' },
      { path: 'step1', component: './Transfer/Step1' },
      { path: 'step2', component: './Transfer/Step2' },
      { path: 'step3', component: './Transfer/Step3' },
    ],
  },
  {
    path: '/vote',
    hideInMenu: true,
    component: './Vote',
  },
  {
    path: '/lock',
    hideInMenu: true,
    component: './Lock',
  },
  {
    path: '/dapp',
    hideInMenu: true,
    component: './Dapp',
  },
  {
    path: '/docs',
    hideInMenu: true,
    routes: [
      { path: '/docs/contract-specification', component: './Docs/ContractSpecification' },
    ],
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
