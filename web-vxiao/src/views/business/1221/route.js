export default [
  { path: '1221/setup', component: resolve => require(['./setup/List'], resolve), meta: { keepAlive: true } },
  { path: '1221/setup/detail', component: resolve => require(['./setup/Detail'], resolve), name: 'storageDetail' },
  { path: '1221/setup/box', component: resolve => require(['./setup/BoxDetail'], resolve), name: 'boxDetail' }, // 储物柜储物格编辑
  { path: '1221/setup/boxDetailEquipment', component: resolve => require(['./setup/BoxDetailEquipment'], resolve), name: 'BoxDetailEquipment' }, // 器材柜器材格格编辑
  { path: '1221/setup/class', component: resolve => require(['./setup/ClassDetail'], resolve), name: 'classDetail' },
  { path: '1221/setup/list', component: resolve => require(['./setup/StorageList'], resolve), name: 'storageList' },
  { path: '1221/setup/boxinfo', component: resolve => require(['./setup/BoxInfo'], resolve), name: 'boxInfo' }
]
