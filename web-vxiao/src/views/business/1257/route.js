/**
 * 接龙公用路由
 */
export default [
  { path: '1257/SelectWay', name: 'selectWay1257', component: resolve => require(['./SelectWay'], resolve) },
  { path: '1257/AddContent', name: 'addContent1257', component: resolve => require(['./AddContent'], resolve) },
  { path: '1257/AnswerQuestion', name: 'answerQuestion1257', component: resolve => require(['./AnswerQuestion'], resolve) },
  { path: '1257/Detail', name: 'detail1257', component: resolve => require(['./Detail'], resolve) }
]
