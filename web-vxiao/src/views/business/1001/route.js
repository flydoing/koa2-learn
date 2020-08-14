/**
 * 审批公用路由
 */
export default [
  { path: '1001/selectApprover', name: 'selectApprover1001', component: resolve => require(['./SelectApprover'], resolve) },
  { path: '1001/appSettings', name: 'appSettings1001', component: resolve => require(['./AppSettings'], resolve) },
  { path: '1001/handlerSetting', name: 'handlerSetting1001', component: resolve => require(['./HandlerSetting'], resolve) },
  { path: '1001/formSetting', name: 'formSetting1001', component: resolve => require(['./FormSetting'], resolve) },
  { path: '1001/handlerEdit', name: 'handlerEdit1001', component: resolve => require(['./HandlerEdit'], resolve) },
  { path: '1001/formEdit', name: 'formEdit1001', component: resolve => require(['./FormEdit'], resolve) },
  { path: '1001/formItemEdit', name: 'formItemEdit1001', component: resolve => require(['./FormItemEdit'], resolve) },
  { path: '1001/selectMember', name: 'selectMember1001', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1001/selectFormType', name: 'selectFormType1001', component: resolve => require(['./SelectFormType'], resolve) },
  { path: '1001/selectHandler', name: 'selectHandler1001', component: resolve => require(['./SelectHandler'], resolve) },
  { path: '1001/approveResult', name: 'approveResult1001', component: resolve => require(['./ApproveResult'], resolve) },
  { path: '1001/approverEdit', name: 'approverEdit1001', component: resolve => require(['./ApproverEdit'], resolve) },
  { path: '1001/addRelation', name: 'addRelation1001', component: resolve => require(['./AddRelation'], resolve) },
  { path: '1001/selectOption', name: 'selectOption1001', component: resolve => require(['./SelectOption'], resolve) },
  { path: '1001/approveQrcode', name: 'approveQrcode1001', component: resolve => require(['./ApproveQrcode'], resolve) }
]
