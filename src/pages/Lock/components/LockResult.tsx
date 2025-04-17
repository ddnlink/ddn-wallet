import React from 'react';
import { Result, Button, Typography, Row, Col, Statistic, Card } from 'antd';
import { CheckCircleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import moment from 'moment';
import styles from './LockResult.less';

const { Paragraph, Text } = Typography;

interface LockResultProps {
  height: number;
  currentHeight: number;
  onReset: () => void;
}

const LockResult: React.FC<LockResultProps> = ({ height, currentHeight, onReset }) => {
  const intl = useIntl();
  const durationDays = Math.round(moment.duration((height - currentHeight) * 10 * 1000).asDays());

  return (
    <div className={styles.resultContainer}>
      <Result
        status="success"
        icon={<CheckCircleOutlined className={styles.successIcon} />}
        title={intl.formatMessage({ id: 'pages.lock.success-title' })}
        subTitle={intl.formatMessage({ id: 'pages.lock.success-subtitle' })}
        className={styles.result}
      />

      <div className={styles.statsContainer}>
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Card className={styles.statsCard}>
              <Statistic
                title={intl.formatMessage({ id: 'pages.lock.current-height' })}
                value={currentHeight}
                prefix={<UnlockOutlined />}
                valueStyle={{ color: '#4865FE' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className={styles.statsCard}>
              <Statistic
                title={intl.formatMessage({ id: 'pages.lock.target-height' })}
                value={height}
                prefix={<LockOutlined />}
                valueStyle={{ color: '#4865FE' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className={styles.infoContainer}>
        <Paragraph className={styles.infoParagraph}>
          {intl.formatMessage(
            { id: 'pages.lock.unlock-info' },
            { height, days: durationDays }
          )}
        </Paragraph>
        
        <div className={styles.noteBox}>
          <Text type="secondary">
            {intl.formatMessage({ id: 'pages.lock.note' })}
          </Text>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="primary" onClick={onReset} size="large" className={styles.button}>
          {intl.formatMessage({ id: 'pages.lock.back' })}
        </Button>
      </div>
    </div>
  );
};

export default LockResult;
