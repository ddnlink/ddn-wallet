/**
 * DAO相关工具函数
 */

/**
 * 生成随机组织ID
 * 格式: dao + 随机字符串(字母和数字)
 * 长度: 4-20位
 * @param {number} length 随机字符串长度，默认为10
 * @returns {string} 生成的组织ID
 */
export function generateOrgId(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'dao';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * 验证组织ID是否有效
 * @param {string} orgId 组织ID
 * @returns {boolean} 是否有效
 */
export function validateOrgId(orgId: string): boolean {
  // 长度检查：4-20位
  if (orgId.length < 4 || orgId.length > 20) {
    return false;
  }
  
  // 格式检查：只能包含字母和数字
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(orgId);
}
