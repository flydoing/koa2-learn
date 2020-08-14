export default [
  {
    path: '1055/create',
    component: resolve => require(['./AppCreate'], resolve),
    name: 'applyCreate',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1055/applyDetail',
    component: resolve => require(['./ApplyDetail'], resolve),
    name: 'applyAppDetail',
    meta: {
      keepAlive: true
    }
  },
  {
    path: '1055/replyContent',
    component: resolve => require(['./ReplyContent'], resolve),
    name: 'applyReplyContent'
  },
  {
    path: '1055/praxisEdit',
    component: resolve => require(['./PraxisEdit'], resolve),
    name: 'applyPraxisEdit'
  },
  {
    path: '1055/addImage',
    component: resolve => require(['./AddImage'], resolve),
    name: 'applyAddImage'
  },
  {
    path: '1055/audit',
    component: resolve => require(['./Audit'], resolve),
    name: 'applyAudit'
  },
  {
    path: '1055/agreeInput',
    component: resolve => require(['./AgreeInput'], resolve),
    name: 'applyAgreeInput'
  },
  {
    path: '1055/verificationCode',
    component: resolve => require(['./VerificationCode'], resolve),
    name: 'applyVerificationCode'
  },
  {
    path: '1055/applyResult',
    component: resolve => require(['./ApplyResult'], resolve),
    name: 'applyResult'
  },
  {
    path: '1055/checkResult',
    component: resolve => require(['./CheckResult'], resolve),
    name: 'applyCheckResult'
  },
  {
    path: '1055/applyBrief',
    component: resolve => require(['./ApplyBrief'], resolve),
    name: 'applyBrief'
  },
  {
    path: '1055/checkStyleList',
    component: resolve => require(['./CheckStyleList'], resolve),
    name: 'checkStyleList1055App'
  },
  {
    path: '1055/applycantsList',
    component: resolve => require(['./ApplycantsList'], resolve),
    name: 'applycantsList1055App'
  },
  {
    path: '1055/applyenrolmentInfo',
    component: resolve => require(['./EnrolmentInfo'], resolve),
    name: 'applyenrolmentInfo1055'
  },
  {
    path: '1055/applyVisibleRange',
    component: resolve => require(['./VisibleRange'], resolve),
    name: 'applyVisibleRange1055'
  },
  {
    path: '1055/applyInfoList',
    component: resolve => require(['./setup/ApplyInfoList'], resolve),
    name: 'applyInfoList1055'
  },
  {
    path: '1055/applyInfoEdit',
    component: resolve => require(['./setup/ApplyInfoEdit'], resolve),
    name: 'applyInfoEdit1055'
  },
  {
    path: '1055/result',
    component: resolve => require(['./Result'], resolve),
    name: 'result1055'
  },
  {
    path: '1055/reviewSetting',
    component: resolve => require(['./reviewSetting.vue'], resolve),
    name: 'reviewSetting1055'
  },
  {
    path: '1055/sort',
    component: resolve => require(['./Sort.vue'], resolve),
    name: 'sort1055'
  },
  {
    path: '1055/inputTypeChoose',
    component: resolve => require(['./setup/InputTypeChoose.vue'], resolve),
    name: 'inputTypeChoose1055'
  },
  {
    path: '1055/Detail',
    component: resolve => require(['./setup/Detail.vue'], resolve),
    name: 'Detail1055'
  },
  {
    path: '1055/Add',
    component: resolve => require(['./setup/Add.vue'], resolve),
    name: 'Add1055'
  }
]
