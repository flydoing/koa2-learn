<template>
  <Page title="添加家长"
        hasSubmit
        @submit="onSubmit">
    <Item label="学生姓名"
          :remark='student.name'
          :hasClick="false" />
    <Item label="家长身份"
          :hasClick="false">
      <el-radio-group slot="remark"
                      v-model="user.remark">
        <el-radio :label="r.name"
                  v-for="r in roles"
                  :key='r.id'>{{r.name}}</el-radio>
      </el-radio-group>
    </Item>
    <Item :hasClick="false"
          label="手机号码">
      <input slot="remark"
             placeholder="必填"
             v-model="user.mobile"
             maxlength="11" />
    </Item>
    <div class="category-title" />
    <Item :hasClick="false"
          label="学生生日"
          :remark="student.birthday" />
    <Item :hasClick="false"
          label="学生性别"
          :remark="student.sex === '2' ? '女' : '男'" />
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import UserEnum from '@/constant/user'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        student: {},
        roles: [],
        user: { remark: '', mobile: '', name: '', userType: '3', userRelations: [] }
      }
    },
    created() {
      this.student = this.getStorage('_cache_student') || {}
      this.user = {
        groupId: this.groupId,
        userType: UserEnum.PARENT.key,
        userRelations: [this.student]
      }
      CategoryApi.getCategorys({ type: '172' }).then(res => {
        this.roles = res.categorys
      })
    },
    methods: {
      ...mapActions(['addGroupUsers']),
      onSubmit() {
        if (Check.isNullString(this.user.mobile) || this.user.mobile.length < 11) {
          this.$message({ type: 'warning', message: '手机号码不正确' })
        }
        this.addGroupUsers({ relations: [this.user] }).then(res => {
          this.routeBack()
          this.$message({ type: 'success', message: '添加成功' })
        })
      }
    },
    watch: {
      'user.remark'(v) {
        this.$set(this.user, 'name', `${this.student.name}${v}`)
      }
    }
  }
</script>
