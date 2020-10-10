import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getKeyStore } from '@/utils/authority';
import { Button, Modal, Form, Input, Alert, message } from 'antd';
import { formatMessage } from 'umi/locale';
// // import DdnJS from '@/utils/ddn-js';

const FormItem = Form.Item;

class RegisteredOrg extends PureComponent {
  state = {
    visible: false,
    errorMessage: '',
  };

  componentDidMount() {
    // const { props } = this;
    // props.dispatch({
    //   type: 'assets/fetch',
    // });
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    // console.log('issuer', issuer);
    form.validateFields(async (err, data) => {
      if (err) {
        return;
      }
      const values = data;
      // console.log('values', values);
      // 获取到表单中的数据，并转化格式，发送请求
      // const strategy = values.strategy ? values.strategy : '';
      // const precision = Number(values.precision);
      // const name = `${issuer.name}.${values.name}`;
      // let multi = 1;
      // for (let i = 0; i < precision; i += 1) {
      //   multi *= 10;
      // }
      // const maximum = parseInt(values.maximum * multi, 10).toString();
      const keystore = getKeyStore();
      console.log(keystore);
      const { phaseKey } = keystore;
      values.secret = phaseKey;
      values.state = 0;
      console.log(values);
      // const transaction = await DdnJS.aob.createAsset(
      //   name,
      //   values.des,
      //   maximum,
      //   precision,
      //   strategy,
      //   0,
      //   0,
      //   0,
      //   phaseKey
      // );
      // console.log('transaction', transaction);

      dispatch({
        type: 'dao/putOrg',
        payload: {
          ...values,
        },
        callback: responese => {
          // console.log('responese', responese);
          if (responese.success) {
            form.resetFields();
            this.setState({ visible: false });
            message.success(`组织号 ${values.name} 注册成功`);
          } else {
            this.setState({ errorMessage: responese.error });
          }
        },
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;
    const { visible, errorMessage } = this.state;
    console.log('loading', loading);
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {formatMessage({ id: 'app.dao.register' })}
        </Button>
        <Modal
          visible={visible}
          title={formatMessage({ id: 'app.dao.register-dao' })}
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
        >
          <Form layout="vertical">
            <FormItem label={formatMessage({ id: 'app.dao.dao-id' })}>
              {getFieldDecorator('org_id', {
                rules: [{ required: true, message: 'Please input the dao name of collection!' }],
              })(<Input />)}
              <div>组织号id长度大于4小于20</div>
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.dao.dao-name' })}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the dao name of collection!' }],
              })(<Input />)}
              <div>组织号名称</div>
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.dao.dao-tags' })}>
              {getFieldDecorator('tags', {
                rules: [{ required: true, message: 'Please input the dao tags of collection!' }],
              })(<Input />)}
              <div>标签以,隔开</div>
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.dao.dao-url' })}>
              {getFieldDecorator('url', {
                rules: [{ required: true, message: 'Please input the dao url!' }],
              })(<Input />)}
            </FormItem>
            {errorMessage && <Alert type="error" message={errorMessage} />}
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedcertifiedOrgForm = Form.create()(RegisteredOrg);

export default connect(() => ({
  // submitting: loading.effects['assets/postTrans'],
  // issuer: dao.issuer,
}))(WrappedcertifiedOrgForm);
