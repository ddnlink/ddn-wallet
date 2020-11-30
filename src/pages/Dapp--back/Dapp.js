import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card } from 'antd';

class Dapp extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'home/fetch',
    });
  }

  render() {
    const { home, loading } = this.props;
    return (
      <div>
        <h1>Dapp</h1>
        <Row gutter={24}>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <p>卡片内容</p>
              <p>卡片内容</p>
              <p>卡片内容</p>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/fetch'],
}))(Dapp);
