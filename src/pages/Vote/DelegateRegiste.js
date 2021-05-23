import React, { PureComponent } from 'react';
import { Button, Modal, Alert, Input, Icon } from 'antd';
import { getKeyStore } from '@/utils/authority';
import { connect } from 'dva';
import { formatMessage } from 'umi';

@connect(({ vote }) => ({
  vote,
}))
class DelegateRegiste extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      delegateName: '',
      inputError: '',
    };
  }

  handleOpenModal = () => {
    this.setState({ visible: true });
  };

  handleCloseModal = () => {
    this.setState({ visible: false });
  };

  handleNameChange = e => {
    this.setState({
      delegateName: e.target.value,
      inputError: '',
    });
  };

  handleRegisterDelegate = async () => {
    const { delegateName } = this.state;
    const { dispatch } = this.props;
    const keyStore = getKeyStore();
    const trs = await DdnJS.delegate.createDelegate(delegateName, keyStore.phaseKey, null);
    const payload = { transaction: trs };
    // console.log('payload= ', payload);
    dispatch({
      type: 'vote/postReigster',
      payload,
      callback: response => {
        // console.log('callback starting. ', response);
        if (response.success) {
          this.handleCloseModal();
        } else {
          this.setState({ inputError: response.error });
        }
      },
    });
  };

  render() {
    const { visible, delegateName, inputError } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.handleOpenModal}>
          {formatMessage({ id: 'app.vote.set-delegate' })}
        </Button>
        <Modal
          title={formatMessage({ id: 'app.vote.set-delegate' })}
          centered
          visible={visible}
          bodyStyle={{ padding: '30px 50px' }}
          onCancel={this.handleCloseModal}
          onOk={this.handleRegisterDelegate}
          destroyOnClose
        >
          <div style={{ display: 'flex', marginBottom: '30px' }}>
            <div style={{ padding: '0 10px' }}>
              <Icon type="info-circle" theme="filled" />
            </div>
            <div>{formatMessage({ id: 'app.vote.set-delegate-info' })}</div>
          </div>
          <div style={{ padding: '5px' }}>
            <h3>{formatMessage({ id: 'app.vote.set-delegate-placeholder' })}</h3>
            <Input
              placeholder={formatMessage({ id: 'app.vote.set-delegate-placeholder' })}
              value={delegateName}
              onChange={this.handleNameChange}
            />
            {inputError && (
              <div style={{ padding: '5px 2px' }}>
                <Alert
                  message={
                    <div>
                      <Icon type="warning" theme="filled" style={{ marginRight: '5px' }} />
                      <span>{inputError}</span>
                    </div>
                  }
                  type="error"
                />
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default DelegateRegiste;
