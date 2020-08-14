/**
 * 会议公用路由
 */
export default [
  { path: '1293/selectMember', name: 'selectMember1293', component: resolve => require(['./SelectMember'], resolve) },
  { path: '1293/meetingAudience', name: 'meetingAudience1293', component: resolve => require(['./MeetingAudience'], resolve), meta: { span: 14 } }
]
