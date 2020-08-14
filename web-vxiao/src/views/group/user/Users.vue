<template>
  <SelectUser title="通讯录"
              :users="selectUsers"
              :multiselect='true'
              @submit="handleSubmit"
              :needValidate="true" />
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    computed: {
      selectUsers() {
        return this.getGroupUsers(this.groupId, '1_2_4') || []
      }
    },
    methods: {
      ...mapActions(['modifyRelation']),
      handleSubmit(ms) {
        const that = this
        this.$confirm(`确定删除选中成员?`, '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              Api.addGroupRelation({
                relations: ms.map(v => {
                  return { ...v, status: 'd' }
                })
              }).then(res => {
                done()
                instance.confirmButtonLoading = false
                if (Check.isRealArray(res.relations)) {
                  res.relations.forEach(r => {
                    that.modifyRelation(r)
                  })
                  that.$message({ type: 'success', message: '删除成功' })
                }
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
      }
    }
  }
</script>
