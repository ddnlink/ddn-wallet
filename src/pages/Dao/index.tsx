import React, { useState } from 'react';
import { Tabs, Modal, message } from 'antd';
import { useIntl } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { ClusterOutlined, SwapOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DaoGuide from './components/DaoGuide';
import OrgList from './components/OrgList';
import OrgForm from './components/OrgForm';
import OrgDetail from './components/OrgDetail';
import ExchangeList from './components/ExchangeList';
import ExchangeForm from './components/ExchangeForm';
import ExchangeDetail from './components/ExchangeDetail';
import ContributionList from './components/ContributionList';
import ContributionForm from './components/ContributionForm';
import ContributionDetail from './components/ContributionDetail';
import ConfirmationList from './components/ConfirmationList';
import ConfirmationForm from './components/ConfirmationForm';
import ConfirmationDetail from './components/ConfirmationDetail';
import styles from './index.less';

const { TabPane } = Tabs;

const DaoPage: React.FC = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('org');

  // 组织相关状态
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>();
  const [showOrgDetail, setShowOrgDetail] = useState(false);
  const [orgListRefreshKey, setOrgListRefreshKey] = useState(0); // 用于刷新组织列表

  // 交易相关状态
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | undefined>();
  const [showExchangeDetail, setShowExchangeDetail] = useState(false);

  // 贡献相关状态
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [selectedContributionId, setSelectedContributionId] = useState<string | undefined>();
  const [showContributionDetail, setShowContributionDetail] = useState(false);

  // 确认相关状态
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [selectedConfirmationId, setSelectedConfirmationId] = useState<string | undefined>();
  const [showConfirmationDetail, setShowConfirmationDetail] = useState(false);

  // 组织处理函数
  const handleCreateOrg = () => {
    setShowOrgForm(true);
  };

  const handleOrgFormSuccess = () => {
    setShowOrgForm(false);
    message.success(intl.formatMessage({ id: 'pages.dao.org.create.success' }));
    // 刷新组织列表
    setOrgListRefreshKey((prevKey) => prevKey + 1);
  };

  const handleOrgFormCancel = () => {
    setShowOrgForm(false);
  };

  const handleViewOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
    setShowOrgDetail(true);
  };

  const handleBackFromOrgDetail = () => {
    setShowOrgDetail(false);
  };

  const handleExchangeOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
    setShowExchangeForm(true);
  };

  const handleContributeOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
    setShowContributionForm(true);
  };

  // 交易处理函数
  const handleCreateExchange = () => {
    setShowExchangeForm(true);
  };

  const handleExchangeFormSuccess = () => {
    setShowExchangeForm(false);
    message.success(intl.formatMessage({ id: 'pages.dao.exchange.create.success' }));
  };

  const handleExchangeFormCancel = () => {
    setShowExchangeForm(false);
  };

  const handleViewExchange = (exchangeId: string) => {
    setSelectedExchangeId(exchangeId);
    setShowExchangeDetail(true);
  };

  const handleBackFromExchangeDetail = () => {
    setShowExchangeDetail(false);
  };

  const handleConfirmExchange = (exchangeId: string) => {
    setSelectedExchangeId(exchangeId);
    message.success(intl.formatMessage({ id: 'pages.dao.exchange.confirm.success' }));
  };

  // 贡献处理函数
  const handleCreateContribution = () => {
    setShowContributionForm(true);
  };

  const handleContributionFormSuccess = () => {
    setShowContributionForm(false);
    message.success(intl.formatMessage({ id: 'pages.dao.contribution.create.success' }));
  };

  const handleContributionFormCancel = () => {
    setShowContributionForm(false);
  };

  const handleViewContribution = (contributionId: string) => {
    setSelectedContributionId(contributionId);
    setShowContributionDetail(true);
  };

  const handleBackFromContributionDetail = () => {
    setShowContributionDetail(false);
  };

  const handleConfirmContribution = (contributionId: string) => {
    setSelectedContributionId(contributionId);
    setShowConfirmationForm(true);
  };

  // 确认处理函数
  const handleConfirmationFormSuccess = () => {
    setShowConfirmationForm(false);
    message.success(intl.formatMessage({ id: 'pages.dao.confirmation.create.success' }));
  };

  const handleConfirmationFormCancel = () => {
    setShowConfirmationForm(false);
  };

  const handleViewConfirmation = (confirmationId: string) => {
    setSelectedConfirmationId(confirmationId);
    setShowConfirmationDetail(true);
  };

  const handleBackFromConfirmationDetail = () => {
    setShowConfirmationDetail(false);
  };

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
      }}
      className={styles.daoPage}
    >
      <div className={styles.decorativeBg}>
        <div className={styles.decorativeContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{intl.formatMessage({ id: 'pages.dao.title' })}</h1>
            <p className={styles.pageSubtitle}>{intl.formatMessage({ id: 'pages.dao.subtitle' })}</p>
          </div>
        </div>
      </div>

      <DaoGuide />

      {/* 组织详情视图 */}
      {showOrgDetail && selectedOrgId ? (
        <OrgDetail
          orgId={selectedOrgId}
          onBack={handleBackFromOrgDetail}
          onExchange={handleExchangeOrg}
          onContribute={handleContributeOrg}
        />
      ) : showExchangeDetail && selectedExchangeId ? (
        <ExchangeDetail
          exchangeId={selectedExchangeId}
          onBack={handleBackFromExchangeDetail}
          onConfirm={handleConfirmExchange}
        />
      ) : showContributionDetail && selectedContributionId ? (
        <ContributionDetail
          contributionId={selectedContributionId}
          onBack={handleBackFromContributionDetail}
          onConfirm={handleConfirmContribution}
        />
      ) : showConfirmationDetail && selectedConfirmationId ? (
        <ConfirmationDetail
          confirmationId={selectedConfirmationId}
          onBack={handleBackFromConfirmationDetail}
        />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.tabContent}
          tabPosition="top"
          size="large"
        >
          <TabPane
            tab={
              <span>
                <ClusterOutlined />
                {intl.formatMessage({ id: 'pages.dao.org.title' })}
              </span>
            }
            key="org"
          >
            <OrgList
              onCreateOrg={handleCreateOrg}
              onViewOrg={handleViewOrg}
              onExchangeOrg={handleExchangeOrg}
              onContributeOrg={handleContributeOrg}
              refreshKey={orgListRefreshKey}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SwapOutlined />
                {intl.formatMessage({ id: 'pages.dao.exchange.title' })}
              </span>
            }
            key="exchange"
          >
            <ExchangeList
              onCreateExchange={handleCreateExchange}
              onViewExchange={handleViewExchange}
              onConfirmExchange={handleConfirmExchange}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                {intl.formatMessage({ id: 'pages.dao.contribution.title' })}
              </span>
            }
            key="contribution"
          >
            <ContributionList
              onCreateContribution={handleCreateContribution}
              onViewContribution={handleViewContribution}
              onConfirmContribution={handleConfirmContribution}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <CheckCircleOutlined />
                {intl.formatMessage({ id: 'pages.dao.confirmation.title' })}
              </span>
            }
            key="confirmation"
          >
            <ConfirmationList
              orgId={selectedOrgId}
              onViewConfirmation={handleViewConfirmation}
            />
          </TabPane>
        </Tabs>
      )}

      {/* 组织表单模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.dao.org.create.title' })}
        open={showOrgForm}
        onCancel={handleOrgFormCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <OrgForm
          onSuccess={handleOrgFormSuccess}
          onCancel={handleOrgFormCancel}
        />
      </Modal>

      {/* 交易表单模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.dao.exchange.create.title' })}
        open={showExchangeForm}
        onCancel={handleExchangeFormCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <ExchangeForm
          orgId={selectedOrgId}
          onSuccess={handleExchangeFormSuccess}
          onCancel={handleExchangeFormCancel}
        />
      </Modal>

      {/* 贡献表单模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.dao.contribution.create.title' })}
        open={showContributionForm}
        onCancel={handleContributionFormCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <ContributionForm
          orgId={selectedOrgId}
          onSuccess={handleContributionFormSuccess}
          onCancel={handleContributionFormCancel}
        />
      </Modal>

      {/* 确认表单模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'pages.dao.confirmation.create.title' })}
        open={showConfirmationForm}
        onCancel={handleConfirmationFormCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <ConfirmationForm
          contributionId={selectedContributionId}
          onSuccess={handleConfirmationFormSuccess}
          onCancel={handleConfirmationFormCancel}
        />
      </Modal>
    </PageContainer>
  );
};

export default DaoPage;
