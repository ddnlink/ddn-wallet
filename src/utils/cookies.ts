

function setCookie(cname: string, cvalue: string, exdays: number){
  const d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  const expires = `expires=${d.toGMTString()}`
  let domainpath = 'domain=.ddn.net; path=/'
  if(document.domain === 'localhost'){
    domainpath = 'domain=localhost; path=/'
  }
  if(document.domain === 'test.ddn.net'){
    domainpath = 'domain=.test.ddn.net; path=/'
  }
  document.cookie = `${cname}=${cvalue}; ${expires}; ${domainpath}`
}

function getCookie(cname: string){
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name)===0) { return c.substring(name.length,c.length); }
  }
  return "";
}

// 重新设置最安全
function clearCookie(){
  setCookie('user', JSON.stringify(''), 0)
}

export function setUser(data: any) {
  setCookie('user', JSON.stringify(data), 7)
}

export function getUser() {
 const user = getCookie('user')
 let userJson = {}
 if(user){
  userJson = JSON.parse(user) || {}
 }
 return userJson
}

export function clearUser() {
  clearCookie()
}
