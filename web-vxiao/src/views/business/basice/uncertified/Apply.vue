<template>
  <Page title="申请加入"
        :hasClose="false"
        hasSubmit
        @submit="onSubmit">
    <ClassUser :user.sync="user"
               @new="onAdd" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import UserEnum from '@/constant/user'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      ClassUser: resolve => require(['@/views/group/user/AddClassUser'], resolve)
    },
    data() {
      return {
        user: {} // 班级
      }
    },
    computed: {},
    created() {
      this.onAdd()
    },
    methods: {
      ...mapActions(['addGroupUsers']),
      onAdd(student) {
        let _student = {
          birthDay: '',
          groupId: this.routeQuery('groupId'),
          name: '',
          sex: '1',
          userType: UserEnum.STUDENT.key
        }
        if (student) {
          this.user.userRelations.push(_student)
        } else {
          this.user = {
            name: '',
            mobile: '',
            groupId: this.routeQuery('groupId'),
            birthDay: '',
            sex: '1',
            metaDatas: [],
            userType: UserEnum.PARENT.key,
            userRelations: [_student]
          }
        }
      },
      onSubmit() {
        let _u = { ...this.user }
        // 管理员给学生添加家长时，手机号改为选填（配合家长人脸录入）
        if (_u.userType === '3') {
          if (Check.isNullString(_u.name)) {
            this.$message({ type: 'warning', message: '姓名不能为空' })
            return true
          }
        } else {
          if (Check.isNullString(_u.name) || Check.isNullString(_u.mobile)) {
            this.$message({ type: 'warning', message: '姓名、手机号码不能为空' })
            return true
          }
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
        this.addGroupUsers({ relations: [_u] }).then(res => {
          this.user = {}
          this.onAdd()
          this.$message({ type: 'success', message: '添加成功' })
          this.routeBack()
        })
      }
    }
  }
</script>
