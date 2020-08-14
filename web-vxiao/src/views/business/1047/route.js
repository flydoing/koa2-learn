export default [
  {
    path: '1047/teacherDetail',
    component: resolve => require(['./detail/TeacherDetail'], resolve),
    name: 'teacherDetail1047'
  },
  {
    path: '1047/replyRanking',
    component: resolve => require(['./detail/ReplyRanking'], resolve),
    name: 'replyRanking1047'
  },
  {
    path: '1047/praxiAnaly',
    component: resolve => require(['./detail/Analysis'], resolve),
    name: 'praxiAnaly1047'
  },
  {
    path: '1047/answerUsers',
    component: resolve => require(['./detail/AnswerUsers'], resolve),
    name: 'answerUsers1047'
  },
  {
    path: '1047/quetionCorrect',
    component: resolve => require(['./detail/QuetionCorrect'], resolve),
    name: 'quetionCorrect1047'
  },
  {
    path: '1047/studentCommitAnswer',
    component: resolve => require(['./detail/StudentCommitAnswer'], resolve),
    name: 'studentCommitAnswer1047'
  },
  {
    path: '1047/studentReview',
    component: resolve => require(['./detail/StudentReview'], resolve),
    name: 'studentReview1047'
  },
  {
    path: '1047/praxisCatalogues',
    component: resolve => require(['./PraxisCatalogues'], resolve),
    name: 'praxisCatalogues1047'
  },
  {
    path: '1047/modifyAnswer',
    component: resolve => require(['./ModifyAnswer'], resolve),
    name: 'modifyAnswer1047'
  },
  {
    path: '1047/draftList',
    component: resolve => require(['./DraftList'], resolve),
    name: 'draftList1047'
  }
]
