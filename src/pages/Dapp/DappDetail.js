import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Avatar, Rate, Card, Modal, Input, message } from 'antd';

const { confirm } = Modal;
const INSTALL = 'install';
const UNINSTALL = 'uninstall';
const LAUNCHED = 'launched';

@connect(({ dapp, loading }) => ({
  dappDetail: dapp.dappDetail,
  catagories: dapp.catagories,
  loading: loading.models.dapp,
}))
class DappDetail extends PureComponent {
  state = {
    isOpened: false,
    installed: false,
    modalTitle: '卸载确认',
    type: INSTALL,
    master: '',
  };

  componentDidMount() {
    this.getDappInfo();
    const {
      history: {
        location: { query },
      },
    } = this.props;
    if (query.installed === 'true') {
      this.setState({
        installed: true,
      });
    } else {
      this.setState({
        installed: false,
      });
    }
  }

  getDappInfo = () => {
    console.log(this.props);
    const {
      dispatch,
      history: {
        location: { query },
      },
    } = this.props;
    dispatch({
      type: 'dapp/fetchDappDetail',
      payload: { id: query.dappid },
    });
  };

  runDapp = () => {
    const {
      dispatch,
      history: {
        location: { query },
      },
    } = this.props;
    dispatch({
      type: 'dapp/runDapp',
      payload: { id: query.dappid },
    });
  };

  // launchedDapp = () => {
  //   const { dispatch, history: { location: { query } } } = this.props;
  //   dispatch({
  //     type: 'dapp/runDapp',
  //     payload: { id: query.dappid }
  //   });
  // }

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
        self.openInputModal(UNINSTALL);
      },
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  onConfirmInstall = () => {
    const self = this;
    confirm({
      title: '确定安装?',
      content: '节点下载dapp文件到节点上',
      onOk() {
        self.openInputModal(INSTALL);
      },
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  launchedDapp = () => {
    const self = this;
    confirm({
      title: '确定运行dapp?',
      content: '运行后节点会运行dapp，并且获得token奖励',
      onOk() {
        self.openInputModal(LAUNCHED);
      },
      onCancel() {},
      okText: '确认',
      cancelText: '取消',
    });
  };

  openInputModal = type => {
    let title;
    if (type === INSTALL) {
      title = '安装确认';
    } else if (type === UNINSTALL) {
      title = '卸载确认';
    } else {
      title = '运行确认';
    }
    this.setState({ isOpened: true, modalTitle: title, type });
  };

  closeInputModal = () => {
    this.setState({ isOpened: false });
  };

  onUninstall = () => {
    const { master, type } = this.state;
    console.log(master, type);
    const {
      dispatch,
      history: {
        location: { query },
      },
    } = this.props;
    if (type === INSTALL) {
      dispatch({
        type: 'dapp/install',
        payload: { id: query.dappid, master },
        callback: res => {
          if (!res.success) {
            message.error(res.error);
          }
        },
      });
    } else if (type === UNINSTALL) {
      dispatch({
        type: 'dapp/uninstall',
        payload: { id: query.dappid, master },
        callback: res => {
          if (!res.success) {
            message.error(res.error);
          }
        },
      });
    } else if (type === LAUNCHED) {
      dispatch({
        type: 'dapp/launched',
        payload: { id: query.dappid, master },
        callback: res => {
          if (!res.success) {
            message.error(res.error);
          }
        },
      });
    }
  };

  masterChange = text => {
    this.setState({
      master: text.target.value,
    });
  };

  render() {
    const { dappDetail } = this.props;
    const { isOpened, installed, modalTitle, master } = this.state;
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
                {installed ? (
                  <div>
                    {dappDetail.launched ? (
                      <Button type="primary" onClick={this.runDapp} style={{ marginRight: 10 }}>
                        打开
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={this.launchedDapp}
                        style={{ marginRight: 10 }}
                      >
                        运行
                      </Button>
                    )}
                    <Button type="dashed" onClick={this.onConfirmUninstall}>
                      卸载
                    </Button>
                  </div>
                ) : (
                  <Button type="primary" onClick={this.onConfirmInstall}>
                    安装
                  </Button>
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
          title={modalTitle}
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
            <Input value={master} onChange={this.masterChange} />
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
