import React, { PureComponent } from 'react';
import { Modal, List } from 'antd';
import { formatMessage } from 'umi/locale';


class MultiMember extends PureComponent {

  handleCancel = () => {
    const { closeMember } = this.props;
    closeMember();
  };

  render() {
    const { show, multiAccounts } = this.props;
    return (
      <Modal
        title={formatMessage({ id: 'app.multi.member' })}
        centered
        visible={show}
        width="800px"
        bodyStyle={{ padding: '30px 50px' }}
        destroyOnClose
        footer={null}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <List
          bordered
          dataSource={multiAccounts}
          renderItem={item => (<List.Item>{item}</List.Item>)}
        />
      </Modal>
    );
  }
}

export default MultiMember;
