<template>
  <scroller :height="h">
    <div class='report-history-list'>
      <Item v-for="(t,i) in list"
            :key="i"
            @click="handleEvent(t)">
        <div>{{t.name}}</div>
        <div slot="remark">{{t.value}}</div>
      </Item>
    </div>
  </scroller>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import Cammand from '@/constant/cammand'
  export default {
    created() {
      this.fetchData()
      // 禁用iOS滚动条
      this.$web.postJsAction({
        type: Cammand.ACTION_SCROLL_ENABLE,
        content: 0
      })
    },
    data() {
      return {
        list: []
      }
    },
    computed: {},
    methods: {
      fetchData() {
        this.groupId = this.routeParam('groupId')
        this.appType = this.routeParam('appType')
        this.fromUserId = this.routeQuery('fromUserId') || 0
        Api.loadReportList(this.groupId, this.appType, this.fromUserId).then(res => {
          if (res.table && Check.isRealArray(res.table.items)) {
            this.list = res.table.items
          }
        })
        this.$web.postJsAction({
          type: Cammand.ACTION_TITLE,
          content: this.routeParam('appName') || '报表'
        })
      },
      handleEvent(t) {
        this.routePush({
          name: 'reportDetail',
          params: {
            groupId: this.groupId
          },
          query: {
            appType: this.appType,
            ...t.params
          }
        })
      }
    },
    mounted() {}
  }
</script>
