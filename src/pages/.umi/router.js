import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/imfly/projects/DDN/ddn-wallet/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    redirect: '/user/login',
    exact: true,
  },
  {
    path: '/transfer',
    name: 'stepform',
    redirect: '/transfer/fill',
    exact: true,
  },
  {
    path: '/vote',
    redirect: '/vote/delegate-list',
    exact: true,
  },
  {
    path: '/',
    redirect: '/home',
    exact: true,
  },
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/UserLayout'),
          LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/UserLayout').default,
    routes: [
      {
        path: '/user/login',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/Users/imfly/projects/DDN/ddn-wallet/src/pages/User/models/register.js').then(
                  m => {
                    return { namespace: 'register', ...m.default };
                  },
                ),
              ],
              component: () => import('../User/Login'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../User/Login').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import('../../layouts/BasicLayout'),
          LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    authority: ['address'],
    routes: [
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Home/Home'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../Home/Home').default,
        exact: true,
      },
      {
        path: '/transfer',
        name: 'transfer',
        icon: 'retweet',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Transfer'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../Transfer').default,
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/transfer/fill',
            name: 'fill',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Transfer/Step1'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Transfer/Step1').default,
            exact: true,
          },
          {
            path: '/transfer/confirm',
            name: 'confirm',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Transfer/Step2'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Transfer/Step2').default,
            exact: true,
          },
          {
            path: '/transfer/result',
            name: 'result',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Transfer/Step3'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Transfer/Step3').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/multi-signature',
        name: 'multiSignature',
        icon: 'deployment-unit',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import('/Users/imfly/projects/DDN/ddn-wallet/src/pages/Multi/models/multi.js').then(
                  m => {
                    return { namespace: 'multi', ...m.default };
                  },
                ),
              ],
              component: () => import('../Multi/MultiSignature'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../Multi/MultiSignature').default,
        exact: true,
      },
      {
        path: '/vote',
        name: 'vote',
        icon: 'like',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Vote/Vote'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../Vote/Vote').default,
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/vote/delegate-list',
            name: 'DelegatesList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Vote/DelegatesList'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Vote/DelegatesList').default,
            exact: true,
          },
          {
            path: '/vote/votelist',
            name: 'VoteList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Vote/VoteList'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Vote/VoteList').default,
            exact: true,
          },
          {
            path: '/vote/forging',
            name: 'forging',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Vote/Forging'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Vote/Forging').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/assets',
        name: 'assets',
        icon: 'bank',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../Assets/Assets'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../Assets/Assets').default,
        exact: true,
      },
      {
        path: 'http://testnet.hbl.lcxf.gov.cn',
        target: '_blank',
        name: 'block',
        icon: 'global',
        exact: true,
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          {
            path: '/result/success',
            name: 'success',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Result/Success'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Result/Success').default,
            exact: true,
          },
          {
            path: '/result/fail',
            name: 'fail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () => import('../Result/Error'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Result/Error').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/403',
            name: 'not-permission',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/imfly/projects/DDN/ddn-wallet/src/pages/Exception/models/error.js').then(
                      m => {
                        return { namespace: 'error', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Exception/403'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/403').default,
            exact: true,
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/imfly/projects/DDN/ddn-wallet/src/pages/Exception/models/error.js').then(
                      m => {
                        return { namespace: 'error', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Exception/404'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/404').default,
            exact: true,
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/imfly/projects/DDN/ddn-wallet/src/pages/Exception/models/error.js').then(
                      m => {
                        return { namespace: 'error', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Exception/500'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/500').default,
            exact: true,
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import('/Users/imfly/projects/DDN/ddn-wallet/src/pages/Exception/models/error.js').then(
                      m => {
                        return { namespace: 'error', ...m.default };
                      },
                    ),
                  ],
                  component: () => import('../Exception/TriggerException'),
                  LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                    .default,
                })
              : require('../Exception/TriggerException').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () => import('../404'),
              LoadingComponent: require('/Users/imfly/projects/DDN/ddn-wallet/src/components/PageLoading/index')
                .default,
            })
          : require('../404').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: () =>
      React.createElement(
        require('/Users/imfly/projects/DDN/ddn-wallet/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
