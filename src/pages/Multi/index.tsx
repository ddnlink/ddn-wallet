import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, message, Tabs, Tag, Space, Tooltip, Alert, Badge, Progress, Descriptions, Spin, Result } from 'antd';
import { PlusOutlined, MinusOutlined, QuestionCircleOutlined, KeyOutlined, ClockCircleOutlined, CheckCircleOutlined, ReloadOutlined, ExclamationCircleOutlined, InfoCircleOutlined, UserOutlined, TeamOutlined, WarningOutlined, LockOutlined } from '@ant-design/icons';
import { useIntl, useRequest, useModel } from '@umijs/max';
import { queryMultiSignatureAccounts, createMultiSignatureAccount, signTransaction, queryPendingMultiSignatures, querySignedTransactions, checkMultiSignatureEligibility, getSignatureProgress } from '@/services/api';
import PublicKeyModal from '@/components/PublicKeyModal';
import { getKeyStore } from '@/utils/authority';
import styles from './index.less';

// 多重签名账户类型定义
interface MultiSignatureDetails {
  min: number;
  lifetime: number;
  keysgroup: string[];
}

interface EligibilityResult {
  success: boolean;
  eligible: boolean;
  reason?: string;
  details?: {
    currentMultisignature?: MultiSignatureDetails;
    currentMultisig?: MultiSignatureDetails;
    pendingTransactions?: any[];
  };
}

const { TabPane } = Tabs;

const MultiPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [keysgroup, setKeysgroup] = useState<string[]>([]);
  const [keyInput, setKeyInput] = useState('');
  const [publicKeyModalVisible, setPublicKeyModalVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [lastCreatedTxId, setLastCreatedTxId] = useState<string>('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [accountMultiSigStatus, setAccountMultiSigStatus] = useState<{
    isMultiSig: boolean;
    details?: {
      min?: number;
      lifetime?: number;
      keysgroup?: string[];
    };
    pendingTx?: any;
  }>({ isMultiSig: false });
  // 移除未使用的状态变量

  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  // 获取多重签名账户列表
  const { data: accountsData, loading: accountsLoading, run: fetchAccounts } = useRequest(
    () => queryMultiSignatureAccounts({ publicKey: initialState?.currentUser?.publicKey || '' }),
    {
      ready: !!initialState?.currentUser?.publicKey,
      onSuccess: (result) => {
        if (result && result.success) {
          // 处理多重签名账户数据
          console.log('Multi-signature accounts:', result);
        } else {
          console.error('Failed to fetch multi-signature accounts:', result);
        }
      },
      onError: (error) => {
        console.error('Error fetching multi-signature accounts:', error);
        message.error('获取多重签名账户失败');
      }
    }
  );

  // 处理待处理交易数据的格式化函数
  const formatPendingTransactions = (transactions: any[]) => {
    if (!transactions || !Array.isArray(transactions)) return [];

    return transactions.map(item => {
      // 如果是标准格式，处理它
      if (item.transaction) {
        const tx = item.transaction;
        const multisig = tx.asset?.multisignature || {};

        return {
          id: tx.id,
          type: tx.type,
          senderId: tx.senderId,
          senderPublicKey: tx.senderPublicKey,
          timestamp: tx.timestamp,
          amount: tx.amount,
          fee: tx.fee,
          signatures: tx.signatures || [],
          min: multisig.min || item.min,
          lifetime: multisig.lifetime || item.lifetime,
          signed: item.signed,
          keysgroup: multisig.keysgroup || [],
          asset: tx.asset
        };
      }

      // 如果已经是格式化的数据，直接返回
      return item;
    });
  };

  // 获取多重签名待处理交易
  const { data: pendingData, loading: pendingLoading, run: fetchPendingTransactions } = useRequest(
    () => queryPendingMultiSignatures({ publicKey: initialState?.currentUser?.publicKey || '' }),
    {
      ready: !!initialState?.currentUser?.publicKey,
      onSuccess: (result) => {
        if (result && result.success) {
          console.log('Pending multi-signature transactions:', result);
        } else {
          console.error('Failed to fetch pending transactions:', result);
        }
      },
      onError: (error) => {
        console.error('Error fetching pending transactions:', error);
        message.error('获取待处理交易失败');
      }
    }
  );

  // 格式化待处理交易数据
  const formattedPendingTransactions = useMemo(() => {
    if (pendingData?.success && pendingData?.transactions) {
      return formatPendingTransactions(pendingData.transactions);
    }
    return [];
  }, [pendingData]);

  // 检查账户的多重签名状态
  const checkAccountMultiSigStatus = async () => {
    if (!initialState?.currentUser?.address) return;

    try {
      const result = await checkMultiSignatureEligibility({
        address: initialState.currentUser.address
      }) as EligibilityResult;

      if (result.success) {
        if (!result.eligible) {
          // 账户已经有多重签名配置或有未确认的多重签名交易
          if (result.details?.currentMultisignature || result.details?.currentMultisig) {
            const multiSigDetails = result.details.currentMultisignature || result.details.currentMultisig;
            if (multiSigDetails) {
              setAccountMultiSigStatus({
                isMultiSig: true,
                details: {
                  min: multiSigDetails.min,
                  lifetime: multiSigDetails.lifetime,
                  keysgroup: multiSigDetails.keysgroup
                }
              });
            }
          } else if (result.details?.pendingTransactions && result.details.pendingTransactions.length > 0) {
            setAccountMultiSigStatus({
              isMultiSig: false,
              pendingTx: result.details.pendingTransactions[0]
            });
          }
        } else {
          // 账户可以创建多重签名
          setAccountMultiSigStatus({ isMultiSig: false });
        }
      }
    } catch (error) {
      console.error('检查账户多重签名状态失败:', error);
    }
  };

  // 定时刷新交易数据
  useEffect(() => {
    // 初始加载
    if (initialState?.currentUser?.publicKey) {
      fetchPendingTransactions();
      fetchSignedTransactions();
      checkAccountMultiSigStatus(); // 检查账户多重签名状态
    }

    // 设置定时器，每30秒刷新一次
    const timer = setInterval(() => {
      if (initialState?.currentUser?.publicKey) {
        fetchPendingTransactions();
        fetchSignedTransactions();
        checkAccountMultiSigStatus(); // 定时检查账户多重签名状态
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [initialState?.currentUser?.publicKey]);

  // 检查账户是否可以创建多重签名
  const [eligibilityChecking, setEligibilityChecking] = useState(false);

  const checkEligibility = async () => {
    if (!initialState?.currentUser?.address) {
      message.error('未找到当前账户地址，请重新登录');
      return false;
    }

    setEligibilityChecking(true);
    try {
      const result = await checkMultiSignatureEligibility({
        address: initialState.currentUser.address
      }) as EligibilityResult;

      console.log('Eligibility check result:', result);

      // 更新账户多重签名状态
      if (result.success) {
        if (!result.eligible) {
          // 账户已经有多重签名配置或有未确认的多重签名交易
          if (result.details?.currentMultisignature || result.details?.currentMultisig) {
            const multiSigDetails = result.details.currentMultisignature || result.details.currentMultisig;
            if (multiSigDetails) {
              setAccountMultiSigStatus({
                isMultiSig: true,
                details: {
                  min: multiSigDetails.min,
                  lifetime: multiSigDetails.lifetime,
                  keysgroup: multiSigDetails.keysgroup
                }
              });
            }
          } else if (result.details?.pendingTransactions && result.details.pendingTransactions.length > 0) {
            setAccountMultiSigStatus({
              isMultiSig: false,
              pendingTx: result.details.pendingTransactions[0]
            });
          }
        } else {
          // 账户可以创建多重签名
          setAccountMultiSigStatus({ isMultiSig: false });
        }
      }

      if (!result.success) {
        message.error('检查账户资格失败');
        return false;
      }

      if (!result.eligible) {
        // 显示不可创建的原因
        Modal.warning({
          title: '无法创建多重签名账户',
          content: (
            <div>
              <p>{result.reason || '账户不符合创建多重签名的条件'}</p>
              {(result.details?.currentMultisignature || result.details?.currentMultisig) && (
                <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                  <h4>当前多重签名配置</h4>
                  {(() => {
                    const multiSigDetails = result.details?.currentMultisignature || result.details?.currentMultisig;
                    if (multiSigDetails) {
                      return (
                        <>
                          <p>最小签名数: {multiSigDetails.min}</p>
                          <p>有效期: {multiSigDetails.lifetime}</p>
                          <p>密钥组成员: {multiSigDetails.keysgroup.length}人</p>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
              {result.details?.pendingTransactions && result.details.pendingTransactions.length > 0 && (
                <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4 }}>
                  <h4>未确认的多重签名交易</h4>
                  <p>交易ID: {result.details.pendingTransactions[0].id}</p>
                  <p>创建时间: {new Date(result.details.pendingTransactions[0].timestamp * 1000).toLocaleString()}</p>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setVisible(false);
                      setActiveTabKey('2');
                    }}
                  >
                    查看待处理交易
                  </Button>
                </div>
              )}
            </div>
          ),
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('检查账户资格失败:', error);
      message.error('检查账户资格失败，请稍后重试');
      return false;
    } finally {
      setEligibilityChecking(false);
    }
  };

  // 处理创建多重签名账户
  const handleCreateAccount = async (values: any) => {
    try {
      // 先检查账户是否可以创建多重签名
      const isEligible = await checkEligibility();
      if (!isEligible) {
        return;
      }

      // 获取当前用户的助记词
      const keyStore = getKeyStore();
      if (!keyStore) {
        message.error('未找到密钥库，请重新登录');
        return;
      }

      const { phaseKey } = keyStore;
      if (!phaseKey) {
        message.error('未找到助记词，请重新登录');
        return;
      }

      // 调用 API 创建多重签名账户
      console.log('Creating multi-signature account with params:', {
        min: values.min,
        lifetime: values.lifetime,
        keysgroup: keysgroup.map(key => `+${key}`)
      });

      const response = await createMultiSignatureAccount({
        min: values.min,
        lifetime: values.lifetime,
        keysgroup: keysgroup.map(key => `+${key}`),
        secret: phaseKey, // 使用用户的助记词
      });

      console.log('Create multi-signature account response:', response);

      if (response && response.success) {
        // 保存交易ID以便后续显示
        const txId = response.transactionId || '';
        setLastCreatedTxId(txId);

        // 显示成功提示
        setShowSuccessAlert(true);

        // 切换到待处理交易标签页
        setActiveTabKey('2');

        // 关闭模态框并重置表单
        setVisible(false);
        form.resetFields();
        setKeysgroup([]);

        // 刷新数据
        fetchAccounts();
        fetchPendingTransactions();
        checkAccountMultiSigStatus(); // 刷新账户多重签名状态

        // 5秒后自动隐藏成功提示
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      } else {
        message.error(intl.formatMessage({ id: 'pages.multi.failure' }));
      }
    } catch (error) {
      console.error('Error creating multi-signature account:', error);
      message.error(intl.formatMessage({ id: 'pages.multi.failure' }));
    }
  };

  // 处理签名交易
  const [signedTransactions, setSignedTransactions] = useState<string[]>([]);
  const [signingTransactionId, setSigningTransactionId] = useState<string>('');
  const [transactionProgress, setTransactionProgress] = useState<Record<string, any>>({});

  // 获取交易的签名进度
  const fetchTransactionProgress = async (transactionId: string) => {
    try {
      const result = await getSignatureProgress({ transactionId });
      if (result.success) {
        setTransactionProgress(prev => ({
          ...prev,
          [transactionId]: result.transaction
        }));
        return result.transaction;
      }
    } catch (error) {
      console.error('Error fetching transaction progress:', error);
    }
    return null;
  };

  // 获取用户已签名的交易
  const { loading: signedLoading, run: fetchSignedTransactions } = useRequest(
    () => querySignedTransactions({ publicKey: initialState?.currentUser?.publicKey || '' }),
    {
      ready: !!initialState?.currentUser?.publicKey,
      onSuccess: (result) => {
        if (result && result.success && result.transactions) {
          console.log('Signed transactions:', result.transactions);

          // 提取已签名交易的ID
          const signedIds = result.transactions.map((tx: any) => {
            // 如果是嵌套结构，提取交易ID
            if (tx.transaction) {
              return tx.transaction.id;
            }
            // 如果是我们的签名记录，提取transactionId
            if (tx.transactionId) {
              return tx.transactionId;
            }
            return tx.id;
          }).filter(Boolean);

          // 更新已签名交易列表
          setSignedTransactions(signedIds);
        }
      },
      onError: (error) => {
        console.error('Error fetching signed transactions:', error);
      }
    }
  );

  // 定时获取交易进度
  useEffect(() => {
    if (formattedPendingTransactions.length > 0) {
      // 初始加载所有待处理交易的进度
      const fetchAllProgress = async () => {
        for (const tx of formattedPendingTransactions) {
          await fetchTransactionProgress(tx.id);
        }
      };
      fetchAllProgress();

      // 设置定时器，每10秒刷新一次
      const timer = setInterval(() => {
        fetchAllProgress();
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [formattedPendingTransactions]);

  const handleSignTransaction = async (transactionId: string) => {
    try {
      // 设置正在签名的交易ID
      setSigningTransactionId(transactionId);

      // 获取当前用户的助记词
      const keyStore = getKeyStore();
      if (!keyStore) {
        message.error('未找到密钥库，请重新登录');
        setSigningTransactionId('');
        return;
      }

      const { phaseKey } = keyStore;
      if (!phaseKey) {
        message.error('未找到助记词，请重新登录');
        setSigningTransactionId('');
        return;
      }

      // 获取交易进度，检查是否过期
      const progress = await fetchTransactionProgress(transactionId);
      if (progress && progress.isExpired) {
        message.error('交易已过期，无法签名');
        setSigningTransactionId('');
        return;
      }

      // 调用 API 签名交易
      console.log('Signing transaction:', transactionId);

      const response = await signTransaction({
        transactionId,
        secret: phaseKey, // 使用用户的助记词
      });

      console.log('Sign transaction response:', response);

      if (response && response.success) {
        // 添加到已签名交易列表
        setSignedTransactions(prev => [...prev, transactionId]);

        // 显示成功提示
        message.success(intl.formatMessage({ id: 'pages.multi.sign.success' }));

        // 刷新数据
        fetchAccounts();
        fetchPendingTransactions();
        fetchSignedTransactions();
        fetchTransactionProgress(transactionId);
        checkAccountMultiSigStatus(); // 刷新账户多重签名状态

        // 在刷新数据前，先更新本地状态，提供即时反馈
        // 注意：这里不需要更新本地数据，因为我们已经在上面更新了signedTransactions
      } else {
        message.error(intl.formatMessage({ id: 'pages.multi.failure' }));
      }
    } catch (error) {
      console.error('Error signing transaction:', error);
      message.error(intl.formatMessage({ id: 'pages.multi.failure' }));
    } finally {
      // 无论成功失败，都清除正在签名的交易ID
      setSigningTransactionId('');
    }
  };

  // 处理添加密钥
  const handleAddKey = () => {
    if (!keyInput) {
      message.warning('请输入公钥');
      return;
    }

    if (keysgroup.includes(keyInput)) {
      message.warning('该公钥已添加');
      return;
    }

    setKeysgroup([...keysgroup, keyInput]);
    setKeyInput('');
  };

  // 处理删除密钥
  const handleRemoveKey = (key: string) => {
    setKeysgroup(keysgroup.filter(k => k !== key));
  };

  // 处理表单提交
  const handleSubmit = (values: any) => {
    if (keysgroup.length === 0) {
      message.warning('请至少添加一个公钥');
      return;
    }

    handleCreateAccount(values);
  };

  // 多重签名账户表格列定义
  const accountsColumns = [
    {
      title: intl.formatMessage({ id: 'pages.vote.address' }),
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <a href="#" target="_blank" title={text}>
          {text.length > 20 ? `${text.substring(0, 8)}...${text.substring(text.length - 8)}` : text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.multi.min' }),
      dataIndex: 'min',
      key: 'min',
    },
    {
      title: intl.formatMessage({ id: 'pages.multi.lifetime' }),
      dataIndex: 'lifetime',
      key: 'lifetime',
    },
    {
      title: intl.formatMessage({ id: 'pages.multi.keysgroup' }),
      dataIndex: 'keysgroup',
      key: 'keysgroup',
      render: (text: string[]) => {
        if (!text || !Array.isArray(text)) return null;

        return (
          <div className={styles.keysgroup}>
            {text.map((key, index) => {
              const cleanKey = key.replace('+', '');
              return (
                <Tag key={index} title={cleanKey}>
                  {cleanKey.length > 20 ? `${cleanKey.substring(0, 8)}...${cleanKey.substring(cleanKey.length - 8)}` : cleanKey}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => {
        // 检查是否有transactionId
        if (!record.transactionId) {
          return null;
        }

        // 检查当前用户是否已经签名
        const hasSignedByCurrentUser = signedTransactions.includes(record.transactionId);

        return (
          <Space>
            <Button
              onClick={() => handleSignTransaction(record.transactionId)}
              disabled={hasSignedByCurrentUser}
              type={hasSignedByCurrentUser ? 'default' : 'primary'}
              icon={hasSignedByCurrentUser ? <CheckCircleOutlined /> : null}
              style={{
                backgroundColor: hasSignedByCurrentUser ? '#f6ffed' : undefined,
                borderColor: hasSignedByCurrentUser ? '#b7eb8f' : undefined,
                color: hasSignedByCurrentUser ? '#52c41a' : undefined,
              }}
            >
              {hasSignedByCurrentUser ? intl.formatMessage({ id: 'pages.multi.pending.signed' }) : intl.formatMessage({ id: 'pages.multi.pending.sign' })}
            </Button>
          </Space>
        );
      },
    },
  ];

  // 待处理交易表格列定义
  const pendingColumns = [
    {
      title: intl.formatMessage({ id: 'pages.multi.pending.status' }),
      dataIndex: 'signatures',
      key: 'status',
      width: 80,
      render: (signatures: string[], record: any) => {
        // 检查当前用户是否已经签名
        const currentPublicKey = initialState?.currentUser?.publicKey || '';
        // 检查交易是否已经被当前用户签名
        // 1. 检查交易的signatures中是否包含当前用户的公钥
        // 2. 检查交易ID是否在我们从区块链获取的已签名交易列表中
        // 3. 检查交易的signed字段是否为true
        const hasSignedByCurrentUser = signatures?.some((sig: any) => sig.publicKey === currentPublicKey) ||
                                      signedTransactions.includes(record.id) ||
                                      record.signed === true;

        const isHighlighted = record.id === lastCreatedTxId;
        const signatureCount = signatures?.length || 0;
        const minRequired = record.min || 0;
        const isPending = signatureCount < minRequired;
        const isSigning = signingTransactionId === record.id;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isSigning ? (
              <Badge
                status="processing"
                text={
                  <span style={{ color: '#1890ff' }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} spin />
                    {intl.formatMessage({ id: 'pages.multi.pending.signing' })}
                  </span>
                }
              />
            ) : isPending ? (
              <Badge
                status={hasSignedByCurrentUser ? "warning" : "processing"}
                text={
                  <span style={{
                    color: hasSignedByCurrentUser ? '#fa8c16' : (isHighlighted ? '#1890ff' : undefined),
                    fontWeight: hasSignedByCurrentUser ? 'bold' : 'normal'
                  }}>
                    {hasSignedByCurrentUser ? (
                      <>
                        <CheckCircleOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                        {intl.formatMessage({ id: 'pages.multi.pending.signed' })}
                      </>
                    ) : (
                      <>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {intl.formatMessage({ id: 'pages.multi.pending.waiting' })}
                      </>
                    )}
                  </span>
                }
              />
            ) : (
              <Badge
                status="success"
                text={
                  <span style={{ color: '#52c41a' }}>
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    {intl.formatMessage({ id: 'pages.multi.pending.completed' })}
                  </span>
                }
              />
            )}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.id' }),
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => {
        const isHighlighted = text === lastCreatedTxId;
        return (
          <a
            href="#"
            target="_blank"
            style={{ fontWeight: isHighlighted ? 'bold' : 'normal', color: isHighlighted ? '#1890ff' : undefined }}
            title={text} // 显示完整ID作为悬停提示
          >
            {text.length > 20 ? `${text.substring(0, 8)}...${text.substring(text.length - 8)}` : text}
          </a>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.type' }),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        // 根据交易类型显示不同的文本
        const typeMap: Record<number, string> = {
          0: '转账',
          1: '签名',
          2: '委托人注册',
          3: '投票',
          4: '多重签名',
          5: '资产注册',
          // 可以根据需要添加更多类型
        };
        return typeMap[type] || `类型 ${type}`;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.senderId' }),
      dataIndex: 'senderId',
      key: 'senderId',
      render: (text: string) => (
        <a href="#" target="_blank" title={text}>
          {text.length > 20 ? `${text.substring(0, 8)}...${text.substring(text.length - 8)}` : text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.home.trans.amount' }),
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `${(text || 0) / 100000000} DDN`,
    },
    {
      title: intl.formatMessage({ id: 'pages.multi.pending.progress' }),
      dataIndex: 'signatures',
      key: 'signatures',
      render: (signatures: string[], record: any) => {
        const signatureCount = signatures?.length || 0;
        const minRequired = record.min || 0;
        const isHighlighted = record.id === lastCreatedTxId;
        const progress = transactionProgress[record.id];

        // 计算进度百分比
        const progressPercent = progress ? progress.progress : Math.round((signatureCount / minRequired) * 100);

        // 进度状态
        let status: 'active' | 'exception' | 'normal' | 'success' = 'active';
        if (progress?.isExpired) {
          status = 'exception';
        } else if (progressPercent >= 100) {
          status = 'success';
        }

        return (
          <div>
            <Tooltip title={intl.formatMessage({ id: 'pages.multi.pending.tooltip' }, { min: minRequired })}>
              <div style={{ fontWeight: isHighlighted ? 'bold' : 'normal', marginBottom: 8 }}>
                {signatureCount}/{minRequired}
              </div>
            </Tooltip>
            <Progress
              percent={progressPercent}
              size="small"
              status={status}
              style={{ marginBottom: 0 }}
            />
            {progress?.isExpired && (
              <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: 4 }}>
                交易已过期
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => {
        // 检查当前用户是否已经签名
        const currentPublicKey = initialState?.currentUser?.publicKey || '';
        const signatures = record.signatures || [];
        const hasSignedByCurrentUser = signatures.some((sig: any) => sig.publicKey === currentPublicKey) ||
                                      signedTransactions.includes(record.id) ||
                                      record.signed === true;

        // 检查是否达到最小签名数
        const signatureCount = signatures.length;
        const minRequired = record.min || 0;
        const isComplete = signatureCount >= minRequired;

        // 检查是否正在签名
        const isSigning = signingTransactionId === record.id;

        // 高亮显示最近创建或正在签名的交易
        const isHighlighted = record.id === lastCreatedTxId || isSigning;

        // 获取交易进度信息
        const progress = transactionProgress[record.id];
        const isExpired = progress?.isExpired;

        // 如果交易已过期，禁用签名按钮
        const isDisabled = hasSignedByCurrentUser || isComplete || isExpired;

        // 按钮文本
        let buttonText = intl.formatMessage({ id: 'pages.multi.pending.sign' });
        if (isSigning) {
          buttonText = intl.formatMessage({ id: 'pages.multi.pending.signing' });
        } else if (hasSignedByCurrentUser) {
          buttonText = intl.formatMessage({ id: 'pages.multi.pending.signed' });
        } else if (isComplete) {
          buttonText = intl.formatMessage({ id: 'pages.multi.pending.completed' });
        } else if (isExpired) {
          buttonText = intl.formatMessage({ id: 'pages.multi.pending.expired' });
        }

        // 按钮样式
        let buttonStyle: React.CSSProperties = {};
        if (hasSignedByCurrentUser) {
          buttonStyle = {
            backgroundColor: '#f6ffed',
            borderColor: '#b7eb8f',
            color: '#52c41a',
          };
        } else if (isExpired) {
          buttonStyle = {
            backgroundColor: '#fff2f0',
            borderColor: '#ffccc7',
            color: '#ff4d4f',
          };
        }

        return (
          <div>
            <Button
              onClick={() => handleSignTransaction(record.id)}
              disabled={isDisabled}
              type={isHighlighted && !isDisabled ? 'primary' : 'default'}
              loading={isSigning}
              icon={hasSignedByCurrentUser ? <CheckCircleOutlined /> : null}
              style={buttonStyle}
              danger={isExpired}
            >
              {buttonText}
            </Button>

            {hasSignedByCurrentUser && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#52c41a', textAlign: 'center' }}>
                <CheckCircleOutlined style={{ marginRight: '4px' }} />
                {intl.formatMessage({ id: 'pages.multi.pending.you.signed' })}
              </div>
            )}

            {progress && progress.signers && progress.signers.length > 0 && (
              <Tooltip title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>已签名的成员：</div>
                  {progress.signers.map((signer: any, index: number) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      {signer.address.substring(0, 8)}...{signer.address.substring(signer.address.length - 8)}
                    </div>
                  ))}
                </div>
              }>
                <Button type="link" size="small" style={{ padding: '0', height: 'auto', marginTop: '4px' }}>
                  查看已签名成员 ({progress.signers.length})
                </Button>
              </Tooltip>
            )}

            {progress && progress.pendingSigners && progress.pendingSigners.length > 0 && (
              <Tooltip title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>待签名的成员：</div>
                  {progress.pendingSigners.map((signer: any, index: number) => (
                    <div key={index} style={{ marginBottom: '4px' }}>
                      {signer.address.substring(0, 8)}...{signer.address.substring(signer.address.length - 8)}
                    </div>
                  ))}
                </div>
              }>
                <Button type="link" size="small" style={{ padding: '0', height: 'auto', marginTop: '4px' }}>
                  查看待签名成员 ({progress.pendingSigners.length})
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // 多重签名使用指南组件
  const MultiSignatureGuide = () => {
    const [guideVisible, setGuideVisible] = useState(true);

    return guideVisible ? (
      <div className={styles.guideContainer}>
        <div className={styles.guideHeader}>
          <div className={styles.guideTitle}>
            <TeamOutlined className={styles.guideIcon} />
            <span>多重签名使用指南</span>
          </div>
          <Space>
            <Button
              type="text"
              icon={<MinusOutlined />}
              onClick={() => setGuideVisible(false)}
              size="small"
              title="隐藏指南"
            />
          </Space>
        </div>
        <div className={styles.guideContent}>
          <div className={styles.guideSection}>
            <h3>什么是多重签名？</h3>
            <p>多重签名是一种高级安全机制，允许多个用户共同管理一个账户。当启用多重签名后，该账户的任何交易都需要多个成员的签名才能生效。</p>
          </div>

          <div className={styles.guideColumns}>
            <div className={styles.guideColumn}>
              <div className={styles.guideStep}>
                <div className={styles.guideStepIcon}>1</div>
                <div className={styles.guideStepContent}>
                  <h4>创建多重签名账户</h4>
                  <p>设置<strong>最小签名数</strong>和<strong>有效期</strong>，添加所有参与签名的成员公钥。创建请求本身需要所有成员签名才能生效。</p>
                </div>
              </div>

              <div className={styles.guideStep}>
                <div className={styles.guideStepIcon}>2</div>
                <div className={styles.guideStepContent}>
                  <h4>成员签名确认</h4>
                  <p>所有成员在“待处理交易”标签页中对创建请求进行签名确认。签名进度将实时显示。</p>
                </div>
              </div>
            </div>

            <div className={styles.guideColumn}>
              <div className={styles.guideStep}>
                <div className={styles.guideStepIcon}>3</div>
                <div className={styles.guideStepContent}>
                  <h4>账户激活</h4>
                  <p>当所有成员都完成签名后，多重签名账户将激活。此后，该账户的任何交易都需要达到最小签名数才能执行。</p>
                </div>
              </div>

              <div className={styles.guideStep}>
                <div className={styles.guideStepIcon}>4</div>
                <div className={styles.guideStepContent}>
                  <h4>交易执行</h4>
                  <p>多重签名账户发起的交易将进入“待处理”状态，需要足够成员在有效期内完成签名才能执行。</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.guideWarning}>
            <WarningOutlined className={styles.guideWarningIcon} />
            <div>
              <strong>重要提示：</strong>
              <p>创建多重签名账户后，该账户的任何交易都需要多人签名才能生效。请确保所有成员都可靠且能及时响应，否则可能导致资产无法使用。</p>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Button
        type="link"
        icon={<QuestionCircleOutlined />}
        onClick={() => setGuideVisible(true)}
        style={{ marginBottom: 16 }}
      >
        显示多重签名使用指南
      </Button>
    );
  };

  return (
    <div className={styles.multiPage}>
      {/* 账户多重签名状态指示器 */}
      <div className={styles.accountStatusContainer}>
        <div className={styles.accountStatusHeader}>
          <div className={styles.accountStatusTitle}>
            <LockOutlined className={styles.accountStatusIcon} />
            <span>账户多重签名状态</span>
          </div>
          <Button
            type="link"
            icon={<ReloadOutlined />}
            onClick={checkAccountMultiSigStatus}
            size="small"
          >
            刷新状态
          </Button>
        </div>
        <div className={styles.accountStatusContent}>
          {accountMultiSigStatus.isMultiSig && accountMultiSigStatus.details ? (
            <div className={styles.statusEnabled}>
              <CheckCircleOutlined className={styles.statusIcon} />
              <div className={styles.statusInfo}>
                <div className={styles.statusTitle}>账户已启用多重签名</div>
                <div className={styles.statusDetails}>
                  最小签名数: <strong>{accountMultiSigStatus.details.min}</strong> |
                  有效期: <strong>{accountMultiSigStatus.details.lifetime}</strong> 小时 |
                  成员数: <strong>{accountMultiSigStatus.details.keysgroup?.length || 0}</strong> 人
                </div>
              </div>
            </div>
          ) : accountMultiSigStatus.pendingTx ? (
            <div className={styles.statusPending}>
              <ClockCircleOutlined className={styles.statusIcon} />
              <div className={styles.statusInfo}>
                <div className={styles.statusTitle}>有未确认的多重签名交易</div>
                <div className={styles.statusDetails}>
                  交易ID: <strong>{accountMultiSigStatus.pendingTx.id.substring(0, 10)}...</strong> |
                  创建时间: <strong>{new Date(accountMultiSigStatus.pendingTx.timestamp * 1000).toLocaleString()}</strong>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setActiveTabKey('2')}
                    style={{ marginLeft: 8 }}
                  >
                    查看交易
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.statusDisabled}>
              <InfoCircleOutlined className={styles.statusIcon} />
              <div className={styles.statusInfo}>
                <div className={styles.statusTitle}>账户未启用多重签名</div>
                <div className={styles.statusDetails}>
                  您可以创建多重签名账户，提高资产安全性。多重签名账户的交易需要多人签名才能生效。
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setVisible(true)}
                    style={{ marginLeft: 8 }}
                    disabled={accountMultiSigStatus.isMultiSig || !!accountMultiSigStatus.pendingTx}
                  >
                    创建多重签名账户
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 多重签名使用指南 */}
      <MultiSignatureGuide />

      <Card
        title={intl.formatMessage({ id: 'pages.multi.title' })}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setVisible(true)}
            disabled={accountMultiSigStatus.isMultiSig || !!accountMultiSigStatus.pendingTx}
            title={accountMultiSigStatus.isMultiSig ? '账户已启用多重签名，不能创建新的配置' :
                  accountMultiSigStatus.pendingTx ? '有未确认的多重签名交易，请先完成签名' : ''}
          >
            {intl.formatMessage({ id: 'pages.multi.create' })}
          </Button>
        }
        variant='borderless'
      >
        {showSuccessAlert && (
          <Alert
            message={intl.formatMessage({ id: 'pages.multi.alert.title' })}
            description={
              <div>
                <p>{intl.formatMessage({ id: 'pages.multi.alert.txid' })}: <strong title={lastCreatedTxId}>{lastCreatedTxId.length > 20 ? `${lastCreatedTxId.substring(0, 8)}...${lastCreatedTxId.substring(lastCreatedTxId.length - 8)}` : lastCreatedTxId}</strong></p>
                <p>{intl.formatMessage({ id: 'pages.multi.alert.description' })}</p>
              </div>
            }
            type="success"
            showIcon
            closable
            onClose={() => setShowSuccessAlert(false)}
            style={{ marginBottom: 16 }}
          />
        )}

        <Tabs activeKey={activeTabKey} onChange={(key) => {
          setActiveTabKey(key);
          // 切换到待处理交易标签页时，检查账户多重签名状态
          if (key === '2') {
            checkAccountMultiSigStatus();
          }
        }}>
          <TabPane
            tab={
              <span>多重签名账户</span>
            }
            key="1"
          >
            <Table
              loading={accountsLoading}
              dataSource={accountsData?.success && accountsData.data?.accounts ? accountsData.data.accounts : []}
              columns={accountsColumns}
              rowKey="address"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                {intl.formatMessage({ id: 'pages.multi.pending.title' })}
                {formattedPendingTransactions.length > 0 && (
                  <Badge count={formattedPendingTransactions.length} style={{ marginLeft: 8 }} />
                )}
              </span>
            }
            key="2"
          >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{intl.formatMessage({ id: 'pages.multi.pending.header' })}</h3>
                <p style={{ color: '#888', margin: '4px 0 0 0' }}>
                  {intl.formatMessage({ id: 'pages.multi.pending.description' })}
                </p>
              </div>
              <Button
                onClick={() => {
                  fetchPendingTransactions();
                  fetchSignedTransactions();
                  checkAccountMultiSigStatus(); // 同时检查账户多重签名状态
                }}
                loading={pendingLoading || signedLoading}
              >
                <ReloadOutlined /> 刷新
              </Button>
            </div>

            {formattedPendingTransactions.length > 0 ? (
              <Table
                loading={pendingLoading}
                dataSource={formattedPendingTransactions}
                columns={pendingColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            ) : (
              <div style={{
                padding: '40px 0',
                textAlign: 'center',
                background: '#f5f5f5',
                borderRadius: '4px',
                color: '#888'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>
                  <ClockCircleOutlined />
                </div>
                <p>{intl.formatMessage({ id: 'pages.multi.pending.empty' })}</p>
                <Button
                  type="primary"
                  onClick={() => setVisible(true)}
                  style={{ marginTop: 16 }}
                  disabled={accountMultiSigStatus.isMultiSig || !!accountMultiSigStatus.pendingTx}
                  title={accountMultiSigStatus.isMultiSig ? '账户已启用多重签名，不能创建新的配置' :
                        accountMultiSigStatus.pendingTx ? '有未确认的多重签名交易，请先完成签名' : ''}
                >
                  {intl.formatMessage({ id: 'pages.multi.create' })}
                </Button>
                {(accountMultiSigStatus.isMultiSig || !!accountMultiSigStatus.pendingTx) && (
                  <div style={{ marginTop: 8, color: '#ff4d4f', fontSize: 12 }}>
                    {accountMultiSigStatus.isMultiSig ? '账户已启用多重签名，不能创建新的配置' :
                     '有未确认的多重签名交易，请先完成签名'}
                  </div>
                )}
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'pages.multi.create' })}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setKeysgroup([]);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Spin spinning={eligibilityChecking}>
          <Tabs defaultActiveKey="form" type="card">
            <TabPane tab={
              <span>
                <TeamOutlined /> 创建多重签名
              </span>
            } key="form">
              <Alert
                message="重要提示"
                description={
                  <div>
                    <p>创建多重签名账户后，该账户的任何交易都需要多人签名才能生效。请确保所有成员都可靠且能及时响应。</p>
                    <p>创建多重签名账户的交易本身也需要所有成员签名才能生效。</p>
                  </div>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  name="min"
                  label={
                    <span>
                      {intl.formatMessage({ id: 'pages.multi.min' })}
                      <Tooltip title="交易执行所需的最少签名人数，包括交易发起人">
                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: '请输入最小签名数' }]}
                  extra="设置交易执行所需的最少签名人数，必须小于或等于密钥组成员数+1（包括交易发起人）"
                >
                  <InputNumber style={{ width: '100%' }} min={2} max={16} />
                </Form.Item>
                <Form.Item
                  name="lifetime"
                  label={
                    <span>
                      {intl.formatMessage({ id: 'pages.multi.lifetime' })}
                      <Tooltip title="交易在链上等待其他成员签名的最长时间（小时）">
                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: '请输入有效期' }]}
                  initialValue={24}
                  extra="设置交易在链上等待其他成员签名的最长时间，超过这个时间交易将过期"
                >
                  <InputNumber style={{ width: '100%' }} min={1} max={72} />
                </Form.Item>
                <Form.Item
                  label={
                    <span>
                      {intl.formatMessage({ id: 'pages.multi.keysgroup' })}
                      <Tooltip title="添加所有参与多重签名的成员公钥">
                        <InfoCircleOutlined style={{ marginLeft: 8 }} />
                      </Tooltip>
                    </span>
                  }
                  required
                  extra={
                    <div>
                      <div>当前已添加 <strong>{keysgroup.length}</strong> 个成员公钥</div>
                      {keysgroup.length > 0 && form.getFieldValue('min') && (
                        <div>
                          交易需要 <strong>{form.getFieldValue('min')}</strong> 人签名，
                          其中包括交易发起人和密钥组中的 <strong>{Math.max(0, form.getFieldValue('min') - 1)}</strong> 人
                        </div>
                      )}
                    </div>
                  }
                >
                  <div className={styles.keysgroupInput}>
                    <Input
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="请输入公钥"
                      suffix={
                        <Tooltip title="点击获取公钥">
                          <KeyOutlined onClick={() => setPublicKeyModalVisible(true)} style={{ cursor: 'pointer', color: '#1890ff' }} />
                        </Tooltip>
                      }
                    />
                    <Button type="primary" onClick={handleAddKey}>
                      {intl.formatMessage({ id: 'pages.multi.add' })}
                    </Button>
                  </div>
                  <div style={{ marginBottom: '8px', fontSize: '12px', color: '#888' }}>
                    <QuestionCircleOutlined style={{ marginRight: '4px' }} />
                    <span>不知道如何获取公钥？</span>
                    <Button type="link" size="small" onClick={() => setPublicKeyModalVisible(true)} style={{ padding: '0 4px' }}>
                      点击这里获取公钥
                    </Button>
                  </div>
                  <div className={styles.keysgroupList}>
                    {keysgroup.map((key, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => handleRemoveKey(key)}
                        color="blue"
                      >
                        {key.length > 20 ? `${key.substring(0, 8)}...${key.substring(key.length - 8)}` : key}
                      </Tag>
                    ))}
                  </div>
                </Form.Item>
                <Form.Item>
                  <div className={styles.buttonContainer}>
                    <Space>
                      <Button onClick={() => {
                        setVisible(false);
                        setKeysgroup([]);
                        form.resetFields();
                      }}>
                        取消
                      </Button>
                      <Button type="primary" htmlType="submit">
                        {intl.formatMessage({ id: 'pages.multi.submit' })}
                      </Button>
                    </Space>
                  </div>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab={
              <span>
                <QuestionCircleOutlined /> 使用指南
              </span>
            } key="guide">
              <div style={{ padding: '15px', borderRadius: '4px', border: '1px solid #e8e8e8' }}>
                <h3 style={{ marginTop: 0, color: '#1890ff' }}>{intl.formatMessage({ id: 'pages.multi.guide' })}</h3>
                <p>{intl.formatMessage({ id: 'pages.multi.guide.description' })}</p>

                <h4>创建多重签名账户的步骤：</h4>
                <ol>
                  <li>
                    <strong>{intl.formatMessage({ id: 'pages.multi.guide.step1' })}</strong>
                    <p>这个数字决定了执行交易需要多少人签名。例如，如果设置为3，则交易需要至少3人签名才能执行。</p>
                  </li>
                  <li>
                    <strong>{intl.formatMessage({ id: 'pages.multi.guide.step2' })}</strong>
                    <p>这个时间决定了交易在链上等待签名的最长时间。超过这个时间，交易将被视为过期。</p>
                  </li>
                  <li>
                    <strong>{intl.formatMessage({ id: 'pages.multi.guide.step3' })}</strong>
                    <p>添加所有参与多重签名的成员的公钥。这些成员将有权对交易进行签名。</p>
                  </li>
                </ol>

                <h4>多重签名账户的使用流程：</h4>
                <ol>
                  <li>
                    <strong>创建多重签名账户</strong>
                    <p>创建者填写表单并提交创建请求。这个请求本身就是一个需要多重签名的交易。</p>
                  </li>
                  <li>
                    <strong>其他成员签名</strong>
                    <p>密钥组中的所有成员都需要对创建交易进行签名。他们可以在“待处理交易”标签页中找到并签名这个交易。</p>
                  </li>
                  <li>
                    <strong>账户激活</strong>
                    <p>当所有成员都签名后，多重签名账户就激活了。此后，该账户的任何交易都需要至少“最小签名数”的成员签名才能执行。</p>
                  </li>
                  <li>
                    <strong>执行交易</strong>
                    <p>当多重签名账户发起交易时，交易会先进入“待处理”状态。密钥组成员需要在有效期内对交易进行签名，直到达到最小签名数。</p>
                  </li>
                </ol>

                <Alert
                  message="重要提示"
                  description={intl.formatMessage({ id: 'pages.multi.guide.note' })}
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </Modal>

      {/* 获取公钥的模态框 */}
      <PublicKeyModal
        visible={publicKeyModalVisible}
        onClose={() => setPublicKeyModalVisible(false)}
      />
    </div>
  );
};

export default MultiPage;
