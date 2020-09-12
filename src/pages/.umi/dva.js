import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'assets', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/assets.js').default) });
app.model({ namespace: 'global', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/global.js').default) });
app.model({ namespace: 'home', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/home.js').default) });
app.model({ namespace: 'login', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/login.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/setting.js').default) });
app.model({ namespace: 'transfer', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/transfer.js').default) });
app.model({ namespace: 'user', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/user.js').default) });
app.model({ namespace: 'vote', ...(require('/Users/imfly/projects/DDN/ddn-wallet/src/models/vote.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
