import React from 'react';
import { Modal, Input, Alert, Button } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi';
import Result from '@/components/Result';
import styles from './index.less';

const main = {
  width: '450px',
};

class LockModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lockHeight: '',
      heightHelp: '',
    };
  }

  handleCancel = () => {
    const { close } = this.props;
    this.setState({
      lockHeight: '',
      heightHelp: '',
    });
    close();
  };

  handleHeightChange = e => {
    const value = parseInt(e.target.value, 10);
    this.setState({
      lockHeight: value,
      heightHelp: '',
    });
  };

  handleOk = async () => {
    const { lockHeight } = this.state;
    const { height, handleLock } = this.props;
    if (!lockHeight) {
      this.setState({ heightHelp: formatMessage({ id: 'component.lockModal.noEmpty' }) });
      return;
    }
    if (lockHeight < height) {
      this.setState({ heightHelp: formatMessage({ id: 'component.lockModal.lessthan' }) });
      return;
    }
    handleLock(lockHeight);
  };

  getModalContent = () => {
    const { lockHeight, heightHelp } = this.state;
    const { height, lockResponse } = this.props;
    let duration;
    if (lockHeight && lockHeight > height) {
      duration = moment.duration((lockHeight - height) * 10 * 1000).asDays();
    }
    if (lockResponse.success) {
      return (
        <Result
          type="success"
          title={formatMessage({ id: 'component.lockModal.lockSuccess' })}
          description={`${formatMessage({
            id: 'component.lockModal.heightAt',
          })}${lockHeight}${formatMessage({ id: 'component.lockModal.autoUnlock' })}`}
          actions={
            <Button type="primary" onClick={this.handleCancel}>
              {formatMessage({ id: 'component.lockModal.Igotit' })}
            </Button>
          }
          className={styles.formResult}
        />
      );
    }
    return (
      <div style={main}>
        <div>
          <span>{formatMessage({ id: 'component.lockModal.currentHeight' })}</span>
          <span style={{ marginLeft: '10px' }}>{height}</span>
        </div>
        <div style={{ margin: '20px 0' }}>
          <Input
            type="number"
            onChange={this.handleHeightChange}
            value={lockHeight}
            placeholder={formatMessage({ id: 'component.lockModal.placeholder' })}
          />
          {duration && (
            <span style={{ display: 'inline-block', marginTop: '10px' }}>
              {' '}
              {formatMessage({ id: 'component.lockModal.about' })} {Math.round(duration)}{' '}
              {formatMessage({ id: 'component.lockModal.days' })}
            </span>
          )}
        </div>
        {heightHelp && <Alert message={heightHelp} type="error" />}
        {lockResponse.error && <Alert message={lockResponse.error} type="error" />}
      </div>
    );
  };

  render() {
    const { open, lockResponse } = this.props;
    const modalFooter = lockResponse.success
      ? { footer: null, onCancel: this.handleCancel }
      : { onOk: this.handleOk, onCancel: this.handleCancel };
    return (
      <Modal
        title={
          lockResponse.success ? null : formatMessage({ id: 'component.lockModal.createlock' })
        }
        centered
        visible={open}
        bodyStyle={lockResponse.success ? { padding: '72px 0' } : { paddingTop: '28px' }}
        destroyOnClose
        {...modalFooter}
      >
        {this.getModalContent()}
      </Modal>
    );
  }
}

export default LockModal;
