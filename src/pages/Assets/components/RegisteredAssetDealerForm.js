import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getKeyStore, getUser } from '@/utils/authority';
import { Button, Modal, Form, Input, Alert, message } from 'antd';
import { formatMessage } from 'umi/locale';
import PasswordModal from '@/components/PasswordModal';

const FormItem = Form.Item;

class registeredAssetDealerForm extends PureComponent {
  state = {
    visible: false,
    reponseError: '',
    open: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = e => {
    e.preventDefault();
    this.submit();
    // const { props } = this;
    // props.form.validateFields(async (err, values) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //   }
    //   // 获取到表单中的数据，并转化格式，发送请求
    //   const { dispatch } = this.props;
    //   const keystore = getKeyStore();
    //   const { phaseKey } = keystore;
    //   const transaction = await DdnJS.aob.createIssuer(values.name, values.des, phaseKey);
    //   console.log('trs', transaction);

    //   dispatch({
    //     type: 'assets/postTrans',
    //     payload: {
    //       transaction,
    //     },
    //     callback: response => {
    //       console.log('response', response);
    //       if (response.success) {
    //         message.success('注册成功');
    //         this.setState({ visible: false });
    //       } else {
    //         this.setState({ reponseError: response.error });
    //       }
    //     },
    //   });
    //   props.form.resetFields();
    // });
  };

  handlePassword = async password => {
    await this.submit(password);
    this.setState({
      open: false,
    });
  };

  submit = async (password = null) => {
    const { props } = this;
    props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      // 获取到表单中的数据，并转化格式，发送请求
      const { dispatch } = this.props;
      const keystore = getKeyStore();
      const { phaseKey } = keystore;
      const transaction = await DdnJS.aob.createIssuer(values.name, values.des, phaseKey, password);
      console.log('trs', transaction);

      dispatch({
        type: 'assets/postTrans',
        payload: {
          transaction,
        },
        callback: response => {
          console.log('response', response);
          if (response.success) {
            message.success('注册成功');
            this.setState({ visible: false });
          } else {
            this.setState({ reponseError: response.error });
          }
        },
      });
      props.form.resetFields();
    });
  };

  open = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { loading, form } = this.props;
    const { visible, reponseError, open } = this.state;
    const { getFieldDecorator } = form;
    console.log('loading', loading);
    const { haveSecondSign } = getUser();
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {formatMessage({ id: 'app.asset.issuer-registration' })}
        </Button>
        <Modal
          title={formatMessage({ id: 'app.asset.issuer-registration' })}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onOk={haveSecondSign ? this.open : this.handleCreate}
        >
          <Form layout="vertical">
            <FormItem label={formatMessage({ id: 'app.asset.issuer-name' })}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the assets name of collection!' }],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.issuer-description' })}>
              {getFieldDecorator('des')(<Input type="textarea" />)}
            </FormItem>
          </Form>
          {reponseError && <Alert type="error" message={reponseError} />}
        </Modal>
        <PasswordModal open={open} handlePassword={this.handlePassword} />
      </div>
    );
  }
}

const WrappedRegisteredAssetDealerForm = Form.create()(registeredAssetDealerForm);

export default connect(({ assets, loading }) => ({
  submitting: loading.effects['assets/postTrans'],
  assets,
}))(WrappedRegisteredAssetDealerForm);
