/**
 * 用户类型枚举
 */
export default class UserEnum {
  static keyCode(key = UserEnum.USER.key) {
    for (let t in UserEnum) {
      let element = UserEnum[t]
      if (element && element.hasOwnProperty('key') && element.key === key) {
        return element
      }
    }
    return UserEnum.USER
  }
}
UserEnum.SERVICE = { key: '0', label: '客服专员', UTitle: '客服信息' }
UserEnum.USER = { key: '1', label: '成员', UTitle: '个人信息' }
UserEnum.TEACHER = { key: '2', label: '老师', UTitle: '老师信息' }
UserEnum.PARENT = { key: '3', label: '家长', UTitle: '家长信息' }
UserEnum.STUDENT = { key: '4', label: '学生', UTitle: '学生信息' }
