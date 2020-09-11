import React, { PureComponent } from 'react';
import { Row, Col, Icon } from 'antd';
import { formatMessage } from 'umi/locale';

const leftStyle = {
  textAlign: 'left',
};
const rightStyle = {
  textAlign: 'right',
  marginLeft: '20px',
};
class DelegateModal extends PureComponent {
  render() {
    const { curDelegate } = this.props;

    console.log('curDelegate............', curDelegate);

    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>
          <Icon type="user" theme="outlined" style={{ marginRight: '20px' }} />{' '}
          {formatMessage({ id: 'app.vote.detail' })}
        </h2>
        <div>
          <Row style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
            <Col span={6}>
              <div style={leftStyle}> {formatMessage({ id: 'app.vote.username' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{curDelegate.username}</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.address' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{curDelegate.address}</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.publicKey' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{`${curDelegate.publicKey.slice(
                1,
                20
              )}...${curDelegate.publicKey.slice(-20)}`}</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.balance' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{parseInt(curDelegate.balance / 100000000, 10)} DDN</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.producedblocks' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{curDelegate.producedblocks}</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.missedblocks' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{curDelegate.missedblocks}</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.rewards' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{curDelegate.rewards / 100000000} DDN</div>
            </Col>
          </Row>
          <Row style={{ padding: '10px' }}>
            <Col span={6}>
              <div style={leftStyle}>{formatMessage({ id: 'app.vote.receivedfees' })} : </div>
            </Col>
            <Col span={18}>
              <div style={rightStyle}>{curDelegate.fees / 100000000} DDN</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default DelegateModal;
