declare module '@ddn/js-sdk' {
  export namespace crypto {
    function getKeys(phaseKey: string): {
      publicKey: string;
      privateKey: string;
    };
    function generateAddress(publicKey: string, prefix?: string): string;
    function signTransaction(transaction: any, secret: string): any;
  }

  export namespace dao {
    function createOrg(orgData: any, secret: string): any;
    function createExchange(orgId: string | null, exchangeData: any, secret: string): any;
    function createContribution(contributionData: any, secret: string): any;
    function createConfirmation(amount: string, confirmationData: any, secret: string): any;
  }

  export namespace utils {
    const assetTypes: Record<string, number>;
  }

  export namespace constants {
    const nethash: string;
  }

  export default {
    crypto,
    dao,
    utils,
    constants
  };
}

declare module 'bip39' {
  export function validateMnemonic(mnemonic: string): boolean;
  export function generateMnemonic(strength?: number): string;
  export default {
    validateMnemonic,
    generateMnemonic,
  };
}

declare namespace API {
  interface CurrentUser {
    name: string;
    address: string;
    publicKey: string;
    access: 'user' | 'admin' | undefined;
    balance?: number;
    lock_height?: number;
  }

  interface LoginParams {
    phaseKey: string;
    autoLogin?: boolean;
  }

  interface InitialState {
    name: string;
    currentUser?: CurrentUser;
    fetchUserInfo?: () => Promise<CurrentUser | undefined>;
  }
}
