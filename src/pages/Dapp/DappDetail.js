import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Avatar, Rate, Card } from 'antd';
import dapp from '@/models/dapp';

@connect(({ dapp, loading }) => ({
  dappDetail: dapp.dappDetail,
  catagories: dapp.catagories,
  loading: loading.models.dapp,
}))
class DappDetail extends PureComponent {
  componentDidMount() {
    this.getDappInfo();
  }

  getDappInfo = () => {
    this.props.dispatch({
      type: 'dapp/fetchDappDetail',
    });
  };

  getCatagryName = type => {
    const { catagories } = this.props;
    console.log('catagories', catagories);
    let keys = Object.keys(catagories);
    let cName = '';
    keys.forEach(key => {
      if (catagories[key] === Number(type)) {
        cName = key;
      }
    });
    return cName;
  };

  render() {
    const { dappDetail, loading } = this.props;
    console.log('dappDetail', dappDetail, 'loading', loading);
    return (
      <div>
        <h1>详情页</h1>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', height: '140px' }}>
            <div>
              <Avatar size={120} icon="user" shape="square" />
            </div>
            <div style={{ marginLeft: '30px', lineHeight: '30px' }}>
              <div>{dappDetail.name}</div>
              <div>action, 操作</div>
              <div>{this.getCatagryName(dappDetail.category)}</div>
              <div>
                <Rate allowHalf disabled defaultValue={2.5} style={{ fontSize: '10px' }} />
                （234）
              </div>
            </div>
          </div>
        </Card>
        <Card bordered={false} title="Dapp内容">
          <div>{dappDetail.description}</div>
        </Card>
      </div>
    );
  }
}

export default connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/fetch'],
}))(DappDetail);
