export default [
  { path: '1002/studentList', component: resolve => require(['./StudentList'], resolve), name: 'studentList1002' },
  { path: '1002/gradeTable', component: resolve => require(['./GradeTable'], resolve), name: 'gradeTable1002' },
  { path: '1002/onlineAnswerDetail', component: resolve => require(['./OnlineAnswerDetail'], resolve), name: 'onlineAnswerDetail1002' },
  { path: '1002/childrenList', component: resolve => require(['./ChildrenList'], resolve), name: 'childrenList1002' }, 
  { path: '1002/studentScoreList', component: resolve => require(['./StudentScoreList'], resolve), name: 'studentScoreList1002' },
  { path: '1002/batchComment', component: resolve => require(['./StudentScoreBatchComment'], resolve), name: 'batchComment1002' },
  { path: '1002/redoStudents', component: resolve => require(['./RedoStudents'], resolve), name: 'redoStudents1002' },
  { path: '1002/homeworkSetting', component: resolve => require(['./HomeworkSettings'], resolve), name: 'homeworkSetting' },
  { path: '1002/scoreTypeGrade', component: resolve => require(['../1067/ScoreTypeGrade'], resolve), name: 'scoreTypeGrade1067' },
  { path: '1002/selectSubject', component: resolve => require(['./SelectSubject'], resolve), name: 'selectSubject1002' },
  { path: '1002/selectcatalogue', component: resolve => require(['./SelectCatalogue'], resolve), name: 'selectcatalogue1002' },
  { path: '1002/answersEdit', component: resolve => require(['./AnswersEdit'], resolve), name: 'answersEdit1002' }
]
