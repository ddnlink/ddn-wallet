// src/access.ts
export default function accessFactory(initialState: any) {

  const user = initialState?.currentUser;
  if (!user) {
    return {
      isGuest: true,
    }
  }

  // 后台返回当前用户的权限列表 user.permissions ,下面的方法返回具体某个资源的某个操作权限
  function hasPermissions(resource: string | number, action: string){
    return user.permissions[resource].include(action) || false
  }

  /**
   * 下面的权限分为路由级别和页面级别
   */
  return {
    // 路由级别
    isGuest: false,
    isSystemAdmin: user.role === 'system_admin', // 系统管理员
    isAdmin: user.role === 'admin', // 项目管理员
    isLogined: user.role === 'user' || user.role === 'admin' || user.role === 'system_admin',

    // 页面级别
    canDelete: (item: any) => {
      return item.userId === user.id || user.role === 'admin';
    },

    // 系统管理员肯定有权限
    can: (item: any, action: string) => {
      return user.role === 'system_admin' || hasPermissions(item, action);
    }
  };
}
