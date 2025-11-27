import React from 'react';
import { Typography, Button } from 'antd';
import { ClusterOutlined, SwapOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from '../index.less';

const { Title, Paragraph, Text } = Typography;

const DaoGuide: React.FC = () => {
  const intl = useIntl();

  return (
    <div className={styles.guideContainer}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitle}>
          <ClusterOutlined className={styles.guideIcon} />
          <span>{intl.formatMessage({ id: 'pages.dao.guide' })}</span>
        </div>
      </div>
      <div className={styles.guideContent}>
        <Paragraph>
          {intl.formatMessage({ id: 'pages.dao.guide.description' })}
        </Paragraph>

        <div className={styles.guideSteps}>
          <div className={styles.guideStep}>
            <div className={styles.guideStepIcon}>
              <ClusterOutlined />
            </div>
            <div className={styles.guideStepTitle}>
              {intl.formatMessage({ id: 'pages.dao.org.title' })}
            </div>
            <div className={styles.guideStepDesc}>
              {intl.formatMessage({ id: 'pages.dao.org.create.subtitle' })}
            </div>
          </div>

          <div className={styles.guideStep}>
            <div className={styles.guideStepIcon}>
              <SwapOutlined />
            </div>
            <div className={styles.guideStepTitle}>
              {intl.formatMessage({ id: 'pages.dao.exchange.title' })}
            </div>
            <div className={styles.guideStepDesc}>
              {intl.formatMessage({ id: 'pages.dao.exchange.create.subtitle' })}
            </div>
          </div>

          <div className={styles.guideStep}>
            <div className={styles.guideStepIcon}>
              <FileTextOutlined />
            </div>
            <div className={styles.guideStepTitle}>
              {intl.formatMessage({ id: 'pages.dao.contribution.title' })}
            </div>
            <div className={styles.guideStepDesc}>
              {intl.formatMessage({ id: 'pages.dao.contribution.create.subtitle' })}
            </div>
          </div>

          <div className={styles.guideStep}>
            <div className={styles.guideStepIcon}>
              <CheckCircleOutlined />
            </div>
            <div className={styles.guideStepTitle}>
              {intl.formatMessage({ id: 'pages.dao.confirmation.title' })}
            </div>
            <div className={styles.guideStepDesc}>
              {intl.formatMessage({ id: 'pages.dao.confirmation.create.subtitle' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaoGuide;
