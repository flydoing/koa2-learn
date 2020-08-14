/**
 * 选课公用路由
 */
export default [
  { path: '1138/setStep/selectExam', component: resolve => require(['./setStep/SelectExam'], resolve) },
  { path: '1138/detail', name: 'detail1138', component: resolve => require(['./Detail'], resolve) },
  { path: '1138/studentList', name: 'studentList1138', component: resolve => require(['./StudentList'], resolve) },
  { path: '1138/majorList', name: 'majorList1138', component: resolve => require(['./MajorList'], resolve) }
]
