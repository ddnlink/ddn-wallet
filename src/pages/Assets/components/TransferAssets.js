import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getKeyStore } from '@/utils/authority';
import { Button, Modal, Form, Input, message, Alert } from 'antd';
import { formatMessage } from 'umi';
import DdnJS from '@ddn/js-sdk';

const FormItem = Form.Item;

class transferAssetForm extends PureComponent {
  state = {
    visible: false,
    errorMessage: '',
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = e => {
    e.preventDefault();
    const { form, dispatch, asset } = this.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const remark = values.message ? values.message : '';
      const content = values.content ? values.content : '';
      // 获取到表单中的数据，并转化格式，发送请求
      const keystore = getKeyStore();
      const { phaseKey } = keystore;
      const { amount } = values;
      let pureAmount = amount;
      for (let i = 0; i < asset.precision; i += 1) {
        pureAmount *= 10;
      }
      // console.log('asset.currency', asset.currency);
      const transaction = await DdnJS.aob.createTransfer(
        asset.currency,
        pureAmount,
        values.recipientId,
        remark,
        content,
        phaseKey,
        null
      );
      // console.log('transaction', transaction);
      dispatch({
        type: 'assets/postTrans',
        payload: {
          transaction,
        },
        callback: response => {
          if (response.success) {
            form.resetFields();
            this.setState({ visible: false });
            message.success('转账成功');
          } else {
            this.setState({ errorMessage: response.error });
          }
        },
      });
    });
  };

  render() {
    const { form, asset } = this.props;
    const { visible, errorMessage } = this.state;
    const { getFieldDecorator } = form;
    // console.log('asset', asset);
    return (
      <div>
        <Button size="large" style={{ width: '120px' }} onClick={this.showModal}>
          {formatMessage({ id: 'app.asset.transfer' })}
        </Button>
        <Modal
          title={formatMessage({ id: 'app.asset.transfer' })}
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
        >
          <Form layout="vertical">
            <FormItem label={formatMessage({ id: 'app.asset.asset-name' })}>
              {asset.currency}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.transfer-amount' })}>
              {getFieldDecorator('amount', {
                rules: [
                  { required: true, message: 'Please input the assets amount of collection!' },
                ],
              })(<Input type="number" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.receipt-address' })}>
              {getFieldDecorator('recipientId', {
                rules: [
                  { required: true, message: 'Please input the assets recipientId of collection!' },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.message' })}>
              {getFieldDecorator('message')(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.asset.content' })}>
              {getFieldDecorator('content')(<Input />)}
            </FormItem>
            {errorMessage && <Alert type="error" message={errorMessage} />}
          </Form>
        </Modal>
      </div>
    );
  }
}

const TransferAssets = Form.create()(transferAssetForm);

export default connect(({ assets, loading }) => ({
  submitting: loading.effects['assets/postTrans'],
  assets,
}))(TransferAssets);
