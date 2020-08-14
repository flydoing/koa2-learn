<template>
  <page :title="praxis.title">
    <div slot="btn">
      <label @click="importRankingClick"
             v-if="!routeQuery('isRead')">导出</label>
    </div>
    <item v-for="(data, i) in praxis.datas"
          :hasClick="false"
          :key="i">
      <div slot="before">
        <img slot="avatar"
             class="avatar small"
             v-lazy="{src:url(data.avatar,'thumb'),error:Image.ICO_GROUP}"
             alt='avatar'>
      </div>
      <div slot="main">{{data.name}}</div>
      <div slot="remark">{{data.value}}</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import GroupMixin from '@/views/group/mixin'
  export default {
    mixins: [GroupMixin],
    data() {
      return {
        praxis: {}
      }
    },
    created() {
      Api.getTeacherRanking(this.routeQuery('msgId')).then(res => {
        this.praxis = res.praxis
      })
    },
    methods: {
      importRankingClick() {
        this.openBrowser(`/business/praxis/download/ranking/${this.routeQuery('msgId')}.json?userId=${this.userId}`)
      }
    }
  }
</script>
