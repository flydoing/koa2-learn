/**
 * 座位表公用路由
 */
export default [
  { path: 'seat', component: resolve => require(['./Index'], resolve) },
  { path: 'seat/edit', name: 'seatEdit', component: resolve => require(['./Edit'], resolve) },
  { path: 'seat/selectStudent', name: 'seatSelectStudent', component: resolve => require(['./SelectStudent'], resolve) },
  { path: 'seat/importView', name: 'seatImportView', component: resolve => require(['./ImportView'], resolve) }
]
