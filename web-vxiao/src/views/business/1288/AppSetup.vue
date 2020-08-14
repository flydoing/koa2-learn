<template>
  <Setup>
    <template slot="others">
      <div v-if=" isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1288'))">
        <item @click="bindingProject">
          <div slot="main">北电项目</div>
          <div slot="remark">{{hasBinding?'已绑定':'未绑定'}}</div>
        </item>
      </div>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  // import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        hasBinding: false, // 绑定状态
        projectCode: '' // 项目编号
      }
    },
    created() {
      this.getBindingProject()
    },
    computed: {},
    methods: {
      // 获取已绑定的项目
      getBindingProject() {
        let schoolId = this.schoolId
        Api.getBindingProject(schoolId).then(res => {
          console.log(res, 'res')
          if (res.projCode) {
            this.hasBinding = true
            this.projectCode = res.projCode
          }
        })
      },
      // 绑定项目
      bindingProject() {
        this.routePush({
          name: 'bindingProject1288',
          query: { projectCode: this.projectCode }
        })
      }
    }
  }
</script>
