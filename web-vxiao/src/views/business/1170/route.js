/**
 * 督导评估公用路由
 */
export default [
  { path: '1170/SchoolGrouping', name: 'schoolGrouping1170', component: resolve => require(['./SchoolGrouping'], resolve) },
  { path: '1170/GroupingEdit', name: 'groupingEdit1170', component: resolve => require(['./GroupingEdit'], resolve) },
  { path: '1170/SelectSchool', name: 'selectSchool1170', component: resolve => require(['./SelectSchool'], resolve) },
  { path: '1170/GroupingAssessor', name: 'groupingAssessor1170', component: resolve => require(['./GroupingAssessor'], resolve) },
  { path: '1170/AssessorEdit', name: 'assessorEdit1170', component: resolve => require(['./AssessorEdit'], resolve) },
  { path: '1170/SelectMember', name: 'selectMember1170', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1170/AppraisalProject', name: 'appraisalProject1170', component: resolve => require(['./AppraisalProject'], resolve) },
  { path: '1170/ProjectEdit', name: 'projectEdit1170', component: resolve => require(['./ProjectEdit'], resolve) }
]
