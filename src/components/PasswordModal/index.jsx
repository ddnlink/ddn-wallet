import React from 'react';
import { Modal, Input } from 'antd';
// import moment from 'moment';
// import { formatMessage } from 'umi/locale';
// import Result from '@/components/Result';
// import styles from './index.less';

const main = {
  width: '450px',
};

class PasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  handleCancel = () => {
    const { close } = this.props;
    this.setState({
      password: '',
    });
    close();
  };

  handlePasswordChange = e => {
    const value = parseInt(e.target.value, 10);
    this.setState({
      password: value,
    });
  };

  handleOk = async () => {
    const { password } = this.state;
    const { handlePassword } = this.props;
    handlePassword(password);
  };

  getModalContent = () => {
    const { password } = this.state;
    // const { height, lockResponse } = this.props;
    // let duration;
    // if (lockHeight && lockHeight > height) {
    //   duration = moment.duration((lockHeight - height) * 10 * 1000).asDays();
    // }
    // if (lockResponse.success) {
    //   return (
    //     <Result
    //       type="success"
    //       title={formatMessage({ id: 'component.lockModal.lockSuccess' })}
    //       description={`${formatMessage({
    //         id: 'component.lockModal.heightAt',
    //       })}${lockHeight}${formatMessage({ id: 'component.lockModal.autoUnlock' })}`}
    //       actions={
    //         <Button type="primary" onClick={this.handleCancel}>
    //           {formatMessage({ id: 'component.lockModal.Igotit' })}
    //         </Button>
    //       }
    //       className={styles.formResult}
    //     />
    //   );
    // }
    return (
      <div style={main}>
        <div style={{ margin: '20px 0' }}>
          <Input
            type="number"
            onChange={this.handlePasswordChange}
            value={password}
            placeholder="请输入密码"
          />
          {/* {duration && (
            <span style={{ display: 'inline-block', marginTop: '10px' }}>
              {' '}
              {formatMessage({ id: 'component.lockModal.about' })} {Math.round(duration)}{' '}
              {formatMessage({ id: 'component.lockModal.days' })}
            </span>
          )} */}
        </div>
        {/* {heightHelp && <Alert message={heightHelp} type="error" />} */}
        {/* {lockResponse.error && <Alert message={lockResponse.error} type="error" />} */}
      </div>
    );
  };

  render() {
    const { open } = this.props;
    const modalFooter = { onOk: this.handleOk, onCancel: this.handleCancel };
    return (
      <Modal
        title="二级密码"
        centered
        visible={open}
        bodyStyle={{ paddingTop: '28px' }}
        destroyOnClose
        {...modalFooter}
      >
        {this.getModalContent()}
      </Modal>
    );
  }
}

export default PasswordModal;
