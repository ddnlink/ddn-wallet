import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Modal } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi';

class AOBTransaction extends Component {
  state = {
    visible: false,
    pagination: {
      pageSize: 10,
      current: 0,
    },
  };

  columns = [
    {
      title: formatMessage({ id: 'app.home.trans.id' }),
      dataIndex: 'id',
      sorter: false,
      width: '16%',
      render: text => <div>{`${text.slice(1, 10)}...${text.slice(-10)}`}</div>,
    },
    // {
    //   title: formatMessage({ id: 'app.home.trans.type' }),
    //   dataIndex: 'type',
    //   sorter: false,
    //   width: '8%',
    //   render: text => <div>{text}</div>,
    // },
    {
      title: formatMessage({ id: 'app.home.trans.senderId' }),
      dataIndex: 'senderId',
      sorter: false,
      width: '16%',
      render: text => <div>{`${text.slice(1, 10)}...${text.slice(-10)}`}</div>,
    },
    {
      title: formatMessage({ id: 'app.home.trans.recipientId' }),
      dataIndex: 'recipientId',
      sorter: false,
      width: '16%',
      render: text => <div>{`${text.slice(1, 10)}...${text.slice(-10)}`}</div>,
    },
    {
      title: formatMessage({ id: 'app.home.trans.amount' }),
      sorter: false,
      width: '8%',
      render: record => (
        <span>
          {record.asset.aobTransfer.amount} {record.asset.aobTransfer.currency.split('.')[1]}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'app.asset.message' }),
      dataIndex: 'message',
      sorter: false,
      width: '8%',
      render: text => <span>{text}</span>,
    },

    {
      title: formatMessage({ id: 'app.asset.content' }),
      sorter: false,
      width: '16%',
      render: record => (
        <span>
          {record.asset.aobTransfer.content} {record.asset.aobTransfer.content.split('.')[1]}
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'app.home.trans.height' }),
      dataIndex: 'height',
      sorter: false,
      width: '8%',
      render: text => <div>{text}</div>,
    },
    {
      title: formatMessage({ id: 'app.home.trans.timestamp' }),
      dataIndex: 'timestamp',
      width: '10%',
      render: text => (
        <span>
          {moment(DdnJS.utils.slots.getRealTime(Number(text))).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
  ];

  showModal = async () => {
    this.getTransactions();
    this.setState({
      visible: true,
    });
  };

  getTransactions = async (params = {}) => {
    const { assetInfo, address, dispatch } = this.props;
    // console.log('assetInfo', assetInfo);

    const payload = {
      address,
      currency: assetInfo.currency,
      limit: params.limit,
      offset: params.offset,
    };
    dispatch({
      type: 'assets/getAobTransfers',
      payload,
    });
  };

  handleTableChange = newpagination => {
    const { pagination } = this.state;
    const pager = { ...pagination };
    pager.current = newpagination.current;

    this.setState({
      pagination: pager,
    });

    this.getTransactions({
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      orderBy: 't_timestamp:desc',
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, pagination } = this.state;
    const { transactions, loading } = this.props;

    return (
      <div>
        <Button size="large" style={{ width: '120px' }} onClick={this.showModal}>
          {formatMessage({ id: 'app.asset.transactions' })}
        </Button>
        <Modal
          title={formatMessage({ id: 'app.asset.transactions' })}
          visible={visible}
          footer={false}
          onCancel={this.handleCancel}
          width="80%"
        >
          <Table
            columns={this.columns}
            bordered
            rowKey={record => record.id}
            dataSource={transactions}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ assets, loading }) => ({
  loading: loading.effects['assets/getAobTransfers'],
  transactions: assets.transactions,
}))(AOBTransaction);
