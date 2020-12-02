import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Avatar, Rate, Card, Modal, Input } from 'antd';

const { confirm } = Modal;

@connect(({ dapp, loading }) => ({
  dappDetail: dapp.dappDetail,
  catagories: dapp.catagories,
  loading: loading.models.dapp,
}))
class DappDetail extends PureComponent {
  state = {
    isOpened: false,
  };

  componentDidMount() {
    this.getDappInfo();
  }

  getDappInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dapp/fetchDappDetail',
    });
  };

  getCatagryName = type => {
    const { catagories } = this.props;
    const keys = Object.keys(catagories);
    let cName = '';
    keys.forEach(key => {
      if (catagories[key] === Number(type)) {
        cName = key;
      }
    });
    return cName;
  };

  onConfirmUninstall = () => {
    const self = this;
    confirm({
      title: '确定卸载?',
      content: '卸载后该Dapp将会从该节点中移除',
      onOk() {
        self.openInputModal();
      },
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  openInputModal = () => {
    this.setState({ isOpened: true });
  };

  closeInputModal = () => {
    this.setState({ isOpened: false });
  };

  onUninstall = () => {};

  render() {
    const { dappDetail } = this.props;
    const { isOpened } = this.state;
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
              <div>
                {dappDetail.status === 'installed' ? (
                  <div>
                    <Button type="primary" style={{ marginRight: 10 }}>
                      运行
                    </Button>
                    <Button type="dashed" onClick={this.onConfirmUninstall}>
                      卸载
                    </Button>
                  </div>
                ) : (
                  <Button type="primary">安装</Button>
                )}
              </div>
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
        <Modal
          title="卸载确认"
          visible={isOpened}
          onOk={this.onUninstall}
          onCancel={this.closeInputModal}
          okText="确认"
          cancelText="取消"
        >
          <div style={{ textAlign: 'center' }}>
            <h2>账户验证</h2>
            <p>请输入Dapp安装密码</p>
          </div>
          <div>
            <Input block />
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(({ home, loading }) => ({
  home,
  loading: loading.effects['home/fetch'],
}))(DappDetail);
