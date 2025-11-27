[English](./README.md) | 简体中文

<h1 align="center">DDN Wallet</h1>

<p align="center">
  <a href="https://github.com/ddnlink/ddn-wallet">
    <img alt="DDN Wallet" src="./public/logo.svg" width="200" />
  </a>
</p>

<p align="center">
  一个安全、功能丰富的 DDN 区块链生态系统网页钱包
</p>

<p align="center">
  <a href="https://github.com/ddnlink/ddn-wallet/actions"><img src="https://github.com/ddnlink/ddn-wallet/workflows/CI/badge.svg" alt="CI 状态" /></a>
  <a href="https://github.com/ddnlink/ddn-wallet/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ddnlink/ddn-wallet" alt="许可证" /></a>
  <a href="https://github.com/ddnlink/ddn-wallet/releases"><img src="https://img.shields.io/github/v/release/ddnlink/ddn-wallet" alt="版本" /></a>
</p>

## 目录

- [项目概述](#项目概述)
- [功能特性](#功能特性)
- [架构设计](#架构设计)
- [快速开始](#快速开始)
  - [环境要求](#环境要求)
  - [安装步骤](#安装步骤)
  - [配置说明](#配置说明)
  - [运行钱包](#运行钱包)
- [使用指南](#使用指南)
  - [账户管理](#账户管理)
  - [转账](#转账)
  - [投票](#投票)
  - [资产管理](#资产管理)
  - [多重签名](#多重签名)
  - [智能合约](#智能合约)
  - [DAO 治理](#dao-治理)
  - [存证功能](#存证功能)
  - [DApp 集成](#dapp-集成)
- [技术栈](#技术栈)
- [浏览器支持](#浏览器支持)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 项目概述

DDN Wallet 是一个为 DDN 区块链平台打造的综合网页钱包应用。它为用户提供了一个安全直观的界面，用于管理 DDN 资产、与智能合约交互、参与治理以及探索区块链生态系统。

## 功能特性

### 🧑‍💼 账户管理
- 使用安全的密钥生成创建新的 DDN 账户
- 通过助记词或私钥登录
- 查看账户余额和交易历史
- 导出账户信息以便备份

### 💸 转账
- 向其他地址发送 DDN 代币
- 多步骤转账流程增强安全性
- 实时余额更新和交易状态

### 🗳️ 投票
- 投票选举网络受托人参与治理
- 注册成为受托人，为网络共识做出贡献
- 查看受托人统计数据和性能指标

### 🏦 资产管理
- 注册为资产发行商
- 在 DDN 区块链上创建自定义资产
- 发行、转移和管理资产
- 查看资产交易历史

### 🔐 多重签名
- 创建多重签名账户以增强安全性
- 管理签名阈值和参与者
- 执行需要多重签名的交易

### 📝 智能合约
- 向 DDN 区块链部署智能合约
- 与现有合约交互
- 查看合约详情和执行历史

### 🤝 DAO 治理
- 参与去中心化自治组织
- 创建和管理 DAO 提案
- 对 DAO 治理决策进行投票

### 📄 存证功能
- 在区块链上上传和验证数字证据
- 创建文档和交易的不可篡改记录
- 验证证据的真实性

### 🚀 DApp 集成
- 访问基于 DDN 构建的去中心化应用
- 使用您的钱包安全地与 DApp 交互

## 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                        DDN 钱包前端                             │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│ 账户管理│ 转账    │ 投票    │ 资产管理│ 智能合约│ DAO 治理    │
└────┬────┴────┬────┴────┬────┴────┬────┴────┬────┴──────┬─────┘
     │         │         │         │         │           │
     └─────────┼─────────┼─────────┼─────────┼───────────┤
               │         │         │         │           │
┌──────────────▼─────────▼─────────▼─────────▼───────────▼────┐
│                      DDN JS SDK                              │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│                      DDN 区块链                               │
└───────────────────────────────────────────────────────────────┘
```

## 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- Git

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/ddnlink/ddn-wallet.git
cd ddn-wallet
```

2. 安装依赖：

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 配置说明

钱包可以通过修改 `config/` 目录下的文件进行配置：

- `config.ts`：主应用配置
- `proxy.ts`：API 代理设置
- `routes.ts`：应用路由配置

### 运行钱包

启动开发服务器：

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev
```

钱包将在 `http://localhost:8000` 可用

### 生产构建

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build
```

构建文件将位于 `dist/` 目录中。

## 使用指南

### 账户管理

1. **创建账户**：导航到用户注册页面，使用助记词创建新账户。
2. **登录**：使用助记词或私钥登录账户。
3. **查看账户**：从首页访问账户详细信息，包括余额和交易历史。

### 转账

1. 进入转账页面
2. 输入收款人地址和金额
3. 审核交易详情并确认
4. 输入密码授权转账
5. 查看交易状态和确认

### 投票

1. 导航到投票页面
2. 浏览受托人列表
3. 选择要投票的受托人（最多 33 个）
4. 确认投票并输入密码
5. 在 "我的投票" 选项卡中查看已投票的受托人

### 资产管理

1. 从资产管理页面注册为资产发行商
2. 创建具有名称、描述和其他参数的新资产
3. 向您的账户发行资产
4. 将资产转移到其他地址
5. 查看资产交易历史

### 多重签名

1. 进入多重签名页面
2. 通过添加参与者和设置阈值创建新的多重签名账户
3. 执行需要多重签名的交易
4. 查看和管理待处理的多重签名交易

### 智能合约

1. 导航到智能合约页面
2. 通过上传合约代码部署新合约
3. 通过调用其方法与已部署的合约交互
4. 查看合约详情和交易历史

### DAO 治理

1. 进入 DAO 页面
2. 查看现有 DAO 提案
3. 为治理决策创建新提案
4. 使用您的 DDN 代币对提案进行投票

### 存证功能

1. 导航到存证页面
2. 通过上传文件或输入文本创建新证据
3. 通过输入证据 ID 验证现有证据
4. 查看证据详情和验证状态

## 技术栈

- **前端框架**：React + TypeScript
- **构建工具**：UmiJS
- **UI 组件库**：Ant Design
- **状态管理**：UmiJS Model
- **区块链交互**：DDN JS SDK
- **样式方案**：Less
- **图表库**：BizCharts

## 浏览器支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## 贡献指南

我们欢迎社区的贡献！您可以通过以下方式提供帮助：

1. **报告错误**：提交 issue 报告您遇到的任何错误或问题
2. **功能请求**：提出新功能或改进建议
3. **代码贡献**：提交包含错误修复或新功能的拉取请求
4. **文档改进**：改进我们的文档和指南

### 开发工作流程

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/your-feature`)
3. 进行更改
4. 提交更改 (`git commit -m 'Add some feature'`)
5. 推送到分支 (`git push origin feature/your-feature`)
6. 打开拉取请求

请阅读我们的 [贡献指南](CONTRIBUTING.md) 了解更多详情。

## 许可证

DDN Wallet 是开源软件，根据 [AGPL-3.0-or-later](LICENSE) 许可证授权。
