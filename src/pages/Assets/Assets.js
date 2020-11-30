import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getKeyStore } from '@/utils/authority';
import RegisteredAsset from './components/RegisteredAsset';
import RegisteredAssetDealerForm from './components/RegisteredAssetDealerForm';
import IssueAssets from './components/IssueAssets';
import TransferAssets from './components/TransferAssets';
import AOBTransaction from './components/AOBTransaction';

class Assets extends PureComponent {
  constructor(props) {
    super(props);
    this.keyStore = getKeyStore();
    this.columns = [
      {
        title: formatMessage({ id: 'app.asset.asset-name' }),
        key: 'name',
        width: '20%',
        render: record => (
          <div>
            <Icon type="dollar" theme="outlined" style={{ marginRight: '10px' }} />
            {record.name.split('.')[1]}
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'app.asset.asset-limit' }),
        dataIndex: 'maximum',
        key: 'maximum',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.asset.asset-quality' }),
        dataIndex: 'quantity',
        key: 'quantity',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'app.asset.asset-precision' }),
        dataIndex: 'precision',
        key: 'precision',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.asset.height' }),
        dataIndex: 'height',
        key: 'height',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'app.asset.operation' }),
        key: 'action',
        width: '30%',
        render: record => (
          <div>
            <IssueAssets asset={record} />
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // console.log('this.keyStore', this.keyStore);

    const params = {
      address: this.keyStore.address,
    };
    dispatch({
      type: 'assets/getAobList',
      payload: params,
    });
    dispatch({
      type: 'assets/fetchIssuer',
      payload: this.keyStore.address,
    }).then(issuer => {
      // console.log('issuerponse.issuer', issuer);
      if (issuer) {
        dispatch({
          type: 'assets/fetchMyAssets',
          payload: issuer.name,
        });
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assets/reset',
    });
  }

  render() {
    const { issuer, myAob, myIssueAob, loading } = this.props;
    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <Icon type="home" />
          <span style={{ marginLeft: '20px' }}>{formatMessage({ id: 'app.asset.asset' })}</span>
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>
          {issuer.name ? (
            <span>
              {formatMessage({ id: 'app.asset.issuer-name' })}:{issuer.name}
            </span>
          ) : (
            <RegisteredAssetDealerForm />
          )}
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper title={pageTitle}>
        <Card
          bordered={false}
          title={formatMessage({ id: 'app.asset.myIssuredAsset' })}
          extra={<RegisteredAsset />}
        >
          <Table
            loading={loading}
            rowKey={record => record.name}
            dataSource={myIssueAob.list}
            columns={this.columns}
            pagination={myIssueAob.count < 10 && false}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>
                {record.name.split('.')[1]} {formatMessage({ id: 'app.asset.asset-description' })}:{' '}
                {record.desc}
              </p>
            )}
          />
        </Card>
        <Card
          bordered={false}
          style={{ marginTop: 30 }}
          title={formatMessage({ id: 'app.asset.myassets' })}
        >
          <Row gutter={24}>
            {myAob.list.length > 0 &&
              myAob.list.map(item => (
                <Col span={6} key={item.name}>
                  <Card
                    title={
                      <div>
                        <Icon type="dollar" theme="outlined" style={{ marginRight: '20px' }} />
                        {item.currency.split('.')[1]}
                      </div>
                    }
                    style={{ backgroundColor: '#f5f5f5' }}
                    actions={[
                      <AOBTransaction assetInfo={item} address={this.keyStore.address} />,
                      <TransferAssets asset={item} />,
                    ]}
                  >
                    <div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1', textAlign: 'left' }}>
                          {formatMessage({ id: 'app.asset.asset-limit' })}
                        </div>
                        <div style={{ flex: '1', textAlign: 'right' }}>{item.maximum}</div>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1', textAlign: 'left' }}>
                          {formatMessage({ id: 'app.asset.asset-quality' })}
                        </div>
                        <div style={{ flex: '1', textAlign: 'right' }}>{item.quantity}</div>
                      </div>
                      <div
                        style={{
                          height: '80px',
                          lineHeight: '80px',
                          color: '#f50',
                          backgroundColor: '#e5e5e5',
                          textAlign: 'center',
                          fontSize: '30px',
                          marginTop: '20px',
                        }}
                      >
                        {item.balance}
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ assets, loading }) => ({
  issuer: assets.issuer,
  myIssueAob: assets.myIssueAob,
  myAob: assets.myAob,
  loading: loading.effects['assets/getAobList'],
}))(Assets);
