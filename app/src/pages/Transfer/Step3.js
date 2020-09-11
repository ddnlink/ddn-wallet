import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import { formatMessage } from 'umi/locale';
import styles from './style.less';

@connect(({ transfer }) => ({
  data: transfer.step,
}))
class Step3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      router.push('/transfer/fill');
    };
    const information = (
      <div className={styles.information}>
        {/* <Row>
          <Col xs={24} sm={8} className={styles.label}>
            付款账户：
          </Col>
          <Col xs={24} sm={16}>
            {data.payAccount}
          </Col>
        </Row> */}
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.receive-address' })}
          </Col>
          <Col xs={24} sm={16}>
            {data.receiverAccount}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.transfer-amount' })}
          </Col>
          <Col xs={24} sm={16}>
            <span className={styles.money}>{data.amount}</span> DDN
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.fees' })}
          </Col>
          <Col xs={24} sm={16}>
            <span>0.1 DDN</span>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            {formatMessage({ id: 'app.transfer.message' })}
          </Col>
          <Col xs={24} sm={16}>
            {data.remark}
          </Col>
        </Row>
        {data.transId && (
          <Row>
            <Col xs={24} sm={8} className={styles.label}>
              {formatMessage({ id: 'app.transfer.transactionId' })}：
            </Col>
            <Col xs={24} sm={16}>
              <a
              // TODO：抽取为常量
                href={`http://testnet.ddn.link/transactions/${data.transId}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {`${data.transId.slice(0, 20)}...${data.transId.slice(-20)}`}
              </a>
            </Col>
          </Row>
        )}
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          {formatMessage({ id: 'app.transfer.transfer-again' })}
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title={formatMessage({ id: 'app.transfer.operate-success' })}
        description={formatMessage({ id: 'app.transfer.success-info' })}
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default Step3;
