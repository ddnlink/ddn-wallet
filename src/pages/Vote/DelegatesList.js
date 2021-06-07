import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Badge, Table, Alert, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import PasswordModal from '@/components/PasswordModal';
// import DdnJS from '@/utils/ddn-js';

import { getKeyStore, getUser } from '@/utils/authority';
import DelegateModal from './DelegateModal';
import VoteModal from './VoteModal';
import styles from './DelegatesList.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'success'];
const status = [formatMessage({ id: 'app.vote.unvoted' }), formatMessage({ id: 'app.vote.voted' })];

/* eslint react/no-multi-comp:0 */
@connect(({ vote, user, loading }) => ({
  delegates: vote.delegates,
  standbyDelegates: vote.standbyDelegates,
  currentAccount: user.currentAccount,
  loading: loading.models.vote,
}))
@Form.create()
class DelegatesList extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
    selectedStandbyRows: [],
    selectedStandbyRowKeys: [],
    visibleDelegate: false,
    curDelegate: {},
    open: false,
  };

  columns = [
    {
      title: formatMessage({ id: 'app.vote.rate' }),
      dataIndex: 'rate',
    },
    {
      title: formatMessage({ id: 'app.vote.delegateName' }),
      dataIndex: 'username',
    },
    {
      title: formatMessage({ id: 'app.vote.address' }),
      dataIndex: 'address',
      render: (text, record) => (
        <Fragment>
          <a
            rel="noopener"
            onClick={() => {
              this.handleSetCurDelegate(record);
            }}
          >
            {' '}
            {record.address}{' '}
          </a>
        </Fragment>
      ),
    },
    {
      title: formatMessage({ id: 'app.vote.approval' }),
      dataIndex: 'approval',
      // align: 'right',
      render: val => `${val} %`,
    },
    {
      title: formatMessage({ id: 'app.vote.productivity' }),
      dataIndex: 'productivity',
      // align: 'right',
      render: val => `${val} %`,
    },
    {
      title: formatMessage({ id: 'app.vote.status' }),
      dataIndex: 'status',
      render(text, record) {
        const val = record.voted ? 1 : 0;
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
  ];

  componentDidMount() {
    const { dispatch, currentAccount } = this.props;
    dispatch({
      type: 'vote/fetchDelegates',
      payload: { address: currentAccount.address },
    });
    dispatch({
      type: 'vote/fetchStandbyDelegates',
      payload: { address: currentAccount.address, offset: 101, limit: 10 },
    });
  }

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };

  handleSelectStandbyRows = (selectedStandbyRowKeys, selectedStandbyRows) => {
    console.log('handleSelectStandbyRows........', selectedStandbyRows, selectedStandbyRowKeys);
    this.setState({
      selectedStandbyRows,
      selectedStandbyRowKeys,
    });
  };

  cleanSelectedKeys = () => {
    this.handleSelectRows([], []);
  };

  cleanSelectedStandbyKeys = () => {
    this.handleSelectStandbyRows([], []);
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };

  handleVoteDelegate = async selectedRows => {
    await this.submit(null, selectedRows);
    // const { dispatch } = this.props;
    // const keyStore = getKeyStore();
    // if (selectedRows.length < 1) return;
    // const datap = selectedRows.map(row => (row.voted ? `-${row.publicKey}` : `+${row.publicKey}`));
    // const trs = await DdnJS.vote.createVote(datap, keyStore.phaseKey);
    // const payload = { transaction: trs };
    // dispatch({
    //   type: 'vote/voting',
    //   payload,
    //   callback: response => {
    //     console.log('callback starting. ', response);
    //     this.setState({
    //       selectedRows: [],
    //     });
    //   },
    // });
  };

  handleSetCurDelegate = record => {
    console.log('record', record);
    this.setState({
      curDelegate: record,
      visibleDelegate: true,
    });
  };

  handleCloseDelegateModal = () => {
    this.setState({
      curDelegate: {},
      visibleDelegate: false,
    });
  };

  submit = async (password = null, selectedRows) => {
    const { dispatch } = this.props;
    const keyStore = getKeyStore();
    if (selectedRows.length < 1) return;
    const datap = selectedRows.map(row => (row.voted ? `-${row.publicKey}` : `+${row.publicKey}`));
    const trs = await DdnJS.vote.createVote(datap, keyStore.phaseKey, password);
    const payload = { transaction: trs };
    dispatch({
      type: 'vote/voting',
      payload,
      callback: response => {
        console.log('callback starting. ', response);
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handlePassword = async password => {
    const { selectedRows } = this.state;
    await this.submit(password, selectedRows);
    this.setState({
      open: false,
    });
  };

  open = selectedRows => {
    this.setState({
      open: true,
      selectedRows,
    });
  };

  render() {
    const { delegates, standbyDelegates, loading } = this.props;
    const {
      selectedRowKeys,
      selectedRows,
      selectedStandbyRows,
      selectedStandbyRowKeys,
      visibleDelegate,
      curDelegate,
      open,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: record.voted,
      }),
    };
    const { haveSecondSign } = getUser();
    const standbyRowSelection = {
      selectedRowKeys: selectedStandbyRowKeys,
      onChange: this.handleSelectStandbyRows,
      getCheckboxProps: record => ({
        disabled: record.voted,
      }),
    };

    console.log('standbyRowSelection', standbyRowSelection);
    return (
      <div>
        <Card bordered={false} title={formatMessage({ id: 'app.vote.delegater' })}>
          <div className={styles.tableList}>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <Fragment>
                    {formatMessage({ id: 'app.vote.selected' })}{' '}
                    <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}
                    {formatMessage({ id: 'app.vote.item' })}
                    &nbsp;&nbsp;
                    <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                      {formatMessage({ id: 'app.vote.clean-up' })}
                    </a>
                    <div style={{ float: 'right' }}>
                      {selectedRowKeys.length > 0 && (
                        <VoteModal
                          selectedRows={selectedRows}
                          deVote={false}
                          handleVoteDelegate={haveSecondSign ? this.open : this.handleVoteDelegate}
                        />
                      )}
                    </div>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </div>
            <Table
              loading={loading}
              rowKey={record => record.publicKey}
              rowSelection={rowSelection}
              dataSource={delegates.list}
              columns={this.columns}
              pagination={delegates.pagination}
            />
          </div>
        </Card>
        <Card
          bordered={false}
          title={formatMessage(
            { id: 'app.vote.standby-delegate' },
            { total: standbyDelegates.pagination.total }
          )}
          style={{ marginTop: '20px' }}
        >
          <div className={styles.tableList}>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <Fragment>
                    {formatMessage({ id: 'app.vote.selected' })}{' '}
                    <a style={{ fontWeight: 600 }}>{selectedStandbyRowKeys.length}</a>{' '}
                    {formatMessage({ id: 'app.vote.item' })}
                    &nbsp;&nbsp;
                    <a onClick={this.cleanSelectedStandbyKeys} style={{ marginLeft: 24 }}>
                      {formatMessage({ id: 'app.vote.clean-up' })}
                    </a>
                    <div style={{ float: 'right' }}>
                      {selectedStandbyRows.length > 0 && (
                        <VoteModal
                          selectedRows={selectedStandbyRows}
                          deVote={false}
                          handleVoteDelegate={this.handleVoteDelegate}
                        />
                      )}
                    </div>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </div>
            <Table
              loading={loading}
              rowKey={record => record.publicKey}
              rowSelection={standbyRowSelection}
              dataSource={standbyDelegates.list}
              columns={this.columns}
              pagination={standbyDelegates.pagination}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          centered
          visible={visibleDelegate}
          width="600px"
          bodyStyle={{ padding: '30px 50px' }}
          onCancel={this.handleCloseDelegateModal}
          footer={false}
          destroyOnClose
        >
          <DelegateModal curDelegate={curDelegate} deVote={false} />
        </Modal>
        <PasswordModal open={open} handlePassword={this.handlePassword} />
      </div>
    );
  }
}

export default DelegatesList;
