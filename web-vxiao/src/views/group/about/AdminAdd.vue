<template>
  <SelectUser title="添加管理员" :users="users" :multiselect='true' @submit="handleSubmit" />
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import R from '../mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    computed: {
      us() {
        return this.getGroupUsers(this.groupId, '1_2_3').filter(r => {
          return r.type !== '1'
        }) || []
      }
    },
    data() {
      return {
        loading: false,
        users: []
      }
    },
    created() {
      if (this.isOrg) {
        Api.getGroupUsers(this.groupId).then(res => {
          this.users = res.relations || []
        })
      } else {
        this.users = this.us
      }
    },
    methods: {
      ...mapActions(['modifyRelation']),
      handleSubmit(checkList) {
        let relations = []
        checkList.forEach(r => {
          relations.push({
            id: !this.isOrg ? r.id : void 0,
            groupId: this.groupId,
            userId: r.userId,
            type: 1
          })
        })
        Api.addGroupRelation({
          relations: relations
        }).then(res => {
          if (Check.isRealArray(res.relations)) {
            res.relations.forEach(r => {
              this.modifyRelation(r)
            })
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.routeBack()
          }
        })
      }
    }
  }

</script>
