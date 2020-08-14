export default [
  {
    path: '1157/bigRecord',
    component: resolve => require(['./AppDetail'], resolve),
    name: 'bigRecordChilren1157'
  },
  {
    path: '1157/detail/:msgId',
    component: resolve => require(['./CardDetail'], resolve),
    name: 'detail1157'
  }
]
