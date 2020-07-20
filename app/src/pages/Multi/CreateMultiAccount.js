/**
 * @name 创建账户
 * @author Evanlai
 * @version 1.0
 * @createTime 2018.5.7
 *
 */

import React, { PureComponent } from 'react';
import { Steps, Button, Icon, Input, Slider, List, message, Alert } from 'antd';
import { getKeyStore } from '@/utils/authority';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

const { Step } = Steps;
const { Search } = Input;

const steps = [
  {
    title: formatMessage({ id: 'app.multi.multi-intro' }),
    icon: 'user',
    status: 'finish',
  },
  {
    title: formatMessage({ id: 'app.multi.assigned-member' }),
    icon: 'solution',
    status: 'process',
  },
  {
    title: formatMessage({ id: 'app.multi.check-info' }),
    icon: 'smile-o',
    status: 'wait',
  },
];

const stepsContent = {
  marginTop: '30px',
  border: '1px dashed #e9e9e9',
  borderRadius: '6px',
  backgroundColor: '#fafafa',
  minHeight: '200px',
  textAlign: 'center',
  padding: '30px 20px',
};

const stepsAction = {
  marginTop: '24px',
  textAlign: 'right',
};

class CreateMultiAccount extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      comfirmNumber: 2,
      groups: [],
      searchText: '',
      searchError: '',
      submitError: '',
    };
    this.keyStore = getKeyStore();
  }

  addGroup = (address, publicKey) => {
    const { groups } = this.state;
    const newGroups = [...groups];
    const keypair = {
      address,
      publicKey,
    };
    newGroups.push(keypair);
    this.setState({
      groups: newGroups,
    });
  };

  deleteGroup = item => {
    const { groups } = this.state;
    const newGroups = groups.filter(group => group.address !== item.address);
    this.setState({
      groups: newGroups,
    });
  };

  next = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  };

  prev = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1 });
  };

  handleOnSearchChange = e => {
    this.setState({ searchText: e.target.value, searchError: '' });
  };

  getGroup = value => {
    const { groups } = this.state;
    const { dispatch } = this.props;
    if (!value.startsWith('D')) {
      this.setState({ searchError: formatMessage({ id: 'app.multi.address-error' }) });
      return;
    }
    if (groups.find(group => group.address === value) || value === this.keyStore.address) {
      this.setState({ searchError: formatMessage({ id: 'app.multi.repeat-address' }) });
      return;
    }
    dispatch({
      type: 'multi/fetchPublickey',
      payload: { address: value },
      callback: response => {
        if (response.success) {
          if (response.publicKey) {
            this.addGroup(value, response.publicKey);
          } else {
            this.setState({ searchError: formatMessage({ id: 'app.multi.no-publicKey' }) });
          }
        } else {
          this.setState({ searchError: response.error });
        }
      },
    });
  };

  handleChange = value => {
    this.setState({
      comfirmNumber: value,
    });
  };

  emitEmpty = () => {
    this.setState({ searchText: '', searchError: '' });
  };

  getStepContents = currentStep => {
    const { comfirmNumber, searchText, groups, searchError, submitError } = this.state;
    const pair = {
      address: this.keyStore.address,
      publicKey: this.keyStore.publicKey,
    };
    const renderGroups = [...groups, pair];
    const suffix = searchText && (
      <Icon
        type="close-circle"
        onClick={this.emitEmpty}
        key={currentStep}
        style={{ marginRight: '10px' }}
      />
    );
    switch (currentStep) {
      case 0:
        return (
          <div style={{ textAlign: 'left' }} key={currentStep}>
            <h3 style={{ textAlign: 'center' }}>请仔细阅读</h3>
            <br />
            <p>
              本介绍将引导您通过必要的步骤来创建一个多重签名组. 请务必先了解何为多重签名,
              因为如果操作失误，有可能导致您帐户的余额丢失
            </p>
            <br />
            <p>
              一个多重签名组由N个帐户组成，创建这个多重签名组的人是签名组的所有者，当所有者的秘钥丢失时，参与者可以发起一条交易，若有M个签名组里的人进行过确认，这条交易即会被通过并广播播，M和N的值必须是M小于N
            </p>
            <br />
            <p>
              <b>您需要知道的多重签名组的内容：</b>
            </p>
            <p> • 签名组的成员数量N.</p>
            <p> • 每次交易需要确认的人数M</p>
            <p> • 您需要添加到多重签名组的人员的帐户名称或者帐户ID</p>
          </div>
        );
      case 1:
        return (
          <div key={currentStep}>
            <Search
              key={currentStep}
              placeholder={formatMessage({ id: 'app.multi.enter-member-address' })}
              enterButton
              size="large"
              suffix={suffix}
              value={searchText}
              onChange={this.handleOnSearchChange}
              onSearch={value => this.getGroup(value)}
            />
            <div style={{ color: 'red', textAlign: 'left' }}>{searchError}</div>
            <div style={{ marginTop: '20px' }}>
              <List
                bordered
                style={{ backgroundColor: '#fff', border: '1px dashed #ccc', marginTop: '10px' }}
                size="middle"
                dataSource={renderGroups}
                renderItem={item => (
                  <List.Item>
                    <div>{item.address}</div>
                    {item.publicKey !== this.keyStore.publicKey && (
                      <div style={{ flex: '1', textAlign: 'right' }}>
                        <Icon
                          type="close-circle"
                          onClick={() => this.deleteGroup(item)}
                          key={currentStep}
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                        />
                      </div>
                    )}
                  </List.Item>
                )}
              />
            </div>
            {renderGroups.length > 1 && (
              <div style={{ display: 'flex', padding: '20px' }}>
                <div style={{ flex: '1', textAlign: 'left', fontSize: '16px' }}>
                  {formatMessage({ id: 'app.multi.confirm-number' })}: <b>{comfirmNumber}</b>
                </div>
                <div style={{ flex: '1' }}>
                  <Slider
                    defaultValue={2}
                    disabled={false}
                    min={2}
                    max={renderGroups.length}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <div style={{ display: 'flex', fontSize: '16px', padding: '10px 20px' }}>
              <div style={{ flex: '1', textAlign: 'left' }}>
                {formatMessage({ id: 'app.multi.member-count' })}:
              </div>
              <div style={{ flex: '1', textAlign: 'right' }}>
                <b>{renderGroups.length}</b>
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: '16px', padding: '10px 20px' }}>
              <div style={{ flex: '1', textAlign: 'left' }}>
                {formatMessage({ id: 'app.multi.confirm-number' })}:
              </div>
              <div style={{ flex: '1', textAlign: 'right' }}>
                <b>{comfirmNumber}</b>
              </div>
            </div>
            <List
              bordered
              style={{ backgroundColor: '#fff', border: '1px dashed #ccc', marginTop: '10px' }}
              size="middle"
              dataSource={renderGroups}
              renderItem={item => (
                <List.Item>
                  <div>{item.address}</div>
                </List.Item>
              )}
            />
            <div style={{ display: 'flex', fontSize: '16px', padding: '10px 20px' }}>
              <div style={{ flex: '1', textAlign: 'left' }}>
                {formatMessage({ id: 'app.multi.fees' })} :
              </div>
              <div style={{ flex: '1', textAlign: 'right' }}>
                <b>{renderGroups.length * 5}</b>
              </div>
            </div>
            {submitError && <Alert type="error" message={submitError} />}
          </div>
        );
      default:
        return formatMessage({ id: 'app.multi.failure' });
    }
  };

  handleSummit = async () => {
    const { comfirmNumber, groups } = this.state;
    const { dispatch } = this.props;
    const keysgroup = groups.map(group => `+${group.publicKey}`);
    const transaction = await DdnJS.multisignature.createMultisignature(
      keysgroup,
      24,
      comfirmNumber,
      this.keyStore.phaseKey,
      null
    );
    console.log('transaction', transaction);
    dispatch({
      type: 'multi/createMultiTansactions',
      payload: { transaction },
      callback: response => {
        console.log('response', response);
        if (response.success) {
          message.success(formatMessage({ id: 'app.multi.created-success' }));
        } else {
          this.setState({ submitError: response.error });
        }
      },
    });
  };

  render() {
    const { currentStep, groups } = this.state;
    return (
      <div>
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div style={stepsContent}>{this.getStepContents(currentStep)}</div>
        <div style={stepsAction}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={this.prev} key={-1}>
              {formatMessage({ id: 'app.multi.back' })}
            </Button>
          )}
          {currentStep === 0 && (
            <Button type="primary" onClick={this.next} key={0}>
              {formatMessage({ id: 'app.multi.nextstep' })}
            </Button>
          )}
          {currentStep === 1 && (
            <Button type="primary" onClick={this.next} disabled={groups.length < 1} key={1}>
              {formatMessage({ id: 'app.multi.verify' })}
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={this.handleSummit} key={2}>
              {formatMessage({ id: 'app.multi.enter' })}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default connect(({ multi }) => ({
  multiAccounts: multi.accounts,
}))(CreateMultiAccount);
