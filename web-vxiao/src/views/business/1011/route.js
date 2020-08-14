/**
 * 动态公用路由
 */
export default [
  { path: '1011/ColumnSetting', name: 'columnSetting1011', component: resolve => require(['./ColumnSetting'], resolve) },
  { path: '1011/ColumnEdit', name: 'columnEdit1011', component: resolve => require(['./ColumnEdit'], resolve) },
  { path: '1011/ColumnAdmin', name: 'columnAdmin1011', component: resolve => require(['./ColumnAdmin'], resolve) },
  { path: '1011/ColumnLink', name: 'columnLink1011', component: resolve => require(['./ColumnLink'], resolve) },
  { path: '1011/ColumnCover', name: 'columnCover1011', component: resolve => require(['./ColumnCover'], resolve) },
  { path: '1011/Detail', name: 'detail1011', component: resolve => require(['./Detail'], resolve) },
  { path: '1011/SelectGroup', name: 'selectGroup1011', component: resolve => require(['./SelectGroup'], resolve) },
  { path: '1011/SelectMember', name: 'selectMember1011', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1011/BannerSetting', name: 'bannerSetting1011', component: resolve => require(['./BannerSetting'], resolve) },
  { path: '1011/BannerEdit', name: 'bannerEdit1011', component: resolve => require(['./BannerEdit'], resolve) },
  { path: '1011/BannerDetail', name: 'bannerDetail1011', component: resolve => require(['./BannerDetail'], resolve) },
  { path: '1011/WechatSetting', name: 'wechatSetting1011', component: resolve => require(['./WechatSetting'], resolve) },
  { path: '1011/WechatAccount', name: 'wechatAccount1011', component: resolve => require(['./WechatAccount'], resolve) },
  { path: '1011/WechatMenu', name: 'wechatMenu1011', component: resolve => require(['./WechatMenu'], resolve) },
  { path: '1011/WechatMenuEdit', name: 'wechatMenuEdit1011', component: resolve => require(['./WechatMenuEdit'], resolve) }
]
