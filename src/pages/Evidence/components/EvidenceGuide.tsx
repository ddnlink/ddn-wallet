import React from 'react';
import { Card, Typography, Steps, Button, Space, Alert } from 'antd';
import { 
  SafetyCertificateOutlined, 
  FileAddOutlined, 
  SearchOutlined, 
  CheckCircleOutlined, 
  CloseOutlined, 
  QuestionCircleOutlined 
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from './EvidenceGuide.less';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

interface EvidenceGuideProps {
  onClose?: () => void;
}

const EvidenceGuide: React.FC<EvidenceGuideProps> = ({ onClose }) => {
  const intl = useIntl();

  return (
    <Card className={styles.guideCard}>
      <div className={styles.guideHeader}>
        <div className={styles.guideTitle}>
          <QuestionCircleOutlined className={styles.guideIcon} />
          <span>{intl.formatMessage({ id: 'pages.evidence.guide' })}</span>
        </div>
        {onClose && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            size="small"
            title={intl.formatMessage({ id: 'pages.common.close' })}
          />
        )}
      </div>

      <Paragraph className={styles.guideDescription}>
        {intl.formatMessage({ id: 'pages.evidence.guide.description' })}
      </Paragraph>

      <Steps direction="horizontal" className={styles.guideSteps}>
        <Step
          title={intl.formatMessage({ id: 'pages.evidence.create' })}
          icon={<FileAddOutlined />}
          description={
            <div className={styles.stepDescription}>
              <Text>创建数字资产存证，将数据哈希上链</Text>
            </div>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'pages.evidence.list' })}
          icon={<SafetyCertificateOutlined />}
          description={
            <div className={styles.stepDescription}>
              <Text>查看已上链的存证记录</Text>
            </div>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'pages.evidence.detail' })}
          icon={<SearchOutlined />}
          description={
            <div className={styles.stepDescription}>
              <Text>查看存证详细信息</Text>
            </div>
          }
        />
        <Step
          title={intl.formatMessage({ id: 'pages.evidence.verify' })}
          icon={<CheckCircleOutlined />}
          description={
            <div className={styles.stepDescription}>
              <Text>验证存证的真实性和有效性</Text>
            </div>
          }
        />
      </Steps>

      <Alert
        message={intl.formatMessage({ id: 'pages.contract.guide.note' })}
        type="info"
        showIcon
        className={styles.guideAlert}
      />
    </Card>
  );
};

export default EvidenceGuide;
