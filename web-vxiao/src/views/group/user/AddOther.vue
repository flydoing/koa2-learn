<template>
  <Page title="添加"
        hasSubmit
        @submit="submit">
    <ClassUser :user.sync="user"
               @new="handleAdd"
               v-for="(user,i) in users"
               :key="i">
      <div class="category-title"
           v-if="i<users.length-1"></div>
    </ClassUser>
  </Page>
</template>
<script>
  import { mapActions } from 'vuex'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import UserEnum from '@/constant/user'
  export default {
    mixins: [R],
    components: {
      ClassUser: resolve => require(['./AddClassUser'], resolve)
    },
    data() {
      return {
        users: []
      }
    },
    created() {
      let us = this.getStorage('_cache_add_users', true) || []
      us.forEach(u => {
        let _u = {
          name: u.name,
          mobile: u.mobile,
          userType: u.userType,
          type: u.type,
          sex: u.sex || '1',
          birthDay: u.birthDay || '',
          groupId: this.groupId,
          extension: u.groupId,
          userId: u.userId,
          metaDatas: [],
          userRelations: [
            {
              birthDay: '',
              groupId: this.groupId,
              name: '',
              sex: '1',
              userType: UserEnum.STUDENT.key
            }
          ]
        }
        this.users.push(_u)
      })
    },
    methods: {
      ...mapActions(['addGroupUsers']),
      submit() {
        let _us = []
        this.users.some(u => {
          let _u = { ...u }
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
          _us.push(_u)
        })
        this.addGroupUsers({ relations: _us }).then(res => {
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack(-2)
        })
      },
      handleAdd(type, u) {
        u.userRelations({
          birthDay: '',
          groupId: this.groupId,
          name: '',
          sex: '1',
          userType: UserEnum.STUDENT.key
        })
      }
    }
  }
</script>
