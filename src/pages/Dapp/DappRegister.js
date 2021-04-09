import React, { PureComponent } from 'react';
import { Button, Modal, Input, message } from 'antd';
import { getKeyStore } from '@/utils/authority';
import { connect } from 'dva';
// import { formatMessage } from 'umi/locale';

const { TextArea } = Input;

@connect(({ dapp }) => ({
  dapp,
}))
class DappRegister extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      delegateName: '',
      // inputError: '',
      currentStep: 1,
      dappInfo: {},
    };
  }

  handleOnInputChange = (e, item) => {
    const { dappInfo } = this.state;
    const content = e.target.value;
    const newDappInfo = { ...dappInfo };
    newDappInfo[item] = content;
    this.setState({
      dappInfo: newDappInfo,
    });
  };

  handleOpenModal = () => {
    this.setState({ visible: true });
  };

  handleCloseModal = () => {
    this.setState({ visible: false });
  };

  handleNameChange = e => {
    this.setState({
      delegateName: e.target.value,
      // inputError: '',
    });
  };

  handleRegisterDelegate = async () => {
    const { delegateName } = this.state;
    const { dispatch } = this.props;
    const keyStore = getKeyStore();
    const trs = await DdnJS.delegate.createDelegate(delegateName, keyStore.phaseKey, null);
    const payload = { transaction: trs };
    dispatch({
      type: 'dapp/postReigster',
      payload,
      callback: response => {
        if (response.success) {
          this.handleCloseModal();
        } else {
          // this.setState({ inputError: response.error });
          message.error(response.error);
        }
      },
    });
  };

  next = () => {
    const { currentStep } = this.state;
    if (currentStep > 4) {
      return;
    }
    if (currentStep === 4) {
      this.handleRegisterDelegate();
      this.done();
    } else {
      this.setState({ currentStep: currentStep + 1 });
    }
  };

  prev = () => {
    const { currentStep } = this.state;
    if (currentStep < 1) {
      return;
    }
    if (currentStep === 1) {
      this.handleCloseModal();
    } else {
      this.setState({ currentStep: currentStep - 1 });
    }
  };

  done = () => {
    this.handleCloseModal();
  };

  getStepTitle = () => {
    const { currentStep } = this.state;
    switch (currentStep) {
      case 1:
        return '前言';
      case 2:
        return 'Dapp信息';
      case 3:
        return 'Dapp源码链接';
      case 4:
        return '信息确认';
      default:
        return '';
    }
  };

  getStepSubTitle = () => {
    const { currentStep } = this.state;
    switch (currentStep) {
      case 1:
        return '请仔细阅读下面到内容';
      case 2:
        return '请输入Dapp相关信息';
      case 3:
        return '填写Dapp源码下载链接';
      case 4:
        return '请确认以下内容是否有误';
      default:
        return '';
    }
  };

  getStepContent = () => {
    const { currentStep, dappInfo } = this.state;
    switch (currentStep) {
      case 1:
        return (
          <div style={{ fontSize: 12 }}>
            <p>
              您正在注册您的Dapp到DDN区块链上，在注册流程结束后，所有用户将可以在DDN的Dapp商店上看到您的Dapp，而且大家也可以直接下载安装并运行您的Dapp
              区块链技术的一个特点是，您无法删除区块链上面的任何内容，因此，请确认您的Dapp准确无误，同时，我们也建议您先在DDN官网上提供的测试网络上试运行以保证Dapp完美上线。
            </p>
            <h3>注册流程须知</h3>
            <p>1. Dapp的名称是唯一的，您无法注册一个别人已经在DDN网络上使用的名称</p>
            <p>2. 您可以选择使用中心话（如Github）或者去中心化的存储方式，</p>
            <p>3. 请去人您的Dapp图标是正方形的</p>
            <p>4. 请慎重选择标签，这样您的用户才能通过该标签在Dapp商店搜索到您的Dapp</p>
            <br />
            <p>
              DDN团队不对任何Dapp承担责任，所有责任归于发布者，所以确认您的Dapp是合法且对用户无害的。
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>名称</div>
            <div>
              <Input onChange={e => this.handleOnInputChange(e, 'name')} />
            </div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>描述</div>
            <div>
              <TextArea onChange={e => this.handleOnInputChange(e, 'description')} />
            </div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>标签(用逗号分隔)</div>
            <div>
              <Input onChange={e => this.handleOnInputChange(e, 'tags')} />
            </div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>Icon 链接</div>
            <div>
              <Input onChange={e => this.handleOnInputChange(e, 'icon')} />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div>
              <p>Github是一个基于网页的源码托管服务，它提供了源代码管理功能</p>
              <p>
                Github提供了图形界面以及桌面与移动端融合，如果您添加您的Dapp源码到Github，那您需要在下面输入您到Github链接
              </p>
            </div>
            <div style={{ marginTop: 30, marginBottom: 10 }}>源码链接</div>
            <div>
              <Input onChange={e => this.handleOnInputChange(e, 'code')} />
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>名称</div>
            <div>{dappInfo.name}</div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>描述</div>
            <div>{dappInfo.description}</div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>标签</div>
            <div>{dappInfo.tags}</div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>Icon 链接</div>
            <div>{dappInfo.icon}</div>
            <div style={{ marginTop: 20, marginBottom: 10, fontWeight: 600 }}>Code 链接</div>
            <div>{dappInfo.code}</div>
          </div>
        );
      default:
        return '';
    }
  };

  render() {
    const { visible, currentStep } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.handleOpenModal}>
          注册Dapp
          {/* {formatMessage({ id: 'app.dapp.dapp-register' })} */}
        </Button>
        <Modal
          title="注册Dapp"
          centered
          visible={visible}
          bodyStyle={{ padding: '10px' }}
          onCancel={this.prev}
          onOk={this.next}
          cancelText={currentStep > 1 ? '上一步' : null}
          okText={currentStep === 4 ? '确定' : '接受/下一步'}
          destroyOnClose
        >
          <div style={{ padding: '20px', borderBottom: '2px solid #f5f5f5', textAlign: 'center' }}>
            <div style={{ padding: '0 10px', fontSize: 20, fontWeight: 600 }}>
              步骤 {currentStep}
              /4 {this.getStepTitle(currentStep)}
            </div>
            <div>{this.getStepSubTitle(currentStep)}</div>
          </div>
          <div style={{ minHeight: 300, padding: 10 }}>{this.getStepContent(currentStep)}</div>
        </Modal>
      </div>
    );
  }
}

export default DappRegister;
