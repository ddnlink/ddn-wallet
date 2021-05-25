
 2021.5.24 升级到 umi3 和 ant-design4
 ----------------------------------

## 升级文档

重点是 antd v3 -> v4 文档：

https://ant.design/docs/react/migration-v4-cn

https://ant.design/components/form/v3-cn/

https://pro.ant.design/docs/upgrade-umi3-cn

## 已经完成

- [x] 相关包和配置已经升级；
- [x] 使用 umi-request, 通过代理切换节点服务器；
- [x] 使用 umi-ui;
- [x] 使用 ts，但兼容 js 旧代码，逐步升级修改；
- [ ] 使用函数组件，简化代码量；

功能升级：

- [x] 登录 user/login 升级完成；
- [ ] 主页
- [ ] 签名；
- [ ] 多重签名；
- [ ] 转账；
- [ ] 智能合约；
- [ ] 投票；
- [ ] Dapp；

## 问题集锦

### 1. 权限控制 【进行中】

- [ ] 新版使用 access 组件，需要修改；
- [ ] 主页未登录状态，跳转不正确；

## 相关文件

这些文件是默认被脚本忽略的，可以使用兼容包 `@ant-design/compatible` 保持运行，但是建议手动修改升级。

他们是 form 不兼容：

 SKIP src/components/DescriptionList/Description.d.ts
 SKIP src/e2e/home.e2e.js
 SKIP src/defaultSettings.js
 SKIP src/components/DescriptionList/DescriptionList.js
 SKIP src/e2e/login.e2e.js
 SKIP src/components/DescriptionList/Description.js
 SKIP src/components/DescriptionList/index.d.ts
 SKIP src/components/DescriptionList/index.js
 SKIP src/components/DescriptionList/responsive.js
 SKIP src/components/SiderMenu/SiderMenu.js
 SKIP src/components/CountDown/index.d.ts
 SKIP src/components/SiderMenu/SiderMenu.test.js
 SKIP src/components/SiderMenu/index.js
 SKIP src/components/StandardFormRow/index.js
 SKIP src/components/CountDown/index.js
 SKIP src/components/SettingDrawer/ThemeColor.js
 SKIP src/components/SettingDrawer/BlockChecbox.js
 SKIP src/components/EditableItem/index.js
 SKIP src/layouts/BasicLayout.js
 SKIP src/layouts/BlankLayout.js
 SKIP src/components/EditableLinkGroup/index.js
 SKIP src/components/Ellipsis/index.d.ts
 SKIP src/layouts/Footer.js
 SKIP src/components/SettingDrawer/index.js
 SKIP src/components/TagSelect/TagSelectOption.d.ts
 SKIP src/layouts/Header.js
 SKIP src/layouts/MenuContext.js
 SKIP src/components/TagSelect/index.d.ts
 SKIP src/layouts/UserLayout.js
 SKIP src/components/Ellipsis/index.js
 SKIP src/components/Ellipsis/index.test.js
 SKIP src/components/Exception/index.d.ts
 SKIP src/components/TagSelect/index.js
 SKIP src/components/Exception/index.js
 SKIP src/components/Exception/typeConfig.js
 SKIP src/components/FooterToolbar/index.d.ts
 SKIP src/components/TopNavHeader/index.js
 SKIP src/components/Trend/index.d.ts
 SKIP src/components/FooterToolbar/index.js
 SKIP src/components/Trend/index.js
 SKIP src/components/_utils/pathTools.test.js
 SKIP src/components/GlobalFooter/index.d.ts
 SKIP src/components/_utils/pathTools.js
 SKIP src/components/GlobalFooter/index.js
 SKIP src/locales/en-US.js
 SKIP src/components/GlobalHeader/RightContent.js
 SKIP src/components/GlobalHeader/index.js
 SKIP src/pages/Assets/Assets.js
 SKIP src/components/HeaderSearch/index.d.ts
 SKIP src/pages/Dapp/Dapp.js
 SKIP src/pages/Exception/403.js
 SKIP src/pages/Dapp--back/Dapp.js
 SKIP src/components/LockModal/index.js
 SKIP src/pages/Exception/404.js
 SKIP src/pages/Exception/500.js
 SKIP src/locales/zh-CN.js
 SKIP src/pages/Exception/TriggerException.js
 SKIP src/components/HeaderSearch/index.js
 SKIP src/pages/Multi/MultiMember.js
 SKIP src/components/Login/LoginTab.js
 SKIP src/components/Login/LoginItem.js
 SKIP src/locales/pt-BR.js
 SKIP src/components/Login/LoginSubmit.js
 SKIP src/models/global.js
 SKIP src/components/Login/index.d.ts
 SKIP src/models/home.js
 SKIP src/models/login.js
 SKIP src/pages/Home/Home.js
 SKIP src/components/Login/index.js
 SKIP src/components/Login/loginContext.js
 SKIP src/models/assets.js
 SKIP src/components/Login/map.js
 SKIP src/components/NoticeIcon/NoticeIconTab.d.ts
 SKIP src/components/NoticeIcon/NoticeList.js
 SKIP src/models/setting.js
 SKIP src/components/NoticeIcon/index.d.ts
 SKIP src/models/transfer.js
 SKIP src/components/NoticeIcon/index.js
 SKIP src/models/vote.js
 SKIP src/components/NumberInfo/index.js
 SKIP src/components/NumberInfo/index.d.ts
 SKIP src/components/PageHeader/breadcrumb.d.ts
 SKIP src/models/user.js
 SKIP src/components/PageHeader/index.d.ts
 SKIP src/pages/Multi/CreateMultiAccount.js
 SKIP src/services/api.js
 SKIP src/pages/404.js
 SKIP src/services/error.js
 SKIP src/components/PageHeader/breadcrumb.js
 SKIP src/utils/Authorized.ts
 SKIP src/pages/Authorized.js
 SKIP src/utils/Yuan.ts
 SKIP src/utils/authority.test.ts
 SKIP src/components/PageHeader/index.js
 SKIP src/utils/authority.ts
 SKIP src/components/PageHeader/index.test.js
 SKIP src/components/PageHeaderWrapper/GridContent.js
 SKIP src/utils/request.ts
 SKIP src/components/PageHeaderWrapper/index.js
 SKIP src/pages/Multi/MultiSignature.js
 SKIP src/components/PageLoading/index.js
 SKIP src/components/Result/index.d.ts
 SKIP src/pages/Multi/OpenMultiModal.js
 SKIP src/components/Result/index.js
 SKIP src/pages/Result/Error.js
 SKIP src/components/SelectLang/index.js
 SKIP src/pages/Result/Success.js
 SKIP src/pages/Result/Success.test.js
 SKIP src/utils/utils.tsx
 SKIP src/components/SiderMenu/BaseMenu.js
Sending 33 files to free worker...
 SKIP src/utils/cookies.ts
 SKIP src/components/AvatarList/AvatarItem.d.ts
 SKIP src/components/AvatarList/index.d.ts
 SKIP src/components/Charts/ChartCard/index.js
 SKIP src/components/Charts/Field/index.d.ts
 SKIP src/components/Charts/Field/index.js
 SKIP src/components/ActiveChart/index.js
 SKIP src/pages/Signature/index.tsx
 SKIP src/pages/Signature/_mock.ts
 SKIP src/pages/Signature/service.ts
 SKIP src/components/AvatarList/index.js
 SKIP src/pages/Signature/model.ts
 SKIP src/components/Authorized/AuthorizedRoute.js
 SKIP src/components/Authorized/Authorized.js
 SKIP src/components/Charts/Gauge/index.js
 SKIP src/components/Charts/Gauge/index.d.ts
 SKIP src/components/Charts/MiniArea/index.d.ts
 SKIP src/components/Authorized/CheckPermissions.test.js
 SKIP src/pages/Transfer/Step1.js
 SKIP src/components/Charts/MiniArea/index.js
 SKIP src/components/Charts/MiniBar/index.d.ts
 SKIP src/components/Authorized/PromiseRender.js
 SKIP src/components/Charts/MiniBar/index.js
 SKIP src/components/Authorized/CheckPermissions.js
 SKIP src/pages/Transfer/Step2.js
 SKIP src/components/Charts/Pie/index.d.ts
 SKIP src/components/Charts/MiniProgress/index.js
 SKIP src/components/Authorized/index.d.ts
 SKIP src/components/Charts/MiniProgress/index.d.ts
 SKIP src/components/Authorized/Secured.js
 SKIP src/components/Authorized/index.js
 SKIP src/components/Authorized/renderAuthorize.js
 SKIP src/pages/Transfer/Step3.js
 SKIP src/components/Charts/autoHeight.js
 SKIP src/components/Charts/bizcharts.d.ts
 SKIP src/components/Charts/bizcharts.js
 SKIP src/components/Charts/g2.js
 SKIP src/pages/User/Login.js
 SKIP src/components/Charts/index.d.ts
 SKIP src/components/Charts/index.js
 SKIP src/components/Charts/Pie/index.js
 SKIP src/pages/User/Register.js
 SKIP src/pages/Transfer/index.js
 SKIP src/components/Charts/Radar/index.js
 SKIP src/components/Charts/Radar/index.d.ts
 SKIP src/components/Charts/TagCloud/index.d.ts
 SKIP src/pages/Vote/DelegateModal.js
 SKIP src/components/Charts/TagCloud/index.js
 SKIP src/pages/Vote/DelegateRegiste.js
 SKIP src/components/Charts/TimelineChart/index.d.ts
 SKIP src/components/Charts/TimelineChart/index.js
 SKIP src/components/Charts/WaterWave/index.d.ts
 SKIP src/pages/Vote/DelegatesList.js
 SKIP src/pages/Vote/Forging.js
 SKIP src/pages/Assets/components/AOBTransaction.js
 SKIP src/pages/Vote/Vote.js
 SKIP src/components/Charts/WaterWave/index.js
 SKIP src/pages/Vote/VoteList.js
 SKIP src/pages/Vote/VoteModal.js
 SKIP src/components/Charts/Bar/index.d.ts
 SKIP src/pages/Assets/components/RegisteredAsset.js
 SKIP src/components/Charts/Bar/index.js
 SKIP src/components/Charts/ChartCard/index.d.ts
 SKIP src/pages/Assets/components/RegisteredAssetDealerForm.js
 SKIP src/pages/Assets/components/IssueAssets.js
 SKIP src/pages/Exception/models/error.js
 SKIP src/pages/Assets/components/TransferAssets.js
 SKIP src/pages/Multi/models/multi.js
 SKIP src/pages/Signature/locales/pt-BR.ts
 SKIP src/pages/Signature/locales/en-US.ts
 SKIP src/pages/Signature/locales/zh-CN.ts
 SKIP src/pages/Signature/locales/zh-TW.ts
 SKIP src/pages/User/models/register.js
All done. 
Results: 
0 errors
0 unmodified
183 skipped
0 ok
