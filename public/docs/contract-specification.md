# DDN智能合约规范

## 简介

DDN智能合约是基于TypeScript语言的链上可执行程序，可以在DDN区块链上自动执行业务逻辑。本文档提供了DDN智能合约的编写规范和示例，帮助开发者快速上手智能合约开发。

## 合约结构

DDN智能合约采用TypeScript语言编写，一个标准的合约结构如下：

```typescript
// 导入DDN合约SDK
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
}
```

## 合约编写规范

### 1. 基本规则

- 合约必须继承自`SmartContract`基类
- 合约必须有一个构造函数，接收`Context`类型的参数
- 合约中的公共方法可以被外部调用，私有方法只能在合约内部调用
- 合约状态存储在区块链上，可以通过`ctx.storage`进行读写操作

### 2. 数据类型

DDN智能合约支持以下数据类型：

- 基本类型：`string`, `number`, `boolean`
- 复杂类型：`BigNumber`, `Address`, `Map`, `Array`
- 自定义类型：可以使用TypeScript接口和类定义自定义数据结构

### 3. 合约上下文

合约上下文`Context`提供了以下功能：

- `ctx.sender`: 当前交易的发送者地址
- `ctx.block`: 当前区块信息
- `ctx.transaction`: 当前交易信息
- `ctx.storage`: 合约存储接口，用于读写合约状态
- `ctx.emit`: 触发合约事件，可被外部监听

### 4. 异常处理

合约中可以使用`throw new Error()`抛出异常，当异常发生时，交易将被回滚，不会对区块链状态产生影响。

### 5. Gas限制

合约执行需要消耗Gas，每个操作都有相应的Gas消耗。部署合约时需要指定Gas限制，如果合约执行过程中Gas消耗超过限制，交易将失败。

## 合约示例

### 1. 代币合约

```typescript
import { SmartContract, Address, Context, BigNumber } from '@ddn/contract-sdk';

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
}
```

### 2. 投票合约

```typescript
import { SmartContract, Address, Context } from '@ddn/contract-sdk';

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
}
```

## 部署与调用

### 部署合约

1. 编写合约代码
2. 使用DDN SDK构建部署交易
3. 提交交易到区块链

```javascript
// 部署合约
const options = {
  name: 'Token Contract',
  desc: '简单的代币合约示例',
  code: contractCode, // 合约代码字符串
  gas_limit: '100000',
  version: '1.0.0'
};

const trs = DdnJS.contract.createContract(options, secret);
```

### 调用合约

```javascript
// 调用合约方法
const options = {
  id: 'contractId', // 合约ID
  method: 'transfer', // 方法名
  args: ['DKAzdDnLnB6TcgwfTCGfEQ7pTE94a5FW1C', '1000'] // 方法参数
};

const trs = DdnJS.contract.call(options, secret);
```

## 最佳实践

1. **安全性**：
   - 始终验证调用者权限
   - 检查输入参数的有效性
   - 避免无限循环和过高的计算复杂度

2. **优化**：
   - 减少存储操作，优化Gas消耗
   - 合理设计数据结构
   - 避免不必要的计算

3. **可维护性**：
   - 添加详细的注释
   - 使用有意义的变量名和函数名
   - 模块化设计，分离业务逻辑

4. **测试**：
   - 在部署前充分测试合约
   - 考虑各种边界情况
   - 使用DDN提供的测试工具验证合约行为

## 常见问题

1. **Q: 合约部署失败怎么办？**
   A: 检查合约代码是否有语法错误，确保Gas限制足够高。

2. **Q: 如何调试合约？**
   A: 使用DDN提供的测试环境和调试工具，或者通过事件记录关键信息。

3. **Q: 合约可以升级吗？**
   A: DDN智能合约一旦部署不可修改，但可以通过设计模式实现可升级合约。

4. **Q: 合约执行超时怎么办？**
   A: 优化合约代码，减少计算复杂度，或者增加Gas限制。
