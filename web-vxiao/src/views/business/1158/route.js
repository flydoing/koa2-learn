export default [
  { path: '1158/childrenMsgList', component: resolve => require(['./AppDetail'], resolve), name: 'childrenMsgList1158' },
  { path: '1158/cardDetail/:msgId', component: resolve => require(['./CardDetail'], resolve), name: 'cardDetail1158' },
  { path: '1158/selectObject', component: resolve => require(['./SelectObject'], resolve), name: 'selectObject1158' }
]
