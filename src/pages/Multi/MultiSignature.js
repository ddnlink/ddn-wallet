import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import { Row, Col, Card, Switch, Table, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getKeyStore } from '@/utils/authority';
import DdnJS from '@ddn/js-sdk';

import moment from 'moment';
import { formatMessage } from 'umi';
import MultiMember from '@/pages/Multi/MultiMember';
import OpenMultiModal from './OpenMultiModal';

// const columnsTrans = [
//   { title: '交易ID', dataIndex: 'id', key: 'id', width: '15%', render: (record) => <span>{`${record.transaction.id.slice(1,20)}...${record.transaction.id.slice(-20)}`}</span> },
//   { title: '接收者', dataIndex: 'receiptId', key: 'receiptId', width: '20%'},
//   { title: '日期', dataIndex: 'timestamp', key: 'timestamp', width: '10%' },
//   { title: '金额', dataIndex: 'amount', key: 'amount', width: '10%' },
//   { title: '费用', dataIndex: 'fees', key: 'fees', width: '10%' },
//   { title: '需要确认数', dataIndex: 'confirmations', key: 'confirmations', width: '15%' },
//   { title: 'Action', dataIndex: '', key: 'x', width: '20%', render: (record) => { if(record.signed){return <a href="#">确认</a>}else{return null} },
// ];

// const columnsAccount = [
//   { title: 'Name', dataIndex: 'name', key: 'name' },
//   { title: 'Age', dataIndex: 'age', key: 'age' },
//   { title: 'Address', dataIndex: 'address', key: 'address' },
//   { title: 'Action', dataIndex: '', key: 'x', render: () => <a href="#">Delete</a> },
// ];

class MultiSignature extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      show: false,
      multisigaccounts: [],
    };
    this.keyStore = getKeyStore();
    this.columnsTrans = [
      {
        title: formatMessage({ id: 'app.multi.transId' }),
        key: 'id',
        width: '15%',
        render: record => (
          <span>
            {`${record.transaction.id.slice(0, 10)}...${record.transaction.id.slice(-10)}`}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'app.multi.receipt' }),
        key: 'receiptId',
        width: '20%',
        render: record => <span>{record.transaction.receiptId || ''}</span>,
      },
      {
        title: formatMessage({ id: 'app.multi.timestamp' }),
        key: 'timestamp',
        width: '15%',
        render: record => (
          <span>
            {moment(DdnJS.utils.slots.getRealTime(Number(record.transaction.timestamp))).format(
              'YYYY-MM-DD HH:mm:ss'
            )}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'app.multi.amount' }),
        key: 'amount',
        width: '10%',
        render: record => <span>{record.transaction.amount / 100000000}</span>,
      },
      {
        title: formatMessage({ id: 'app.multi.fees' }),
        key: 'fees',
        width: '10%',
        render: record => <span>{record.transaction.fee / 100000000}</span>,
      },
      {
        title: formatMessage({ id: 'app.multi.confirm-number' }),
        key: 'confirmations',
        width: '10%',
        render: record => (
          <span>
            {record.transaction.signatures ? record.transaction.signatures.length + 1 : 1}/
            {record.min}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'app.multi.action' }),
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: record => {
          if (!record.signed) {
            return (
              <Button type="primary" onClick={() => this.multiSign(record.transaction)}>
                {formatMessage({ id: 'app.multi.comfirm' })}
              </Button>
            );
          }
          return <span>{formatMessage({ id: 'app.multi.comfirmed' })}</span>;
        },
      },
    ];
    this.columnsAccount = [
      {
        title: formatMessage({ id: 'app.multi.group-name' }),
        dataIndex: 'address',
        key: 'address',
        width: '50%',
      },
      {
        title: formatMessage({ id: 'app.multi.member' }),
        key: 'multisignatures',
        width: '30%',
        render: record => (
          <a href="#" onClick={e => this.showMultiMembers(e, record)}>
            {record.multisignatures.length + 1 || ''}
          </a>
        ),
      },
      {
        title: formatMessage({ id: 'app.multi.confirm-number' }),
        dataIndex: 'multimin',
        key: 'multimin',
        width: '20%',
      },
    ];
  }

  componentWillMount() {
    this.getData();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'multi/reset',
    });
  }

  getData = () => {
    const { dispatch } = this.props;
    const { publicKey } = this.keyStore;
    dispatch({
      type: 'multi/fetchAccounts',
      payload: { publicKey },
    });
    dispatch({
      type: 'multi/fetchTransactions',
      payload: { publicKey },
    });
  };

  onChange = () => {
    // console.log(`switch to ${checked}`);
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  multiSign = trans => {
    const { dispatch } = this.props;
    const { phaseKey, publicKey } = this.keyStore;
    const params = {
      secret: phaseKey,
      transactionId: trans.id,
    };
    dispatch({
      type: 'multi/createMultiSign',
      payload: params,
      callback: response => {
        // console.log('multi response', response);
        if (response.success) {
          dispatch({
            type: 'multi/fetchTransactions',
            payload: { publicKey },
          });
          message.success('签名成功');
        } else {
          message.error(response.error);
        }
      },
    });
  };

  showMultiMembers = (e, record) => {
    e.preventDefault();
    // console.log('record', record);
    const member = record.multisigaccounts.map(item => item.address);
    member.push(record.address);
    this.setState({
      multisigaccounts: member,
      show: true,
    });
  };

  closeMember = () => {
    this.setState({ show: false });
  };

  render() {
    const { account, multiAccounts, transactions, loadingAccount, loadingTrans } = this.props;
    const { open, show, multisigaccounts } = this.state;
    // console.log('MultiSignature accounts', multiAccounts, 'transactions', transactions);
    const pageTitle = (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1' }}>
          <DeploymentUnitOutlined />
          <span style={{ marginLeft: '20px' }}>
            {formatMessage({ id: 'app.multi.multi-signature' })}
          </span>
          <span style={{ marginLeft: '10px', fontSize: '8px', color: 'red' }}>
            {formatMessage({ id: 'app.multi.remind' })}
          </span>
        </div>
        <div style={{ flex: '1', textAlign: 'right' }}>
          <span style={{ marginRight: '20px', fontSize: '14px' }}>
            {formatMessage({ id: 'app.multi.open-multiSignature' })}
          </span>
          <Switch
            onChange={this.onChange}
            disabled={Boolean(account.u_multisignatures && account.u_multisignatures.length)}
            checked={Boolean(account.u_multisignatures && account.u_multisignatures.length)}
          />
        </div>
      </div>
    );

    return (
      <PageHeaderWrapper title={pageTitle}>
        {transactions.length > 0 && (
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card
                bodyStyle={{ height: '300px', padding: '1px 0' }}
                title={formatMessage({ id: 'app.multi.new-multi-trans' })}
                headStyle={{ borderBottom: '1px solid #ccc' }}
              >
                <Table
                  loading={loadingTrans}
                  rowKey={record => record.transaction.id}
                  dataSource={transactions}
                  columns={this.columnsTrans}
                />
              </Card>
            </Col>
          </Row>
        )}
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card
              bodyStyle={{ height: '300px', padding: '1px 0' }}
              title={formatMessage({ id: 'app.multi.my-multigroup' })}
              headStyle={{ borderBottom: '1px solid #ccc' }}
            >
              {multiAccounts.length > 0 ? (
                <Table
                  loading={loadingAccount}
                  rowKey={record => record.address}
                  dataSource={multiAccounts}
                  columns={this.columnsAccount}
                />
              ) : (
                <div style={{ lineHeight: '300px', textAlign: 'center' }}>
                  <p>{formatMessage({ id: 'app.multi.no-group' })}</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>
        <OpenMultiModal open={open} close={this.closeModal} />
        <MultiMember closeMember={this.closeMember} show={show} multiAccounts={multisigaccounts} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user, multi, loading }) => ({
  account: user.currentAccount,
  multiAccounts: multi.accounts,
  transactions: multi.transactions,
  loadingAccount: loading.effects['multi/fetchAccounts'],
  loadingTrans: loading.effects['multi/fetchTransactions'],
}))(MultiSignature);
