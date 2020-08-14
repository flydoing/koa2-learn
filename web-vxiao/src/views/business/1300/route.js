/**
 * 招生公用路由
 */
export default [
  { path: '1300/caseEdit', component: resolve => require(['./CaseEdit'], resolve), meta: { keepAlive: true } },
  { path: '1300/signStep/itemEdit', component: resolve => require(['./signStep/ItemEdit'], resolve) },
  { path: '1300/questionEdit', component: resolve => require(['./QuestionEdit'], resolve) },
  { path: '1300/selectCase', component: resolve => require(['./SelectCase'], resolve) },
  { path: '1300/contentEdit', component: resolve => require(['./ContentEdit'], resolve) },
  { path: '1300/result/index', component: resolve => require(['./result/Index'], resolve) },
  { path: '1300/result/members', component: resolve => require(['./result/Members'], resolve) },
  { path: '1300/appraise/index', component: resolve => require(['./appraise/Index'], resolve), meta: { keepAlive: true } },
  { path: '1300/appraise/detail', component: resolve => require(['./appraise/Detail'], resolve) },
  { path: '1300/appraise/distribute', component: resolve => require(['./appraise/Distribute'], resolve) },
  { path: '1300/detail', component: resolve => require(['./Detail'], resolve) }
]
