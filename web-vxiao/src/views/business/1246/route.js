/**
 * V屏公用路由
 */
export default [
  { path: '1246/setup/categorys', component: resolve => require(['./setup/Categorys'], resolve) },
  { path: '1246/setup/add', component: resolve => require(['./setup/Add'], resolve), meta: { keepAlive: true } },
  { path: '1246/setup/app', component: resolve => require(['./setup/App'], resolve) },
  { path: '1246/setup/bannar', component: resolve => require(['./setup/Bannar'], resolve) },
  { path: '1246/setup/detail', component: resolve => require(['./setup/Detail'], resolve) },
  { path: '1246/setup/manager', component: resolve => require(['./setup/Manager'], resolve) },
  { path: '1246/setup/templet', component: resolve => require(['./setup/Templet'], resolve) },
  { path: '1246/setup/bright', component: resolve => require(['./setup/Bright'], resolve) },
  { path: '1246/setup/close', component: resolve => require(['./setup/Close'], resolve) },
  { path: '1246/setup/custom', component: resolve => require(['./setup/Custom'], resolve) },
  { path: '1246/setup/pattern', component: resolve => require(['./setup/Pattern'], resolve) },
  { path: '1246/setup/sort', component: resolve => require(['./setup/Sort'], resolve), meta: { keepAlive: true } },
  { path: '1246/setup/select/category', component: resolve => require(['./setup/SelectCategory'], resolve) }
]
