/**
 * 群类型
 */
export default {
  ORDINARY: '1', // 普通小组
  CLASS: '2', //  班级
  GRADE: '3', //  年级
  CAMPUS: '4', // 校区
  SCHOOL: '5', // 学校
  USCHOOL: '7', // 大学课程
  SUBSCRIBE: '8', // 订阅号（旧版，在群组中展示）
  SUBSCRIBE_IMP: '9', // 订阅号（旧版，在订阅号模块中展示）
  TEAM: '18', // 群组小面的小组
  COURSE: '23', // 课程,

  KINDERGARTEN: '1', // 幼儿园
  PRIMARY: '10', // 小学
  MIDDLE: '100', // 初中
  HIGH: '1000', // 高中
  UNIVERSITY: '10000', // 大学
  EDUCATION: '100000', // 教育局
  TRAIN: '1000000', // 培训机构
  COMPANY: '10000000', // 企业
  CDC: '100000000', // 疾控中心
  COURSE_: '200000000', // 学科网群类型区分
  GROUP_: '300000000',
  getKeyName(key) {
    switch (key) {
      case '1':
        return '幼儿园'
      case '10':
        return '小学'
      case '100':
        return '初中'
      case '1000':
        return '高中'
      case '10000':
        return '大学'
      case '100000':
        return '教育局'
      case '1000000':
        return '培训机构'
      case '10000000':
        return '企业'
      case '100000000':
        return '疾控中心'
      case '200000000':
        return '资源平台'
    }
  }
}
