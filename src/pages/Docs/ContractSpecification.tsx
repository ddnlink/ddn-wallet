import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Breadcrumb, Divider } from 'antd';
import { HomeOutlined, BookOutlined, CodeOutlined } from '@ant-design/icons';
import { useIntl, history } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import styles from './ContractSpecification.less';

const { Title, Paragraph } = Typography;

/**
 * 智能合约规范文档页面
 */
const ContractSpecification: React.FC = () => {
  const intl = useIntl();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // 加载文档内容
  useEffect(() => {
    // 模拟加载文档
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // 返回合约列表
  const handleBack = () => {
    history.push('/contract/list');
  };

  return (
    <PageContainer
      header={{
        title: 'DDN智能合约规范',
        subTitle: '编写符合DDN区块链标准的智能合约',
        onBack: handleBack,
      }}
    >
      <div className={styles.container}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item href="/home">
            <HomeOutlined />
            <span>首页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/contract/list">
            <CodeOutlined />
            <span>智能合约</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <BookOutlined />
            <span>合约规范</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Card className={styles.docCard}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <Paragraph className={styles.loadingText}>加载文档中...</Paragraph>
            </div>
          ) : (
            <div className={styles.markdownContainer}>
              <Typography.Title level={1}>DDN智能合约规范</Typography.Title>

              <Typography.Title level={2}>简介</Typography.Title>
              <Typography.Paragraph>
                DDN智能合约是基于TypeScript语言的链上可执行程序，可以在DDN区块链上自动执行业务逻辑。本文档提供了DDN智能合约的编写规范和示例，帮助开发者快速上手智能合约开发。
              </Typography.Paragraph>

              <Typography.Title level={2}>合约结构</Typography.Title>
              <Typography.Paragraph>
                DDN智能合约采用TypeScript语言编写，一个标准的合约结构如下：
              </Typography.Paragraph>

              <Card style={{ marginBottom: 16, background: '#f6f8fa' }}>
                <pre style={{ fontFamily: 'monospace', fontSize: '14px' }}>
{`// 导入DDN合约SDK
import { SmartContract, Address, Context, BigNumber } from '@ddn/contract-sdk';

/**
 * 示例合约
 */
export class ExampleContract extends SmartContract {
  // 合约状态变量
  private owner: Address;
  private balance: Map<string, BigNumber>;

  /**
   * 构造函数，合约部署时自动执行
   * @param ctx 合约上下文
   */
  constructor(ctx: Context) {
    super(ctx);
    this.owner = ctx.sender;
    this.balance = new Map<string, BigNumber>();
  }

  /**
   * 存储数据
   * @param key 键
   * @param value 值
   */
  public store(key: string, value: string): void {
    // 检查调用者是否为合约拥有者
    this.requireOwner();

    // 存储数据
    this.ctx.storage.set(key, value);

    // 触发事件
    this.ctx.emit('Store', { key, value });
  }

  /**
   * 查询数据
   * @param key 键
   * @returns 存储的值
   */
  public query(key: string): string {
    return this.ctx.storage.get(key) || '';
  }

  /**
   * 检查调用者是否为合约拥有者
   */
  private requireOwner(): void {
    if (!this.ctx.sender.equals(this.owner)) {
      throw new Error('Only contract owner can call this method');
    }
  }
}`}
                </pre>
              </Card>

              <Typography.Title level={2}>合约编写规范</Typography.Title>

              <Typography.Title level={3}>1. 基本规则</Typography.Title>
              <ul>
                <li>合约必须继承自SmartContract基类</li>
                <li>合约必须有一个构造函数，接收Context类型的参数</li>
                <li>合约中的公共方法可以被外部调用，私有方法只能在合约内部调用</li>
                <li>合约状态存储在区块链上，可以通过ctx.storage进行读写操作</li>
              </ul>

              <Typography.Title level={3}>2. 数据类型</Typography.Title>
              <Typography.Paragraph>
                DDN智能合约支持以下数据类型：
              </Typography.Paragraph>
              <ul>
                <li>基本类型：string, number, boolean</li>
                <li>复杂类型：BigNumber, Address, Map, Array</li>
                <li>自定义类型：可以使用TypeScript接口和类定义自定义数据结构</li>
              </ul>

              <Typography.Title level={2}>部署与调用</Typography.Title>

              <Typography.Title level={3}>部署合约</Typography.Title>
              <Typography.Paragraph>
                1. 编写合约代码<br/>
                2. 使用DDN SDK构建部署交易<br/>
                3. 提交交易到区块链
              </Typography.Paragraph>

              <Card style={{ marginBottom: 16, background: '#f6f8fa' }}>
                <pre style={{ fontFamily: 'monospace', fontSize: '14px' }}>
{`// 部署合约
const options = {
  name: 'Token Contract',
  desc: '简单的代币合约示例',
  code: contractCode, // 合约代码字符串
  gas_limit: '100000',
  version: '1.0.0'
};

const trs = DdnJS.contract.createContract(options, secret);`}
                </pre>
              </Card>

              <Typography.Title level={3}>调用合约</Typography.Title>

              <Card style={{ marginBottom: 16, background: '#f6f8fa' }}>
                <pre style={{ fontFamily: 'monospace', fontSize: '14px' }}>
{`// 调用合约方法
const options = {
  id: 'contractId', // 合约ID
  method: 'transfer', // 方法名
  args: ['DKAzdDnLnB6TcgwfTCGfEQ7pTE94a5FW1C', '1000'] // 方法参数
};

const trs = DdnJS.contract.call(options, secret);`}
                </pre>
              </Card>

              <Typography.Title level={2}>最佳实践</Typography.Title>

              <Typography.Title level={3}>1. 安全性</Typography.Title>
              <ul>
                <li>始终验证调用者权限</li>
                <li>检查输入参数的有效性</li>
                <li>避免无限循环和过高的计算复杂度</li>
              </ul>

              <Typography.Title level={3}>2. 优化</Typography.Title>
              <ul>
                <li>减少存储操作，优化Gas消耗</li>
                <li>合理设计数据结构</li>
                <li>避免不必要的计算</li>
              </ul>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default ContractSpecification;
