import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Radio, Icon } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import DdnJS from '@/utils/ddn-js';
import { ChartCard } from '@/components/Charts';
import { getKeyStore } from '@/utils/authority';
import styles from './Home.less';

class Home extends PureComponent {
  state = {
    role: 'All',
    address: '',
  };

  columns = [
    {
      title: formatMessage({ id: 'app.home.trans.id' }, {}),
      dataIndex: 'id',
      sorter: false,
      width: '15%',
      render: text => (
        <a herf="#" target="_blank">
          {`${text.slice(0, 10)}...${text.slice(-10)}`}
        </a>
      ),
    },
    {
      title: formatMessage({ id: 'app.home.trans.type' }, {}),
      dataIndex: 'type',
      sorter: false,
      width: '10%',
      render: text => <span>{text}</span>,
    },
    {
      title: formatMessage({ id: 'app.home.trans.senderId' }, {}),
      dataIndex: 'senderId',
      sorter: false,
      width: '20%',
      render: text => (
        <a herf="#" target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: formatMessage({ id: 'app.home.trans.recipientId' }, {}),
      dataIndex: 'recipientId',
      sorter: false,
      width: '20%',
      render: text => (
        <div>
          <a herf="#" target="_blank">
            {text}
          </a>
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'app.home.trans.amount' }, {}),
      dataIndex: 'amount',
      sorter: false,
      width: '8%',
      render: text => `${text / 100000000}`,
    },
    {
      title: formatMessage({ id: 'app.home.trans.fee' }, {}),
      dataIndex: 'fee',
      sorter: false,
      width: '7%',
      render: text => `${text / 100000000}`,
    },
    {
      title: formatMessage({ id: 'app.home.trans.height' }, {}),
      dataIndex: 'height',
      sorter: false,
      width: '6%',
      render: text => (
        <a herf="#" target="_blank">
          {text}
        </a>
      ),
    },
    {
      title: formatMessage({ id: 'app.home.trans.timestamp' }, {}),
      dataIndex: 'timestamp',
      width: '12%',
      render: text => (
        <span>
          {moment(DdnJS.utils.slots.getRealTime(Number(text))).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const keyStore = getKeyStore();
    // dispatch({
    //   type: 'home/fetchStatus',
    // });
    dispatch({
      type: 'home/fetchPeer',
    });

    this.setState(
      {
        address: keyStore.address,
      },
      () => {
        this.getTransData();
      }
    );
    dispatch({
      type: 'home/fetchAccount',
      payload: { address: keyStore.address },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/reset',
    });
  }

  getTransData = pagination => {
    const { role, address } = this.state;
    const { dispatch } = this.props;
    const payload = {
      params: {
        orderBy: 't_timestamp:desc',
      },
      pagination: pagination || { current: 1, pageSize: 10 },
    };
    if (role === 'sender') {
      payload.params.senderId = address;
    } else if (role === 'recipient') {
      payload.params.recipientId = address;
    } else {
      payload.params.senderId = address;
      payload.params.recipientId = address;
    }
    dispatch({
      type: 'home/fetchTrans',
      payload,
    });
  };

  handleUpdateRole = e => {
    // console.log('e.target.value', e.target.value);
    this.setState({ role: e.target.value }, () => {
      this.getTransData();
    });
  };

  handleTableChange = pagination => {
    // console.log('handleTableChange pagination', pagination);
    this.getTransData(pagination);
  };

  render() {
    const { role } = this.state;
    const { transData, account, latestBlock, version, loading, transLoading, peer } = this.props;
    console.log('peerState', version, peer);

    const topColResponsiveProps = {
      xs: 24,
      sm: 8,
      md: 8,
      lg: 8,
      xl: 8,
    };
    const beginEpochTime = DdnJS.utils.slots.beginEpochTime();
    const duration = moment().diff(beginEpochTime, 'days');

    const extraContent = (
      <div className={styles.extraContent}>
        <Radio.Group value={role} onChange={this.handleUpdateRole}>
          <Radio.Button value="all">{formatMessage({ id: 'app.home.trans.all' }, {})}</Radio.Button>
          <Radio.Button value="sender">
            {formatMessage({ id: 'app.home.trans.send' }, {})}
          </Radio.Button>
          <Radio.Button value="recipient">
            {formatMessage({ id: 'app.home.trans.receipt' }, {})}
          </Radio.Button>
        </Radio.Group>
      </div>
    );

    return (
      <div className={styles.home}>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={
                <div style={{ fontSize: '20px' }}>
                  <Icon type="pie-chart" theme="filled" />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'app.home.balance' })}
                  </span>
                </div>
              }
              action={
                <span>
                  <span>{formatMessage({ id: 'app.home.unit' })}: </span>
                  <span>DDN</span>
                </span>
              }
              loading={loading}
              total={() => <div style={{ marginTop: '5px' }}>{account.balance / 100000000}</div>}
              footer={
                <div>
                  {formatMessage({ id: 'app.home.lock-height' })}: {account.lockHeight}
                </div>
              }
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={
                <div style={{ fontSize: '20px' }}>
                  <Icon type="bar-chart" theme="outlined" />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: 'app.home.block-height' })}
                  </span>
                </div>
              }
              loading={loading}
              total={() => <div style={{ marginTop: '5px' }}>{latestBlock.height}</div>}
              footer={
                <div>
                  {formatMessage({ id: 'app.home.runtime' })}: {duration}{' '}
                  {formatMessage({ id: 'app.home.days' })}
                </div>
              }
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title={
                <div style={{ fontSize: '20px' }}>
                  <Icon type="radar-chart" theme="outlined" />
                  <span style={{ marginLeft: '10px' }}>
                    {formatMessage({ id: `app.home.${version.net}` })}
                  </span>
                </div>
              }
              action={
                <span>
                  <span>{formatMessage({ id: 'app.home.peer' })}: </span>
                  <span>Peer0</span>
                </span>
              }
              loading={loading}
              total={() => <div style={{ marginTop: '5px' }}>v{version.version}</div>}
              footer={
                <div>
                  {formatMessage({ id: 'app.home.peer-start-time' })}: {version.build}
                </div>
              }
            />
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col>
            <Card
              bordered={false}
              className={styles.listCard}
              title={
                <div style={{ fontSize: 20 }}>
                  <Icon type="clock-circle" theme="outlined" />
                  <span style={{ marginLeft: 10 }}>
                    {formatMessage({ id: 'app.home.translist' })}
                  </span>
                </div>
              }
              style={{ marginTop: 24 }}
              bodyStyle={{ padding: '0 32px 40px 32px' }}
              extra={extraContent}
            >
              <div className={styles.tableList}>
                <Table
                  loading={transLoading}
                  rowKey={record => record.id}
                  dataSource={transData.list}
                  pagination={transData.pagination}
                  columns={this.columns}
                  onChange={this.handleTableChange}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ home, user, loading }) => ({
  transData: home.transData,
  account: user.currentAccount,
  latestBlock: user.latestBlock,
  version: home.peer,
  transLoading: loading.effects['home/fetchTrans'],
  loading: loading.effects['user/fetchAccount'],
}))(Home);
