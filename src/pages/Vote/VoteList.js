import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Table, Alert, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import { getKeyStore, getUser } from '@/utils/authority';
import PasswordModal from '@/components/PasswordModal';
import DelegateModal from './DelegateModal';
import VoteModal from './VoteModal';
import styles from './DelegatesList.less';

/* eslint react/no-multi-comp:0 */
@connect(({ vote, user, loading }) => ({
  vote,
  currentAccount: user.currentAccount,
  loading: loading.models.vote,
}))
class VoteList extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowKeys: [],
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
  ];

  componentDidMount() {
    const { dispatch, currentAccount } = this.props;
    dispatch({
      type: 'vote/fetchVotedDelegates',
      payload: { address: currentAccount.address },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
  };

  handleSelectRows = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    this.setState({
      selectedRows,
      selectedRowKeys,
    });
  };

  cleanSelectedKeys = () => {
    this.handleSelectRows([], []);
  };

  handleVoteDelegate = async () => {
    await this.submit();
    // const { selectedRows } = this.state;
    // const { dispatch } = this.props;
    // console.log('selectedRowKeys', selectedRows);
    // const keyStore = getKeyStore();
    // console.log('keyStore', keyStore);
    // if (selectedRows.length < 1) return;
    // const datap = selectedRows.map(row => `-${row.publicKey}`);
    // console.log('datap', datap);
    // const trs = await DdnJS.vote.createVote(datap, keyStore.phaseKey);
    // const payload = { transaction: trs };
    // console.log('payload= ', payload);
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
    console.log('record。。。。。', record);
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

  handlePassword = async password => {
    await this.submit(password);
    this.setState({
      open: false,
    });
  };

  submit = async (password = null) => {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    console.log('selectedRowKeys', selectedRows);
    const keyStore = getKeyStore();
    console.log('keyStore', keyStore);
    if (selectedRows.length < 1) return;
    const datap = selectedRows.map(row => `-${row.publicKey}`);
    console.log('datap', datap);
    const trs = await DdnJS.vote.createVote(datap, keyStore.phaseKey, password);
    const payload = { transaction: trs };
    console.log('payload= ', payload);
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

  open = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const {
      vote: { votedDelegates },
      loading,
    } = this.props;
    const { selectedRowKeys, selectedRows, visibleDelegate, curDelegate, open } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: record.voted,
      }),
    };
    const { haveSecondSign } = getUser();
    return (
      <div>
        <Card bordered={false}>
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
                          deVote
                          handleDeleteDelegate={this.handleDeleteDelegate}
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
              rowKey={record => record.username}
              rowSelection={rowSelection}
              dataSource={votedDelegates.list}
              columns={this.columns}
              pagination={votedDelegates.paginationProps}
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
          <DelegateModal curDelegate={curDelegate} />
        </Modal>
        <PasswordModal open={open} handlePassword={this.handlePassword} />
      </div>
    );
  }
}

export default VoteList;
