// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? sessionStorage.getItem('ddn-wallet-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return sessionStorage.setItem('ddn-wallet-authority', JSON.stringify(proAuthority));
}

export function getKeyStore() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const keyStoreString = sessionStorage.getItem('keyStore');
  // authorityString could be admin, "admin", ["admin"]
  let keyStore;
  try {
    keyStore = JSON.parse(keyStoreString);
  } catch (e) {
    keyStore = {};
  }
  return keyStore;
}

export function setKeyStore(keyStore) {
  return sessionStorage.setItem('keyStore', JSON.stringify(keyStore));
}

export function setUser(data) {
  return sessionStorage.setItem('UserPassword', JSON.stringify(data));
}
export function getUser() {
  const keyStoreString = sessionStorage.getItem('UserPassword');
  // authorityString could be admin, "admin", ["admin"]
  let keyStore;
  try {
    keyStore = JSON.parse(keyStoreString);
  } catch (e) {
    keyStore = {};
  }
  return keyStore;
}
