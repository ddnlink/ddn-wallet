import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Button, Card, Input, Tooltip, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { PageContainer } from '@ant-design/pro-layout';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import DdnJS from '@ddn/js-sdk';
import nacl from 'tweetnacl';
import { getKeyStore } from '@/utils/authority';
import styles from './style.less';

const { TextArea } = Input;
interface SignatureProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

function createHash (data: string) {
  return Buffer.from(nacl.hash(Buffer.from(data)));
}

function bufToHex (data: any) {
  return Buffer.from(data).toString('hex')
}

class Signature extends Component<SignatureProps> {
  formRef = React.createRef();
  handleSubmit = (values: any) => {
    const keystore = getKeyStore();
    const { phaseKey, address } = keystore;
    // 验证地址合法性
    if (!DdnJS.crypto.isAddress(values.address, DdnJS.constants.tokenPrefix)) {
      message.error('您请求的地址不是合法地址.'); // D5G1e56SYkori7zAVun7ikHqEpVo9XMXiY
      return;
    }
    // 验证地址是用户钱包地址（不能签名钱包之外的地址）
    if (address !== values.address) {
      message.error('在您的钱包没有找到该地址.');
      return;
    }
    const keyPair = DdnJS.crypto.getKeys(phaseKey.trim());

    const hash = createHash(values.content);
    console.log('hash: ', hash);

    const signature = nacl.sign.detached(hash, Buffer.from(keyPair.privateKey, 'hex'));
    const sign = bufToHex(signature);
    console.log('sign: ', sign);
    this.formRef.current!.setFieldsValue({ sign });
  };

  render() {
    const { submitting } = this.props;
    // const {
    //   form: { getFieldDecorator, getFieldValue },
    // } = this.props;
    const FormItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    return (
    <PageContainer content={<FormattedMessage id="signature.basic.description" />}>
      <Card bordered={false}>
        <Form
          ref={this.formRef}
          name="signform"
          onFinish={this.handleSubmit}
          hideRequiredMark
          style={{
            marginTop: 8,
          }}
        >
          <Form.Item {...FormItemLayout}
            name='address'
            label={<FormattedMessage id="signature.address.label"/>}
            rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: 'signature.address.required',
                    }),
                  }
                ]}
            >
           <Input
                placeholder={formatMessage({
                  id: 'signature.address.placeholder',
                })}
              />
          </Form.Item>

          <Form.Item {...FormItemLayout}
          label={<FormattedMessage id="signature.content.label"/>}
          name='content'
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'signature.content.required',
              }),
            }
          ]}
         >
            <TextArea
                style={{
                  minHeight: 32,
                }}
                placeholder={formatMessage({
                  id: 'signature.content.placeholder',
                })}
                rows={4}
              />
          </Form.Item>

          <Form.Item
            {...FormItemLayout}
            label={
              <span>
                <FormattedMessage id="signature.sign.label" />
                <em className={styles.optional}>
                  <Tooltip title={<FormattedMessage id="signature.label.tooltip" />}>
                    <InfoCircleOutlined
                      style={{
                        marginRight: 4,
                      }}
                    />
                  </Tooltip>
                </em>
              </span>
            }
            name='sign'
          >
            <TextArea rows={2}/>
          </Form.Item>

          <Form.Item
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="signature.form.signature" />
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              <FormattedMessage id="signature.form.verify" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
      </PageContainer>
    );
  }
}

connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['signature/submitRegularForm'],
}))(Signature)

export default Signature;
