<template>
  <Page title="我的身份"
        hasSubmit
        :loading="loading"
        @submit="handleSubmit">
    <ClassUser :user.sync="user"
               @new="handleAdd" />
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import UserEnum from '@/constant/user'
  import { mapActions } from 'vuex'
  export default {
    components: {
      ClassUser: resolve => require(['../user/AddClassUser'], resolve)
    },
    data() {
      return {
        user: {}, // 班级
        loading: false
      }
    },
    created() {
      this.handleAdd()
    },
    methods: {
      ...mapActions(['addGroup', 'modifyBranchId', 'currentGroupId', 'loadGroupUsers']),
      handleAdd(student) {
        let _u = {
          name: this.USER.name,
          mobile: this.USER.mobile,
          userType: '2',
          birthDay: this.user.birthDay,
          sex: '1'
        }
        let _student = {
          birthDay: '',
          groupId: this.groupId,
          name: '',
          sex: '1',
          userType: UserEnum.STUDENT.key
        }
        if (student) {
          this.user.userRelations.push(_student)
        } else {
          this.user = { ..._u, metaDatas: [], userType: UserEnum.TEACHER.key, userRelations: [_student] }
        }
      },
      handleSubmit() {
        let _u = {
          groups: [this.getStorage('_cache_class')],
          ...this.user
        }
        if (Check.isNullString(_u.name) || Check.isNullString(_u.mobile)) {
          this.$message({ type: 'warning', message: '姓名、手机号码不能为空' })
          return true
        }
        if (_u.userType === UserEnum.TEACHER.key || _u.userType === UserEnum.STUDENT.key) {
          delete _u.userRelations
        } else if (_u.userType === UserEnum.PARENT.key) {
          let students = _u.userRelations.filter(s => {
            return !Check.isNullString(s.name)
          })
          if (!Check.isRealArray(students)) {
            this.$mesasge({ type: 'warning', message: '学生姓名不能为空' })
            return
          }
          _u.userRelations = students
        }
        this.loading = true
        this.addGroup(_u)
          .then(res => {
            this.$message({ type: 'success', message: '添加成功' })
            this.loading = false
            this.routeBack(-3)
            let groupId = res.groups[0].groupId
            this.currentGroupId(groupId)
            this.loadGroupUsers(groupId)
            this.routeReplace({ path: `/vx` })
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
</script>
