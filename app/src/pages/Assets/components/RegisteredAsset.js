import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getKeyStore } from '@/utils/authority';
import { Button, Modal, Form, Input, Alert, message } from 'antd';
import { formatMessage } from 'umi/locale';
// // import DdnJS from '@/utils/ddn-js';

const FormItem = Form.Item;

class RegisteredAsset extends PureComponent {
  state = {
    visible: false,
    errorMessage: '',
  };

  componentDidMount() {
    const { props } = this;
    props.dispatch({
      type: 'assets/fetch',
    });
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = e => {
    e.preventDefault();
    const { issuer, dispatch, form } = this.props;
    // console.log('issuer', issuer);
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      // console.log('values', values);
      // 获取到表单中的数据，并转化格式，发送请求
      const strategy = values.strategy ? values.strategy : '';
      const precision = Number(values.precision);
      const name = `${issuer.name}.${values.name}`;
      let multi = 1;
      for (let i = 0; i < precision; i += 1) {
        multi *= 10;
      }
      const maximum = parseInt(values.maximum * multi, 10).toString();
      const keystore = getKeyStore();
      const { phaseKey } = keystore;
      const transaction = await DdnJS.aob.createAsset(
        name,
        values.des,
        maximum,
        precision,
        strategy,
        0,
        0,
        0,
        phaseKey
      );
      // console.log('transaction', transaction);

      dispatch({
        type: 'assets/postTrans',
        payload: {
          transaction,
        },
        callback: responese => {
          // console.log('responese', responese);
          if (responese.success) {
            form.resetFields();
            this.setState({ visible: false });
            message.success(`资产 ${values.name} 注册成功`);
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
          {formatMessage({ id: 'app.asset.asset-registration' })}
        </Button>
        <Modal
          visible={visible}
          title={formatMessage({ id: 'app.asset.asset-registration' })}
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
        >
          <Form layout="vertical">
            <FormItem label={formatMessage({ id: 'app.asset.asset-name' })}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input the assets name of collection!' }],
              })(<Input />)}
              <div>资产名称必须为3~6个大写字母</div>
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.asset-description' })}>
              {getFieldDecorator('des', {
                rules: [{ required: true, message: 'Please input the assets des of collection!' }],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.asset-limit' })}>
              {getFieldDecorator('maximum', {
                rules: [{ required: true, message: 'Please input the assets maximum of maximum!' }],
              })(<Input type="number" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.asset-precision' })}>
              {getFieldDecorator('precision', {
                rules: [
                  { required: true, message: 'Please input the assets precision of precision!' },
                ],
              })(<Input type="number" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.asset-strategy' })}>
              {getFieldDecorator('strategy')(<Input />)}
            </FormItem>
            {errorMessage && <Alert type="error" message={errorMessage} />}
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedcertifiedAssetForm = Form.create()(RegisteredAsset);

export default connect(({ assets, loading }) => ({
  submitting: loading.effects['assets/postTrans'],
  issuer: assets.issuer,
}))(WrappedcertifiedAssetForm);
