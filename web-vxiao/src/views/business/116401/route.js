/**
 * 排考子业务公用路由
 */
export default [
  { path: '116401/detail/:msgId', name: 'detail116401', component: resolve => require(['./Detail'], resolve) },
  { path: '116401/seatInfo', name: 'seatInfo116401', component: resolve => require(['./SeatInfo'], resolve) },
  { path: '116401/times', name: 'times116401', component: resolve => require(['./Times'], resolve) },
  { path: '116401/examPlaceInfo', name: 'examPlaceInfo116401', component: resolve => require(['./ExamPlaceInfo'], resolve) }
]
