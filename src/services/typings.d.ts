declare namespace API {
  type CurrentUser = {
    name?: string;
    address?: string;
    publicKey?: string;
    access?: 'user' | 'admin';
  };

  type LoginParams = {
    phaseKey: string;
    autoLogin?: boolean;
  };

  type RegisterParams = {
    phaseKey: string;
    confirmPhaseKey: string;
  };

  type AccountInfo = {
    address: string;
    balance: number;
    secondPublicKey: string;
    lockHeight: number;
    publicKey: string;
  };

  type TransactionItem = {
    id: string;
    height: number;
    blockId: string;
    type: number;
    timestamp: number;
    senderPublicKey: string;
    senderId: string;
    recipientId: string;
    amount: number;
    fee: number;
    signature: string;
    signSignature?: string;
    asset?: any;
    confirmations: number;
  };

  type TransactionList = {
    list: TransactionItem[];
    pagination: {
      total: number;
      pageSize: number;
      current: number;
    };
  };

  type BlockInfo = {
    height: number;
    id: string;
    timestamp: number;
    generatorPublicKey: string;
    generatorId: string;
    previousBlock: string;
    numberOfTransactions: number;
    totalAmount: number;
    totalFee: number;
    reward: number;
    payloadLength: number;
    payloadHash: string;
    version: number;
    blockSignature: string;
  };

  type PeerInfo = {
    version: {
      version: string;
      build: string;
      net: string;
    };
  };

  type DelegateInfo = {
    username: string;
    address: string;
    publicKey: string;
    vote: number;
    producedblocks: number;
    missedblocks: number;
    rate: number;
    approval: number;
    productivity: number;
  };

  type VoterInfo = {
    username: string;
    address: string;
    publicKey: string;
    balance: number;
  };

  type AssetInfo = {
    name: string;
    desc: string;
    maximum: string;
    precision: number;
    quantity: string;
    issuerId: string;
    height: number;
    acl: number;
    aclStrategy: number;
    writeoff?: number;
    allow_whitelist?: string;
    allow_blacklist?: string;
    allow_writeoff?: string;
    strategy?: string;
    currency?: string;
  };

  type IssuerInfo = {
    name: string;
    desc: string;
    issuerId: string;
  };

  type AssetBalance = {
    currency: string;
    balance: string;
    maximum: string;
    precision: number;
    quantity: string;
    writeoff: number;
  };

  type AobTransactionInfo = {
    id: string;
    height: string;
    blockId: string;
    type: number;
    timestamp: number;
    senderPublicKey: string;
    senderId: string;
    recipientId: string;
    amount: string;
    fee: string;
    signature: string;
    signSignature?: string;
    signatures?: string[];
    confirmations: string;
    asset: {
      aobIssuer?: {
        transactionId: string;
        name: string;
        desc: string;
      };
      aobAsset?: {
        transactionId: string;
        name: string;
        desc: string;
        maximum: string;
        precision: number;
        quantity: string;
      };
      aobFlags?: {
        transactionId: string;
        currency: string;
        flagType: number;
        flag: number;
      };
      aobAcl?: {
        transactionId: string;
        currency: string;
        operator: string;
        flag: string;
        list: string[];
      };
      aobIssue?: {
        transactionId: string;
        currency: string;
        amount: string;
        amountShow?: string;
      };
      aobTransfer?: {
        transactionId: string;
        currency: string;
        amount: string;
        amountShow?: string;
      };
    };
    t_id: string;
  };

  type ContactInfo = {
    address: string;
    name: string;
    desc?: string;
  };

  type MultiSignatureAccount = {
    min: number;
    lifetime: number;
    keysgroup: string[];
    address: string;
    publicKey: string;
  };

  type ErrorResponse = {
    success: boolean;
    error: string;
  };

  type SuccessResponse<T> = {
    success: true;
    data: T;
  };

  type Response<T> = SuccessResponse<T> | ErrorResponse;
}
