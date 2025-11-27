import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Space, Tooltip, Spin, Result, Divider, Upload, Modal, Select, Row, Col } from 'antd';
import {
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  LinkOutlined,
  FileOutlined,
  InboxOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useIntl, history, useModel } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import DdnJS from '@ddn/js-sdk';
import { createEvidence } from '@/services/evidence';
import { getKeyStore } from '@/utils/authority';
import styles from './index.less';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 文件类型映射
const FILE_TYPE_MAP: Record<string, string> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'application/pdf': 'document',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'text/plain': 'text',
  'text/html': 'text',
  'text/css': 'text',
  'text/javascript': 'text',
  'application/json': 'text',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'video/mp4': 'video',
  'video/mpeg': 'video',
  'video/webm': 'video',
  'application/zip': 'archive',
  'application/x-rar-compressed': 'archive',
  'application/x-7z-compressed': 'archive',
};

// 获取文件大小的可读字符串
const getReadableFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// 生成文件哈希
const generateFileHash = (file: RcFile): Promise<{ hash: string, shortHash: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target || !e.target.result) {
          reject(new Error('Failed to read file'));
          return;
        }

        // 使用简单的方法生成哈希（在实际应用中应使用更安全的方法）
        const content = e.target.result;
        let hashStr = '';

        if (typeof content === 'string') {
          hashStr = btoa(content).replace(/=/g, '').substring(0, 64);
        } else {
          // 处理ArrayBuffer
          const array = new Uint8Array(content);
          let binary = '';
          for (let i = 0; i < array.length; i++) {
            binary += String.fromCharCode(array[i]);
          }
          hashStr = btoa(binary).replace(/=/g, '').substring(0, 64);
        }

        // 生成短哈希
        const shortHash = hashStr.substring(0, 32);

        resolve({ hash: hashStr, shortHash });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);

    // 读取文件内容
    reader.readAsArrayBuffer(file);
  });
};

const EvidenceCreate: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileHash, setFileHash] = useState<string>('');
  const [fileShortHash, setFileShortHash] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');
  const { initialState } = useModel('@@initialState');

  // 处理文件上传
  const handleFileUpload: UploadProps['onChange'] = async ({ file, fileList }) => {
    setFileList(fileList);

    if (file.status === 'done' || file.status === 'uploading') {
      const rawFile = file.originFileObj as RcFile;
      if (!rawFile) return;

      try {
        // 生成文件哈希
        const { hash, shortHash } = await generateFileHash(rawFile);
        setFileHash(hash);
        setFileShortHash(shortHash);

        // 设置文件类型
        const mimeType = rawFile.type || '';
        const type = FILE_TYPE_MAP[mimeType] || 'other';
        setFileType(type);
        form.setFieldsValue({ type });

        // 设置文件大小
        const size = getReadableFileSize(rawFile.size);
        setFileSize(size);
        form.setFieldsValue({ size });

        // 自动填充表单
        form.setFieldsValue({
          hash,
          shortHash,
          title: rawFile.name,
        });

        // 生成元数据
        const metadataObj = {
          fileName: rawFile.name,
          fileType: mimeType,
          fileSize: rawFile.size,
          uploadTime: new Date().toISOString(),
          hash,
          shortHash
        };
        setMetadata(JSON.stringify(metadataObj, null, 2));
        form.setFieldsValue({ metadata: JSON.stringify(metadataObj) });

      } catch (error) {
        console.error('Error processing file:', error);
        message.error(intl.formatMessage({ id: 'pages.evidence.file.process.error' }));
      }
    }
  };

  // 转换文件为Base64
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // 检查用户是否已登录
      if (!initialState?.currentUser) {
        message.error(intl.formatMessage({ id: 'pages.common.login-first' }));
        setLoading(false);
        return;
      }

      // 获取密钥
      const keyStore = getKeyStore();
      if (!keyStore || !keyStore.phaseKey) {
        message.error(intl.formatMessage({ id: 'pages.common.no-keystore' }));
        setLoading(false);
        return;
      }

      // 构造存证数据
      const evidenceData = {
        sourceAddress: values.sourceAddress,
        title: values.title,
        description: values.description,
        hash: values.hash,
        shortHash: values.shortHash,
        author: values.author,
        size: values.size,
        type: values.type,
        time: values.time || "",
        tags: values.tags,
        metadata: values.metadata || ""
      };

      // 创建存证交易
      // 注意: 如果DdnJS没有evidence方法，可以使用通用交易创建
      let transaction;
      try {
        if (DdnJS.evidence && typeof DdnJS.evidence.createEvidence === 'function') {
          transaction = await DdnJS.evidence.createEvidence(evidenceData, keyStore.phaseKey, null);
        } else {
          // 使用通用交易创建方法
          transaction = {
            type: 10, // 假设存证交易类型为10
            amount: 0,
            fee: 10000000, // 设置适当的费用
            args: JSON.stringify(evidenceData),
            timestamp: Date.now(),
            senderPublicKey: keyStore.publicKey,
          };

          // 签名交易
          if (typeof DdnJS.utils.signTransaction === 'function') {
            transaction = DdnJS.utils.signTransaction(transaction, keyStore.phaseKey);
          }
        }
      } catch (error) {
        console.error('Failed to create transaction:', error);
        throw error;
      }

      // 提交交易
      const response = await createEvidence({ transaction });

      if (response.success) {
        setSuccess(true);
        // 从响应中获取交易ID，或使用交易对象中的ID
        const txId = response.result?.transactionId || response.result?.transaction?.id || transaction.id || '';
        setTransactionId(txId);
        message.success(intl.formatMessage({ id: 'pages.evidence.success' }));
      } else {
        message.error(response.error || intl.formatMessage({ id: 'pages.evidence.failure' }));
      }
    } catch (error) {
      console.error('Failed to create evidence:', error);
      message.error(intl.formatMessage({ id: 'pages.evidence.failure' }));
    } finally {
      setLoading(false);
    }
  };

  // 返回列表页
  const handleBack = () => {
    history.push('/evidence/list');
  };

  // 查看存证详情
  const handleViewEvidence = () => {
    if (transactionId) {
      history.push(`/evidence/detail/${transactionId}`);
    }
  };

  // 重新创建
  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setFileHash('');
    setFileShortHash('');
    setFileType('');
    setFileSize('');
    setMetadata('');
    setSuccess(false);
    setTransactionId('');
  };

  // 复制哈希
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success(`${fieldName}已复制到剪贴板`);
      },
      (err) => {
        message.error(`复制失败: ${err}`);
      }
    );
  };

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
      }}
      className={styles.container}
    >
      <div className={styles.decorativeBg}>
        <div className={styles.decorativeContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{intl.formatMessage({ id: 'pages.evidence.create.title' })}</h1>
            <p className={styles.pageSubtitle}>{intl.formatMessage({ id: 'pages.evidence.create.subtitle' })}</p>
          </div>
        </div>
      </div>

      <Card className={styles.formCard}>
        <Spin spinning={loading}>
          {success ? (
            <Result
              status="success"
              title={intl.formatMessage({ id: 'pages.evidence.success' })}
              subTitle={
                <Space direction="vertical">
                  <Text>
                    {intl.formatMessage({ id: 'pages.evidence.transaction_id' })}:
                    <Text copyable={{ text: transactionId }} ellipsis style={{ maxWidth: 300 }}>
                      {transactionId}
                    </Text>
                  </Text>
                </Space>
              }
              extra={[
                <Button key="back" onClick={handleBack}>
                  {intl.formatMessage({ id: 'pages.evidence.back' })}
                </Button>,
                <Button key="view" type="primary" onClick={handleViewEvidence}>
                  {intl.formatMessage({ id: 'pages.evidence.view' })}
                </Button>,
                <Button key="again" onClick={handleReset}>
                  {intl.formatMessage({ id: 'pages.evidence.create' })}
                </Button>,
              ]}
            />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark="optional"
            >
              <Divider>{intl.formatMessage({ id: 'pages.evidence.basic.info' }) || '基本信息'}</Divider>

              {/* 基本信息区域 */}
              <Form.Item
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.evidence_title' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.evidence.title.tooltip' })}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="title"
                rules={[{ required: true, message: intl.formatMessage({ id: 'pages.evidence.title.required' }) }]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'pages.evidence.title.placeholder' })}
                  maxLength={128}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.description' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.evidence.description.tooltip' })}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="description"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'pages.evidence.description.required' })
                  }
                ]}
              >
                <TextArea
                  placeholder={intl.formatMessage({ id: 'pages.evidence.description.placeholder' })}
                  rows={4}
                  maxLength={512}
                  showCount
                />
              </Form.Item>

              {/* 文件属性信息 - 自动生成且只读 */}

              <div className={styles.formRow}>
                <Form.Item
                  label={
                    <Space>
                      {intl.formatMessage({ id: 'pages.evidence.author' })}
                      <Tooltip title={intl.formatMessage({ id: 'pages.evidence.author.tooltip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="author"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'pages.evidence.author.required' })
                    }
                  ]}
                  className={styles.formColumn}
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'pages.evidence.author.placeholder' })}
                    maxLength={20}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      {intl.formatMessage({ id: 'pages.evidence.type' })}
                      <Tooltip title={intl.formatMessage({ id: 'pages.evidence.type.tooltip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'pages.evidence.type.required' })
                    }
                  ]}
                  className={styles.formColumn}
                >
                  <Select
                    placeholder={intl.formatMessage({ id: 'pages.evidence.type.placeholder' })}
                    disabled={!!fileType}
                  >
                    <Option value="image">图片</Option>
                    <Option value="document">文档</Option>
                    <Option value="text">文本</Option>
                    <Option value="audio">音频</Option>
                    <Option value="video">视频</Option>
                    <Option value="archive">归档文件</Option>
                    <Option value="other">其他</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item
                  label={
                    <Space>
                      {intl.formatMessage({ id: 'pages.evidence.tags' })}
                      <Tooltip title={intl.formatMessage({ id: 'pages.evidence.tags.tooltip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="tags"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'pages.evidence.tags.required' })
                    }
                  ]}
                  className={styles.formColumn}
                  initialValue="evidence"
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'pages.evidence.tags.placeholder' })}
                    maxLength={128}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <Space>
                      {intl.formatMessage({ id: 'pages.evidence.time' })}
                      <Tooltip title={intl.formatMessage({ id: 'pages.evidence.time.tooltip' })}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="time"
                  className={styles.formColumn}
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'pages.evidence.time.placeholder' })}
                    maxLength={64}
                  />
                </Form.Item>
              </div>

              <Divider>{intl.formatMessage({ id: 'pages.evidence.file.info' }) || '文件信息'}</Divider>

              <div className={styles.fileInfoSection}>
              {/* 文件上传区域 */}
              <div className={styles.uploadSection}>
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={handleFileUpload}
                  beforeUpload={() => false} // 阻止自动上传
                  className={styles.uploader}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{intl.formatMessage({ id: 'pages.evidence.upload.text' }) || '点击或拖拽文件到此区域上传'}</p>
                  <p className="ant-upload-hint">{intl.formatMessage({ id: 'pages.evidence.upload.hint' }) || '支持单个文件上传，文件将用于生成存证哈希'}</p>
                </Upload.Dragger>
              </div>

              {/* 哈希信息区域 - 自动生成且只读 */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        {intl.formatMessage({ id: 'pages.evidence.hash' })}
                        <Tooltip title={intl.formatMessage({ id: 'pages.evidence.hash.tooltip' })}>
                          <QuestionCircleOutlined />
                        </Tooltip>
                        <Button
                          type="link"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(fileHash, intl.formatMessage({ id: 'pages.evidence.hash' }))}
                        />
                      </Space>
                    }
                    name="hash"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'pages.evidence.hash.required' }) }]}
                  >
                    <Input
                      placeholder={intl.formatMessage({ id: 'pages.evidence.hash.placeholder' })}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        {intl.formatMessage({ id: 'pages.evidence.shortHash' })}
                        <Tooltip title={intl.formatMessage({ id: 'pages.evidence.shortHash.tooltip' })}>
                          <QuestionCircleOutlined />
                        </Tooltip>
                        <Button
                          type="link"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(fileShortHash, intl.formatMessage({ id: 'pages.evidence.shortHash' }))}
                        />
                      </Space>
                    }
                    name="shortHash"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'pages.evidence.shortHash.required' }) }]}
                  >
                    <Input
                      placeholder={intl.formatMessage({ id: 'pages.evidence.shortHash.placeholder' })}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.size' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.evidence.size.tooltip' })}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="size"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'pages.evidence.size.required' })
                  }
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'pages.evidence.size.placeholder' })}
                  maxLength={64}
                  disabled={!!fileSize}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.sourceAddress' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.evidence.sourceAddress.tooltip' })}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                name="sourceAddress"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'pages.evidence.sourceAddress.required' })
                  }
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'pages.evidence.sourceAddress.placeholder' })}
                  prefix={<LinkOutlined />}
                />
              </Form.Item>

              </div>

              <Form.Item
                label={
                  <Space>
                    {intl.formatMessage({ id: 'pages.evidence.metadata' })}
                    <Tooltip title={intl.formatMessage({ id: 'pages.evidence.metadata.tooltip' })}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        Modal.info({
                          title: intl.formatMessage({ id: 'pages.evidence.metadata' }),
                          content: (
                            <div>
                              <p>{intl.formatMessage({ id: 'pages.evidence.metadata.tooltip' })}</p>
                              <TextArea
                                value={metadata}
                                onChange={(e) => setMetadata(e.target.value)}
                                rows={10}
                                style={{ marginTop: 16 }}
                              />
                            </div>
                          ),
                          width: 600,
                          okText: intl.formatMessage({ id: 'pages.common.save' }) || '保存',
                          onOk: () => {
                            try {
                              // 验证JSON格式
                              JSON.parse(metadata);
                              form.setFieldsValue({ metadata });
                            } catch (error) {
                              message.error(intl.formatMessage({ id: 'pages.evidence.metadata.invalid' }) || 'JSON格式无效');
                            }
                          },
                        });
                      }}
                    >
                      {intl.formatMessage({ id: 'pages.common.edit' }) || '编辑'}
                    </Button>
                  </Space>
                }
                name="metadata"
              >
                <TextArea
                  placeholder={intl.formatMessage({ id: 'pages.evidence.metadata.placeholder' })}
                  rows={3}
                  maxLength={1024}
                  disabled
                />
              </Form.Item>

              <Divider />

              <Form.Item className={styles.formActions}>
                <Space>
                  <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                    {intl.formatMessage({ id: 'pages.evidence.back' })}
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SafetyCertificateOutlined />} loading={loading}>
                    {intl.formatMessage({ id: 'pages.evidence.submit' })}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default EvidenceCreate;
