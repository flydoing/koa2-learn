<template>
  <AppPage :title="app.name"
           :showTips="groups.length === 0"
           :loading="loading">
    <AppCommon :app="curApp"
               :hasTemplate="false"
               overWriteReportItem
               @report="onReport" />
    <div class="category-title"
         v-if="groups.length > 0"></div>
    <Item @click="onGroup(g)"
          v-for="g in groups"
          :key="g.groupId">
      <div>{{g.name}}</div>
    </Item>
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        loading: true,
        groups: []
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    methods: {
      fetchData() {
        GroupApi.getAppGroups(this.currentGroup.parentId, this.app.type)
          .then(res => {
            this.loading = false
            if (Check.isRealArray(res.groups)) {
              res.groups.map(v => {
                v.groups.map(g => {
                  this.groups.push(g)
                })
              })
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      onReport(reportItem) {
        let url = this.app.reportUrl.substring(0, this.app.reportUrl.indexOf('?'))
        this.openBrowser(
          url.splitJoin({
            userId: this.userId,
            groupId: this.groupId,
            ...(reportItem.params || {})
          })
        )
      },
      onGroup(g) {
        this.openBrowser(
          this.app.reportUrl.splitJoin({
            userId: this.userId,
            groupId: g.groupId
          })
        )
      }
    },
    mounted() {
      this.fetchData()
    },
    watch: {
      currentApp(v) {
        this.fetchData()
      }
    }
  }
</script>
