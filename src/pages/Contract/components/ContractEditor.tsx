import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Space, Tooltip, message, Input } from 'antd';
import { CopyOutlined, DownloadOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from './ContractEditor.less';

const { TabPane } = Tabs;

interface ContractEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: number;
  showToolbar?: boolean;
}

/**
 * 智能合约编辑器组件
 */
const ContractEditor: React.FC<ContractEditorProps> = ({
  value = '',
  onChange,
  readOnly = false,
  height = 400,
  showToolbar = true,
}) => {
  const intl = useIntl();
  const [code, setCode] = useState<string>(value);
  const [activeTab, setActiveTab] = useState<string>('editor');

  // 当外部value变化时更新内部状态
  useEffect(() => {
    setCode(value);
  }, [value]);

  // 编辑器配置已简化

  // 编辑器内容变化处理
  const handleEditorChange = (newValue: string) => {
    setCode(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // 复制代码到剪贴板
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(
      () => {
        message.success(intl.formatMessage({ id: 'pages.common.copy.success' }));
      },
      (err) => {
        console.error('Failed to copy code:', err);
        message.error(intl.formatMessage({ id: 'pages.common.copy.failed' }));
      }
    );
  };

  // 下载代码文件
  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'contract.ts';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 插入代币合约模板
  const insertTokenContractTemplate = () => {
    const template = `import { SmartContract, Address, Context, BigNumber } from '@ddn/contract-sdk';

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

    handleEditorChange(template);
  };

  // 插入投票合约模板
  const insertVotingContractTemplate = () => {
    const template = `import { SmartContract, Address, Context } from '@ddn/contract-sdk';

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

    handleEditorChange(template);
  };

  // 插入空合约模板
  const insertEmptyContractTemplate = () => {
    const template = `import { SmartContract, Address, Context } from '@ddn/contract-sdk';

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

    handleEditorChange(template);
  };

  // 渲染模板选择器
  const renderTemplateSelector = () => {
    if (readOnly) return null;

    return (
      <div className={styles.templateSelector}>
        <h3>{intl.formatMessage({ id: 'pages.contract.editor.templates' })}</h3>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button block onClick={insertEmptyContractTemplate}>
            {intl.formatMessage({ id: 'pages.contract.editor.template.empty' })}
          </Button>
          <Button block onClick={insertTokenContractTemplate}>
            {intl.formatMessage({ id: 'pages.contract.editor.template.token' })}
          </Button>
          <Button block onClick={insertVotingContractTemplate}>
            {intl.formatMessage({ id: 'pages.contract.editor.template.voting' })}
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <Card className={styles.editorCard}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <CodeOutlined />
              {intl.formatMessage({ id: 'pages.contract.editor.code' })}
            </span>
          }
          key="editor"
        >
          <div className={styles.editorContainer}>
            <div className={styles.editorWrapper}>
              <Input.TextArea
                value={code}
                onChange={(e) => handleEditorChange(e.target.value)}
                style={{ height: height, fontFamily: 'monospace' }}
                className={styles.codeTextarea}
              />
            </div>
            {!readOnly && renderTemplateSelector()}
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              {intl.formatMessage({ id: 'pages.contract.editor.help' })}
            </span>
          }
          key="help"
        >
          <div className={styles.helpContent}>
            <h3>{intl.formatMessage({ id: 'pages.contract.editor.help.title' })}</h3>
            <p>{intl.formatMessage({ id: 'pages.contract.editor.help.description' })}</p>

            <h4>{intl.formatMessage({ id: 'pages.contract.editor.help.structure' })}</h4>
            <ul>
              <li>{intl.formatMessage({ id: 'pages.contract.editor.help.structure.class' })}</li>
              <li>{intl.formatMessage({ id: 'pages.contract.editor.help.structure.constructor' })}</li>
              <li>{intl.formatMessage({ id: 'pages.contract.editor.help.structure.methods' })}</li>
            </ul>

            <h4>{intl.formatMessage({ id: 'pages.contract.editor.help.tips' })}</h4>
            <ul>
              <li>{intl.formatMessage({ id: 'pages.contract.editor.help.tips.1' })}</li>
              <li>{intl.formatMessage({ id: 'pages.contract.editor.help.tips.2' })}</li>
              <li>{intl.formatMessage({ id: 'pages.contract.editor.help.tips.3' })}</li>
            </ul>

            <p>
              <a href="/docs/contract-specification" target="_blank" rel="noopener noreferrer">
                {intl.formatMessage({ id: 'pages.contract.editor.help.documentation' })}
              </a>
            </p>
          </div>
        </TabPane>
      </Tabs>

      {showToolbar && (
        <div className={styles.editorToolbar}>
          <Space>
            <Tooltip title={intl.formatMessage({ id: 'pages.common.copy' })}>
              <Button icon={<CopyOutlined />} onClick={handleCopyCode} />
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: 'pages.common.download' })}>
              <Button icon={<DownloadOutlined />} onClick={handleDownloadCode} />
            </Tooltip>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default ContractEditor;
