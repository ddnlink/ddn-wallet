import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Alert, Statistic, Row, Col, Card, Tooltip } from 'antd';
import { InfoCircleOutlined, LockOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import moment from 'moment';
import styles from './LockForm.less';

interface LockFormProps {
  currentHeight: number;
  onSubmit: (height: number) => void;
  loading: boolean;
}

const LockForm: React.FC<LockFormProps> = ({ currentHeight, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [lockHeight, setLockHeight] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const intl = useIntl();

  // 计算锁定天数
  useEffect(() => {
    if (lockHeight && lockHeight > currentHeight) {
      // 假设每个区块生成时间为10秒
      const durationDays = moment.duration((lockHeight - currentHeight) * 10 * 1000).asDays();
      setDuration(Math.round(durationDays));
    } else {
      setDuration(null);
    }
  }, [lockHeight, currentHeight]);

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setLockHeight(value);
    } else {
      setLockHeight(null);
    }
  };

  const handleSubmit = (values: { lockHeight: number }) => {
    onSubmit(values.lockHeight);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.statsContainer}>
        <Card className={styles.statsCard}>
          <Statistic
            title={intl.formatMessage({ id: 'pages.lock.current-height' })}
            value={currentHeight}
            prefix={<LockOutlined />}
            valueStyle={{ color: '#4865FE' }}
          />
        </Card>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.form}
      >
        <Form.Item
          name="lockHeight"
          label={intl.formatMessage({ id: 'pages.lock.lock-height' })}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'pages.lock.height-required' }) },
            {
              validator: (_, value) => {
                if (value && parseInt(value, 10) <= currentHeight) {
                  return Promise.reject(intl.formatMessage({ id: 'pages.lock.height-too-low' }));
                }
                return Promise.resolve();
              },
            },
          ]}
          tooltip={{
            title: intl.formatMessage({ id: 'pages.lock.height-tooltip' }),
            icon: <InfoCircleOutlined />,
          }}
        >
          <Input
            type="number"
            placeholder={intl.formatMessage({ id: 'pages.lock.height-placeholder' })}
            onChange={handleHeightChange}
            min={currentHeight + 1}
            className={styles.input}
          />
        </Form.Item>

        {duration !== null && (
          <Alert
            message={intl.formatMessage(
              { id: 'pages.lock.duration-info' },
              { days: duration }
            )}
            type="info"
            showIcon
            className={styles.durationAlert}
          />
        )}

        <Form.Item className={styles.submitItem}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
            size="large"
          >
            {intl.formatMessage({ id: 'pages.lock.submit' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LockForm;
