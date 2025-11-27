import React, { useState } from 'react';
import { Card, Button, Space, Typography, Divider, Form } from 'antd';
import { CodeOutlined, FileTextOutlined, WalletOutlined, BarChartOutlined, BookOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { FormInstance } from 'antd/lib/form';
import ContractSpecDrawer from './ContractSpecDrawer';
import styles from './ContractTemplates.less';

const { Title, Paragraph, Text } = Typography;

interface ContractTemplatesProps {
  form: FormInstance;
  onSelectTemplate?: (code: string) => void;
}

/**
 * 智能合约模板选择器组件
 */
const ContractTemplates: React.FC<ContractTemplatesProps> = ({ form, onSelectTemplate }) => {
  const intl = useIntl();
  const [specDrawerVisible, setSpecDrawerVisible] = useState<boolean>(false);

  // 空白合约模板
  const emptyContractTemplate = `import { SmartContract, Address, Context } from '@ddn/contract-sdk';

/**
 * 自定义合约
 */
export class MyContract extends SmartContract {
  private owner: Address;

  constructor(ctx: Context) {
    super(ctx);
    this.owner = ctx.sender;
  }

  /**
   * 示例方法
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
}`;

  // 代币合约模板
  const tokenContractTemplate = `import { SmartContract, Address, Context, BigNumber } from '@ddn/contract-sdk';

/**
 * 简单代币合约
 */
export class TokenContract extends SmartContract {
  private owner: Address;
  private name: string;
  private symbol: string;
  private decimals: number;
  private totalSupply: BigNumber;
  private balances: Map<string, BigNumber>;

  constructor(ctx: Context) {
    super(ctx);
    this.owner = ctx.sender;
    this.name = 'DDN Token';
    this.symbol = 'DDT';
    this.decimals = 8;
    this.totalSupply = new BigNumber(1000000).multipliedBy(new BigNumber(10).pow(this.decimals));
    this.balances = new Map<string, BigNumber>();

    // 初始化，将所有代币分配给合约创建者
    this.balances.set(this.owner.toString(), this.totalSupply);
  }

  /**
   * 获取代币名称
   */
  public getName(): string {
    return this.name;
  }

  /**
   * 获取代币符号
   */
  public getSymbol(): string {
    return this.symbol;
  }

  /**
   * 获取账户余额
   * @param owner 账户地址
   */
  public balanceOf(owner: Address): BigNumber {
    return this.balances.get(owner.toString()) || new BigNumber(0);
  }

  /**
   * 转账
   * @param to 接收地址
   * @param value 金额
   */
  public transfer(to: Address, value: BigNumber): boolean {
    const sender = this.ctx.sender;
    const senderBalance = this.balanceOf(sender);

    if (senderBalance.lt(value)) {
      return false;
    }

    this.balances.set(sender.toString(), senderBalance.minus(value));
    this.balances.set(to.toString(), this.balanceOf(to).plus(value));

    this.ctx.emit('Transfer', { from: sender, to, value });
    return true;
  }
}`;

  // 投票合约模板
  const votingContractTemplate = `import { SmartContract, Address, Context } from '@ddn/contract-sdk';

/**
 * 简单投票合约
 */
export class VotingContract extends SmartContract {
  private owner: Address;
  private proposals: Map<number, string>;
  private votes: Map<number, number>;
  private voters: Map<string, boolean>;
  private proposalCount: number;
  private votingOpen: boolean;

  constructor(ctx: Context) {
    super(ctx);
    this.owner = ctx.sender;
    this.proposals = new Map<number, string>();
    this.votes = new Map<number, number>();
    this.voters = new Map<string, boolean>();
    this.proposalCount = 0;
    this.votingOpen = false;
  }

  /**
   * 添加提案
   * @param description 提案描述
   */
  public addProposal(description: string): number {
    // 只有合约拥有者可以添加提案
    this.requireOwner();

    // 投票开始后不能添加提案
    if (this.votingOpen) {
      throw new Error('Voting has already started');
    }

    const proposalId = this.proposalCount++;
    this.proposals.set(proposalId, description);
    this.votes.set(proposalId, 0);

    this.ctx.emit('ProposalAdded', { id: proposalId, description });
    return proposalId;
  }

  /**
   * 开始投票
   */
  public startVoting(): boolean {
    this.requireOwner();

    if (this.votingOpen) {
      return false;
    }

    if (this.proposalCount === 0) {
      throw new Error('No proposals to vote on');
    }

    this.votingOpen = true;
    this.ctx.emit('VotingStarted', {});
    return true;
  }

  /**
   * 投票
   * @param proposalId 提案ID
   */
  public vote(proposalId: number): boolean {
    const sender = this.ctx.sender;

    // 检查投票是否开始
    if (!this.votingOpen) {
      throw new Error('Voting is not open');
    }

    // 检查提案是否存在
    if (!this.proposals.has(proposalId)) {
      throw new Error('Proposal does not exist');
    }

    // 检查是否已经投票
    if (this.voters.get(sender.toString())) {
      throw new Error('Already voted');
    }

    // 记录投票
    this.votes.set(proposalId, (this.votes.get(proposalId) || 0) + 1);
    this.voters.set(sender.toString(), true);

    this.ctx.emit('Voted', { voter: sender, proposalId });
    return true;
  }

  /**
   * 检查调用者是否为合约拥有者
   */
  private requireOwner(): void {
    if (!this.ctx.sender.equals(this.owner)) {
      throw new Error('Only contract owner can call this method');
    }
  }
}`;

  return (
    <>
      <Card className={styles.templatesCard}>
        <Title level={4}>
          <CodeOutlined /> {intl.formatMessage({ id: 'pages.contract.editor.templates' })}
        </Title>

        <Paragraph>
          选择一个合约模板快速开始，或者从头编写您的合约代码。
        </Paragraph>

        <Divider />

        <div className={styles.templateList}>
          <Card
            className={styles.templateItem}
            hoverable
            onClick={() => {
              console.log('Empty template clicked, code length:', emptyContractTemplate.length);
              form.setFieldsValue({ code: emptyContractTemplate });
              if (onSelectTemplate) {
                onSelectTemplate(emptyContractTemplate);
              }
            }}
          >
            <FileTextOutlined className={styles.templateIcon} />
            <div className={styles.templateInfo}>
              <Text strong>空白合约</Text>
              <Text type="secondary">基础合约结构，包含简单的存储和查询功能</Text>
            </div>
          </Card>

          <Card
            className={styles.templateItem}
            hoverable
            onClick={() => {
              console.log('Token template clicked, code length:', tokenContractTemplate.length);
              form.setFieldsValue({ code: tokenContractTemplate });
              if (onSelectTemplate) {
                onSelectTemplate(tokenContractTemplate);
              }
            }}
          >
            <WalletOutlined className={styles.templateIcon} />
            <div className={styles.templateInfo}>
              <Text strong>代币合约</Text>
              <Text type="secondary">实现基本的代币功能，包括转账和余额查询</Text>
            </div>
          </Card>

          <Card
            className={styles.templateItem}
            hoverable
            onClick={() => {
              console.log('Voting template clicked, code length:', votingContractTemplate.length);
              form.setFieldsValue({ code: votingContractTemplate });
              if (onSelectTemplate) {
                onSelectTemplate(votingContractTemplate);
              }
            }}
          >
            <BarChartOutlined className={styles.templateIcon} />
            <div className={styles.templateInfo}>
              <Text strong>投票合约</Text>
              <Text type="secondary">实现简单的投票系统，支持提案创建和投票</Text>
            </div>
          </Card>
        </div>

        <Divider />

        <div className={styles.templateFooter}>
          <Button
            type="link"
            onClick={() => setSpecDrawerVisible(true)}
            icon={<BookOutlined />}
          >
            查看完整的智能合约开发文档
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

export default ContractTemplates;
