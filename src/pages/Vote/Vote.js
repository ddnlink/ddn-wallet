import React, { Component } from 'react';
import { history , formatMessage } from 'umi';
import { connect } from 'dva';
import { Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import DelegateRegiste from './DelegateRegiste';

@connect(({ user, vote }) => ({
  currentAccount: user.currentAccount,
  delegateInfo: vote.delegateInfo,
}))
class Vote extends Component {
  componentDidMount() {
    const { dispatch, currentAccount } = this.props;
    // console.log('currentAccount', currentAccount);
    dispatch({
      type: 'vote/fetchDelegateInfo',
      payload: { publicKey: currentAccount.publicKey },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'vote/reset',
    });
  }

  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'delegate-list':
        history.push(`${match.url}/delegate-list`);
        break;
      case 'votelist':
        history.push(`${match.url}/votelist`);
        break;
      case 'forging':
        history.push(`${match.url}/forging`);
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
        key: 'delegate-list',
        tab: formatMessage({ id: 'app.vote.delegateList' }),
      },
      {
        key: 'votelist',
        tab: formatMessage({ id: 'app.vote.myvote' }),
      },
      {
        key: 'forging',
        tab: formatMessage({ id: 'app.vote.forge' }),
      },
    ];

    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Icon type="deployment-unit" />
          <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'app.vote.vote' })}</span>
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>
          {delegateInfo.username ? (
            <span>
              {formatMessage({ id: 'app.vote.delegateName' })}: {delegateInfo.username}
            </span>
          ) : (
            <DelegateRegiste />
          )}
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

export default Vote;
