/**
 * 倒计时公用路由
 */
export default [
  { path: '1137/Detail', name: 'detail1137', component: resolve => require(['./Detail'], resolve) },
  { path: '1137/AddCountdown', name: 'addCountdown1137', component: resolve => require(['./AddCountdown'], resolve) },
  { path: '1137/SelectObject', name: 'selectObject1137', component: resolve => require(['./SelectObject'], resolve) }
]
