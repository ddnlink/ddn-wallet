import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Icon, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getKeyStore } from '@/utils/authority';
import RegisteredOrg from './components/RegisteredOrg';
// import RegisteredAssetDealerForm from './components/RegisteredAssetDealerForm';
// import ChangeOrg from './components/ChangeOrg';
// import TransferAssets from './components/TransferAssets';
// import AOBTransaction from './components/AOBTransaction';

class Dao extends PureComponent {
  constructor(props) {
    super(props);
    this.keyStore = getKeyStore();
    this.columns = [
      {
        title: formatMessage({ id: 'app.dao.dao-name' }),
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-tags' }),
        dataIndex: 'tags',
        key: 'tags',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-url' }),
        dataIndex: 'url',
        key: 'url',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-address' }),
        dataIndex: 'address',
        key: 'address',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.dao.dao-state' }),
        dataIndex: 'state',
        key: 'state',
        width: '10%',
      },
      // {
      //   title: formatMessage({ id: 'app.asset.operation' }),
      //   key: 'action',
      //   width: '30%',
      //   render: record => (
      //     <div>
      //       <ChangeOrg asset={record} />
      //     </div>
      //   ),
      // },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // console.log('this.keyStore', this.keyStore);

    const params = {
      address: this.keyStore.address,
    };
    dispatch({
      type: 'dao/getDaoList',
      payload: params,
    });
    dispatch({
      type: 'dao/getMyOrg',
      payload: { address: this.keyStore.address },
    }).then(issuer => {
      console.log('issuerponse.issuer', issuer);
      // if (issuer) {
      //   dispatch({
      //     type: 'assets/fetchMyAssets',
      //     payload: issuer.name,
      //   });
      // }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/reset',
    });
  }

  render() {
    const { issuer, dao, myOrgs, loading } = this.props;
    console.log('issuer', issuer, 'myAob123', dao, 'myIssueAob', myOrgs, 'loading', loading);
    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Icon type="home" />
          <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'app.dao.dao' })}</span>
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper title={pageTitle}>
        <Card
          bordered={false}
          title={formatMessage({ id: 'app.dao.list' })}
          extra={<RegisteredOrg />}
        >
          <Table
            loading={loading}
            rowKey={record => record.transaction_id}
            dataSource={dao.list}
            columns={this.columns}
            pagination={dao.count < 10 && false}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>
                {formatMessage({ id: 'app.dao.dao-trsId' })}: {record.transaction_id}
              </p>
            )}
          />
        </Card>
        <Card bordered={false} style={{ marginTop: 30 }} title="我的组织号">
          <Table
            loading={loading}
            rowKey={record => record.transaction_id}
            dataSource={myOrgs.list}
            columns={this.columns}
            pagination={myOrgs.count < 10 && false}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>
                {formatMessage({ id: 'app.dao.dao-trsId' })}: {record.transaction_id}
              </p>
            )}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ dao, loading }) => ({
  issuer: dao.issuer,
  myOrgs: dao.myOrgs,
  dao: dao.dao,
  loading: loading.effects['dao/getAobList'],
}))(Dao);
