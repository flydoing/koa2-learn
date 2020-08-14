<template>
  <Page :title="title"
        :showTips="groups.length === 0">
    <Item v-for="(g,i) in groups"
          :key="i"
          @click="onGroup(g)">
      <div>{{g.title}}</div>
      <div slot="remark">{{g.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        groups: []
      }
    },
    created() {
      this.title = this.routeQuery('title') || '毕业班列表'
      let year = this.routeQuery('year')
      this.$http.get(`/base/group/graduated/${this.currentGroup.parentId}?year=${year}`).then(res => {
        this.groups = res.groups
      })
    },
    methods: {
      ...mapActions(['modifyBranchId']),
      onGroup(g) {
        if (!this.isAdmin) {
          this.$message({ type: 'warning', message: '只有管理员才能查看' })
        }
        this.modifyBranchId(g.groupId)
        this.routePush({
          name: 'groupBranch',
          params: {
            branchId: g.groupId
          }
        })
      }
    }
  }
</script>
