declare module '@ddn/js-sdk' {
  export namespace crypto {
    function getKeys(phaseKey: string): {
      publicKey: string;
      privateKey: string;
    };
    function generateAddress(publicKey: string, prefix?: string): string;
  }

  export default {
    crypto,
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
