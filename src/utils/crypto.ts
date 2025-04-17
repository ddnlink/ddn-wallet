import CryptoJS from 'crypto-js';

/**
 * 解密密钥库
 * @param keyStore 加密的密钥库对象
 * @param password 用户密码
 * @returns 解密后的助记词或私钥
 */
export function decryptKeystore(keyStore, password) {
  if (!keyStore || !keyStore.crypto) {
    throw new Error('Invalid keystore format');
  }
  
  try {
    // 从密钥库获取加密数据
    const { crypto } = keyStore;
    const { ciphertext, iv, salt, cipher } = crypto;
    
    // 从密码生成密钥
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 1000
    });
    
    // 解密
    const decrypted = CryptoJS.AES.decrypt(
      ciphertext,
      key,
      { 
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    // 转换为字符串
    const privateKey = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!privateKey) {
      throw new Error('Decryption failed');
    }
    
    return privateKey;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt keystore');
  }
}

/**
 * 加密密钥库
 * @param privateKey 私钥或助记词
 * @param password 用户密码
 * @param address 用户地址
 * @param publicKey 公钥
 * @returns 加密的密钥库对象
 */
export function encryptKeystore(privateKey, password, address, publicKey) {
  // 生成随机盐和IV
  const salt = CryptoJS.lib.WordArray.random(32).toString();
  const iv = CryptoJS.lib.WordArray.random(16).toString();
  
  // 从密码生成密钥
  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000
  });
  
  // 加密
  const ciphertext = CryptoJS.AES.encrypt(
    privateKey,
    key,
    { 
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString();
  
  // 创建密钥库对象
  return {
    version: 1,
    id: CryptoJS.lib.WordArray.random(16).toString(),
    address,
    publicKey,
    crypto: {
      cipher: 'aes-256-cbc',
      ciphertext,
      cipherparams: {
        iv
      },
      kdf: 'pbkdf2',
      kdfparams: {
        dklen: 32,
        salt,
        c: 1000,
        prf: 'hmac-sha256'
      },
      mac: CryptoJS.HmacSHA256(ciphertext, key).toString()
    }
  };
}