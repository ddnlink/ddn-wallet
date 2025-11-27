import React, { useState } from 'react';
import { Card, Typography, Steps, Button, Space, Alert, Divider } from 'antd';
import { CodeOutlined, RocketOutlined, ApiOutlined, FileSearchOutlined, CloseOutlined, QuestionCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useIntl, history } from '@umijs/max';
import ContractSpecDrawer from './ContractSpecDrawer';
import styles from './ContractGuide.less';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

interface ContractGuideProps {
  onClose: () => void;
}

const ContractGuide: React.FC<ContractGuideProps> = ({ onClose }) => {
  const intl = useIntl();
  const [specDrawerVisible, setSpecDrawerVisible] = useState<boolean>(false);

  return (
    <>
      <Card className={styles.guideCard}>
        <div className={styles.guideHeader}>
          <div className={styles.guideTitle}>
            <QuestionCircleOutlined className={styles.guideIcon} />
            <span>{intl.formatMessage({ id: 'pages.contract.guide.title' })}</span>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            size="small"
            title={intl.formatMessage({ id: 'pages.common.close' })}
          />
        </div>

        <Paragraph className={styles.guideDescription}>
          {intl.formatMessage({ id: 'pages.contract.guide.description' })}
        </Paragraph>

        <Steps direction="horizontal" className={styles.guideSteps}>
          <Step
            title={intl.formatMessage({ id: 'pages.contract.guide.step1' })}
            icon={<CodeOutlined />}
            description={
              <div className={styles.stepDescription}>
                <Text>编写符合DDN智能合约规范的代码</Text>
              </div>
            }
          />
          <Step
            title={intl.formatMessage({ id: 'pages.contract.guide.step2' })}
            icon={<RocketOutlined />}
            description={
              <div className={styles.stepDescription}>
                <Text>将合约部署到DDN区块链上</Text>
              </div>
            }
          />
          <Step
            title={intl.formatMessage({ id: 'pages.contract.guide.step3' })}
            icon={<ApiOutlined />}
            description={
              <div className={styles.stepDescription}>
                <Text>调用合约中的方法执行业务逻辑</Text>
              </div>
            }
          />
          <Step
            title={intl.formatMessage({ id: 'pages.contract.guide.step4' })}
            icon={<FileSearchOutlined />}
            description={
              <div className={styles.stepDescription}>
                <Text>查看合约执行结果和事件日志</Text>
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

        <Divider className={styles.guideDivider}>
          <BookOutlined /> 开发资源
        </Divider>

        <div className={styles.resourceLinks}>
          <Button
            type="link"
            onClick={() => setSpecDrawerVisible(true)}
            icon={<BookOutlined />}
          >
            DDN智能合约规范文档
          </Button>
          <Button
            type="link"
            onClick={() => history.push('/contract/deploy')}
            icon={<RocketOutlined />}
          >
            部署新合约
          </Button>
        </div>
      </Card>

      {/* 智能合约规范文档抽屉 */}
      <ContractSpecDrawer
        visible={specDrawerVisible}
        onClose={() => setSpecDrawerVisible(false)}
      />
    </>
  );
};

export default ContractGuide;
