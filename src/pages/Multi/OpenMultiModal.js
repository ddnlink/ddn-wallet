import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import CreateMultiAccount from './CreateMultiAccount';

class OpenMultiModal extends PureComponent {
  handleCancel = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { open } = this.props;
    return (
      <Modal
        title={formatMessage({ id: 'component.multi.createMultiAccount' })}
        centered
        visible={open}
        width="800px"
        bodyStyle={{ padding: '30px 50px' }}
        destroyOnClose
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <CreateMultiAccount cancel={this.handleCancel} />
      </Modal>
    );
  }
}

export default OpenMultiModal;
