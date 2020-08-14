/**
 * 群公用处理逻辑
 */
import Check from '@/utils/check'
import Str from '@/utils/string'
import GroupEnum from '@/constant/group'
import MixinSearch from './mixinSearch'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  mixins: [MixinSearch],
  data() {
    return { groupId: '' }
  },
  computed: {
    ...mapState({
      userId: state => state.USERID || 0,
      clientId: state => state.CLIENTID
    }),
    ...mapGetters({
      userInfo: 'getSigninUser',
      currentGroupId: 'getGroupId'
    }),
    ...mapGetters([
      'getCurrentApp', // 获取当前应用App
      'getCurrentGroup', // 获取当前群
      'getCurrentRelationById', // 获取当前群的对应关系
      'getGroupUsers',
      'getGroupById',
      'getSchoolBySchoolId',
      'getGroupId',
      'getAppByType',
      'getRelationById',
      'getBranchId',
      'getEducationId',
      'isGroupAdmin'
    ]),
    currentGroup() {
      return this.getGroupById(this.groupId) || this.getCurrentGroup || {}
    },
    currentApp() {
      return this.getCurrentApp
    },
    groupUsers() {
      return this.getGroupUsers(this.groupId) || []
    },
    userRelation() {
      return this.getCurrentRelationById(this.groupId) || {}
    },
    schoolId() {
      return this.currentGroup.parentId
    },
    admins() {
      let users = this.groupUsers
      if (Check.isRealArray(users)) {
        return users.filter(u => {
          return u.type === '1'
        })
      }
      return []
    },
    isExistRelation() {
      return !Check.isNullObject(this.userRelation)
    },
    isOrdinary() {
      return this.currentGroup.type === GroupEnum.ORDINARY
    },
    isClass() {
      return this.currentGroup.type === GroupEnum.CLASS
    },
    isCourse() {
      return this.currentGroup.type === GroupEnum.COURSE
    },
    isSubjectNetwork() {
      let school = this.getSchoolBySchoolId(this.currentGroup.parentId) || {}
      return school.orgType === GroupEnum.COURSE_
    },
    isSchool() {
      if (!this.currentGroup.hasOwnProperty('orgType')) {
        return false
      }
      if (this.currentGroup.type !== GroupEnum.SCHOOL) {
        return false
      }
      let orgType = this.currentGroup.orgType
      return orgType.length <= 5 && orgType.length > 0
    },
    isEnterprise() {
      // 企业
      if (!this.currentGroup.hasOwnProperty('orgType')) {
        return false
      }
      if (this.currentGroup.type !== GroupEnum.SCHOOL) {
        return false
      }
      return this.currentGroup.orgType === GroupEnum.COMPANY
    },
    isEducation() {
      // 教育局
      if (!this.currentGroup.hasOwnProperty('orgType')) {
        return false
      }
      return this.currentGroup.orgType === GroupEnum.EDUCATION
    },
    isEducationGroup() {
      // 教育集团
      if (!this.currentGroup.hasOwnProperty('orgType')) {
        return false
      }
      return this.currentGroup.orgType === GroupEnum.GROUP_
    },
    isOrg() {
      return this.currentGroup.type === GroupEnum.SCHOOL
    },
    isTeacher() {
      return this.isExistRelation && this.userRelation.userType === '2'
    },
    isParent() {
      return this.isExistRelation && this.userRelation.userType === '3'
    },
    isAdmin() {
      return this.isExistRelation && this.isGroupAdmin(this.currentGroup.groupId)
    },
    isSuperAdmin() {
      let group = this.getSchoolBySchoolId(this.currentGroup.parentId)
      if (group) {
        return this.isGroupAdmin(this.currentGroup.groupId)
      }
      return false
    }
  },
  methods: {
    // modifyMessage 更新云端消息，同时需要更新本地消息（例如：本地置顶、点赞、评论等等）
    // modifyChannelMessage 不需要走云端的消息，更新本地UI
    ...mapActions(['modifyMessage', 'modifyChannelMessage']),
    constructionMessage(params) {
      return Object.assign(
        {
          status: 1,
          fromUserId: this.userId,
          fromUserName: this.userInfo.name,
          fromUserAvatar: this.userInfo.avatar,
          fromClientId: this.clientId,
          refId: Str.uuid()
        },
        params
      )
    },
    /**
     * 验证是否应用管理员
     * @param  {[type]}  app [description]
     * @return {Boolean}     [description]
     */
    isAppAdmin(type) {
      let app = this.getAppByType(type, this.groupId) || {}
      if (app.relation) {
        return app.relation.isAdmin === 1
      }
      return false
    }
  },
  created() {
    this.groupId = this.routeParam('branchId') || this.routeParam('educationId') || this.getBranchId || this.getEducationId || this.getGroupId
  },
  watch: {
    currentGroupId(v) {
      // groupId 不使用计算属性，是为了多层级的群组
      this.groupId = v
    }
  }
}
