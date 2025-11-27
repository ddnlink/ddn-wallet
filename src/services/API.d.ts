declare namespace API {
  type CurrentUser = {
    address?: string;
    publicKey?: string;
    balance?: number;
    lock_height?: number;
    // 其他可能的字段...
  };
  
  // 其他类型定义...
}