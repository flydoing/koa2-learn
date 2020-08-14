export default [{
  path: '1208/teacherDetail',
  component: resolve => require(['./detail/TeacherReview'], resolve),
  name: 'teacherDetail1208'
}, {
  path: '1208/ranking',
  component: resolve => require(['./detail/Ranking'], resolve),
  name: 'onlineRanking1208'
}, {
  path: '1208/correctRate',
  component: resolve => require(['./detail/CorrectRate'], resolve),
  name: 'CorrectRate1208'
}, {
  path: '1208/studentReview',
  component: resolve => require(['./detail/StudentReview'], resolve),
  name: 'studentReview1208'
}, {
  path: '1208/studentReply',
  component: resolve => require(['./detail/StudentReply'], resolve),
  name: 'studentReply1208'
}, {
  path: '1208/studentUnderLineReply',
  component: resolve => require(['./detail/UnderLineReply'], resolve),
  name: 'studentUnderLineReply1208'
}]
