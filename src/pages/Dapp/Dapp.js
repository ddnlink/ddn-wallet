import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage } from 'umi/locale';
import DappRegister from './DappRegister';

@connect(({ user, dapp }) => ({
  currentAccount: user.currentAccount,
  dapps: dapp.dapps,
}))
class Dapp extends Component {
  componentDidMount() {
    const { dispatch, currentAccount } = this.props;
    console.log('currentAccount', currentAccount);
    dispatch({
      type: 'dapp/fetchDapps',
      payload: { publicKey: currentAccount.publicKey },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dapp/reset',
    });
  }

  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'dapp-list':
        router.push(`${match.url}/dapp-list`);
        break;
      default:
        break;
    }
  };

  handleFormSubmit = value => {
    // eslint-disable-next-line
    console.log(value);
  };

  render() {
    const { match, children, location, delegateInfo } = this.props;
    const tabList = [
      {
        key: 'dapp-list',
        tab: formatMessage({ id: 'app.dapp.dappList' }),
      },
      // {
      //   key: 'mydapp-list',
      //   tab: formatMessage({ id: 'app.dapp.myDappList' }),
      // },
    ];

    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Icon type="deployment-unit" />
          <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'app.dapp.dapp' })}</span>
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>
          <DappRegister />
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper
        title={pageTitle}
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default Dapp;
