import { InfoCircleOutlined } from '@ant-design/icons';
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Form, Button, Card, DatePicker, Input, Select, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { PageContainer } from '@ant-design/pro-layout';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import { connect } from 'dva';
import styles from './style.less';

const { TextArea } = Input;
interface SignatureProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class Signature extends Component<SignatureProps> {
  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'signature/submitRegularForm',
          payload: values,
        });
      }
    });
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
          onSubmit={this.handleSubmit}
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
            <Input />
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
