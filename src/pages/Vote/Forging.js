import React, { PureComponent } from 'react';
import { Row, Col, Card, Table } from 'antd';
import { connect } from 'dva';
import { Pie } from '@/components/Charts';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { formatMessage } from 'umi';
import styles from './Forging.less';

@connect(({ vote, user, loading }) => ({
  voters: vote.voters,
  delegateInfo: vote.delegateInfo,
  currentAccount: user.currentAccount,
  loading: loading.effects['vote/fetchVoters'],
}))
class Forging extends PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'app.vote.username' }),
      dataIndex: 'username',
    },
    {
      title: formatMessage({ id: 'app.vote.address' }),
      dataIndex: 'address',
    },
    {
      title: formatMessage({ id: 'app.vote.weight' }),
      dataIndex: 'weight',
      render: text => <div>{`${text}%`}</div>,
    },
  ];

  componentDidMount() {
    const { dispatch, currentAccount } = this.props;
    // console.log('currentAccount', currentAccount);
    dispatch({
      type: 'vote/fetchVoters',
      payload: { publicKey: currentAccount.publicKey },
    });
  }

  render() {
    const { voters, loading, delegateInfo } = this.props;
    // console.log('delegateInfo', delegateInfo);
    const topColResponsiveProps = {
      xs: 24,
      sm: 8,
      md: 8,
      lg: 8,
      xl: 8,
    };

    return (
      <GridContent>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <Card className={styles.pieCard}>
              <Pie
                animate={false}
                percent={100}
                subTitle={formatMessage({ id: 'app.vote.rate' })}
                total={delegateInfo.rate || '无'}
                height={160}
                lineWidth={2}
              />
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card className={styles.pieCard}>
              <Pie
                animate={false}
                color="#5DDECF"
                percent={delegateInfo.approval || 0}
                subTitle={formatMessage({ id: 'app.vote.approval' })}
                total={`${delegateInfo.approval || 0}%`}
                height={160}
                lineWidth={1}
              />
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card className={styles.pieCard}>
              <Pie
                animate={false}
                color="#2FC25B"
                percent={delegateInfo.productivity || 0}
                subTitle={formatMessage({ id: 'app.vote.productivity' })}
                total={`${delegateInfo.productivity || 0}%`}
                height={160}
                lineWidth={1}
              />
            </Card>
          </Col>
        </Row>
        <Card
          bordered={false}
          title={formatMessage({ id: 'app.vote.voters' })}
          style={{ marginTop: '20px' }}
        >
          <Table
            loading={loading}
            bordered
            rowKey={record => record.username}
            dataSource={voters.list}
            columns={this.columns}
            pagination={voters.paginationProps}
          />
        </Card>
      </GridContent>
    );
  }
}

export default Forging;
