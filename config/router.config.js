export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['address'],
    routes: [
      // home
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Home/Home',
      },
      // transfer
      {
        path: '/transfer',
        name: 'transfer',
        icon: 'retweet',
        component: './Transfer',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/transfer',
            name: 'stepform',
            redirect: '/transfer/fill',
          },
          {
            path: '/transfer/fill',
            name: 'fill',
            component: './Transfer/Step1',
          },
          {
            path: '/transfer/confirm',
            name: 'confirm',
            component: './Transfer/Step2',
          },
          {
            path: '/transfer/result',
            name: 'result',
            component: './Transfer/Step3',
          },
        ],
      },
      // MutiSignature
      {
        path: '/multi-signature',
        name: 'multiSignature',
        icon: 'deployment-unit',
        component: './Multi/MultiSignature',
      },
      // Vote
      {
        path: '/vote',
        name: 'vote',
        icon: 'like',
        component: './Vote/Vote',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/vote',
            redirect: '/vote/delegate-list',
          },
          {
            path: '/vote/delegate-list',
            name: 'DelegatesList',
            component: './Vote/DelegatesList',
          },
          {
            path: '/vote/votelist',
            name: 'VoteList',
            component: './Vote/VoteList',
          },
          {
            path: '/vote/forging',
            name: 'forging',
            component: './Vote/Forging',
          },
        ],
      },
      // assets
      // {
      //   path: '/assets',
      //   name: 'assets',
      //   icon: 'bank',
      //   component: './Assets/Assets',
      // },
      // Decentrelize application
      // {
      //   path: '/dapp',
      //   name: 'application',
      //   icon: 'appstore',
      //   component: './Dapp/Dapp',
      // },
      // block explorer
      {
        path: 'http://mainnet.ddn.link',
        target: '_blank',
        name: 'block',
        icon: 'global',
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
