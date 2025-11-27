English | [简体中文](./README.zh-CN.md)

<h1 align="center">DDN Wallet</h1>

<p align="center">
  <a href="https://github.com/ddnlink/ddn-wallet">
    <img alt="DDN Wallet" src="./public/logo.svg" width="200" />
  </a>
</p>

<p align="center">
  A secure, feature-rich web wallet for the DDN blockchain ecosystem
</p>

<p align="center">
  <a href="https://github.com/ddnlink/ddn-wallet/actions"><img src="https://github.com/ddnlink/ddn-wallet/workflows/CI/badge.svg" alt="CI Status" /></a>
  <a href="https://github.com/ddnlink/ddn-wallet/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ddnlink/ddn-wallet" alt="License" /></a>
  <a href="https://github.com/ddnlink/ddn-wallet/releases"><img src="https://img.shields.io/github/v/release/ddnlink/ddn-wallet" alt="Release" /></a>
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Wallet](#running-the-wallet)
- [Usage Guide](#usage-guide)
  - [Account Management](#account-management)
  - [Transfer](#transfer)
  - [Voting](#voting)
  - [Asset Management](#asset-management)
  - [Multi-Signature](#multi-signature)
  - [Contracts](#contracts)
  - [DAO](#dao)
  - [Evidence](#evidence)
  - [DApp Integration](#dapp-integration)
- [Technical Stack](#technical-stack)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Overview

DDN Wallet is a comprehensive web-based wallet application for the DDN blockchain platform. It provides users with a secure and intuitive interface to manage their DDN assets, interact with smart contracts, participate in governance, and explore the blockchain ecosystem.

## Features

### 🧑‍💼 Account Management
- Create new DDN accounts with secure key generation
- Login using mnemonic phrases or private keys
- View account balances and transaction history
- Export account information for backup

### 💸 Transfer
- Send DDN tokens to other addresses
- Multi-step transfer process for enhanced security
- Real-time balance updates and transaction status

### 🗳️ Voting
- Vote for network delegates to participate in governance
- Register as a delegate to contribute to network consensus
- View delegate statistics and performance metrics

### 🏦 Asset Management
- Register as an asset issuer
- Create custom assets on the DDN blockchain
- Issue, transfer, and manage assets
- View asset transaction history

### 🔐 Multi-Signature
- Create multi-signature accounts for enhanced security
- Manage signature thresholds and participants
- Execute multi-signature transactions

### 📝 Contracts
- Deploy smart contracts to the DDN blockchain
- Interact with existing contracts
- View contract details and execution history

### 🤝 DAO
- Participate in decentralized autonomous organizations
- Create and manage DAO proposals
- Vote on DAO governance decisions

### 📄 Evidence
- Upload and verify digital evidence on the blockchain
- Create immutable records of documents and transactions
- Verify evidence authenticity

### 🚀 DApp Integration
- Access decentralized applications built on DDN
- Securely interact with DApps using your wallet

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DDN Wallet Frontend                      │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│ Account │ Transfer│  Vote   │ Assets  │ Contract│    DAO      │
└────┬────┴────┬────┴────┬────┴────┬────┴────┬────┴──────┬─────┘
     │         │         │         │         │           │
     └─────────┼─────────┼─────────┼─────────┼───────────┤
               │         │         │         │           │
┌──────────────▼─────────▼─────────▼─────────▼───────────▼────┐
│                      DDN JS SDK                              │
└──────────────┬───────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────┐
│                      DDN Blockchain                          │
└───────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ddnlink/ddn-wallet.git
cd ddn-wallet
```

2. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Configuration

The wallet can be configured by modifying the files in the `config/` directory:

- `config.ts`: Main application configuration
- `proxy.ts`: API proxy settings
- `routes.ts`: Application routing configuration

### Running the Wallet

Start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The wallet will be available at `http://localhost:8000`

### Building for Production

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Account Management

1. **Create Account**: Navigate to the User Registration page to create a new account using a mnemonic phrase.
2. **Login**: Use your mnemonic phrase or private key to log in to your account.
3. **View Account**: Access your account details, including balance and transaction history, from the Home page.

### Transfer

1. Go to the Transfer page
2. Enter the recipient address and amount
3. Review transaction details and confirm
4. Enter your password to authorize the transfer
5. View the transaction status and confirmation

### Voting

1. Navigate to the Vote page
2. Browse the list of delegates
3. Select delegates to vote for (up to 33)
4. Confirm your vote and enter your password
5. View your voted delegates in the "My Votes" tab

### Asset Management

1. Register as an asset issuer from the Assets page
2. Create a new asset with name, description, and other parameters
3. Issue assets to your account
4. Transfer assets to other addresses
5. View asset transaction history

### Multi-Signature

1. Go to the Multi-Signature page
2. Create a new multi-signature account by adding participants and setting a threshold
3. Execute transactions that require multiple signatures
4. View and manage pending multi-signature transactions

### Contracts

1. Navigate to the Contracts page
2. Deploy a new contract by uploading the contract code
3. Interact with deployed contracts by calling their methods
4. View contract details and transaction history

### DAO

1. Go to the DAO page
2. View existing DAO proposals
3. Create new proposals for governance decisions
4. Vote on proposals using your DDN tokens

### Evidence

1. Navigate to the Evidence page
2. Create new evidence by uploading files or entering text
3. Verify existing evidence by entering the evidence ID
4. View evidence details and verification status

## Technical Stack

- **Frontend Framework**: React + TypeScript
- **Build Tool**: UmiJS
- **UI Component Library**: Ant Design
- **State Management**: UmiJS Model
- **Blockchain Interaction**: DDN JS SDK
- **Styling**: Less
- **Charts**: BizCharts

## Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report Bugs**: Submit issues for any bugs or problems you encounter
2. **Feature Requests**: Suggest new features or improvements
3. **Code Contributions**: Submit pull requests with bug fixes or new features
4. **Documentation**: Improve our documentation and guides

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

DDN Wallet is open source software licensed under the [AGPL-3.0-or-later](LICENSE).
