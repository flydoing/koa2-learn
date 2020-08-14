<template>
  <page :title="title">
    <template v-if="appAdmin">
      <item>
        <div slot="main">应用管理员</div>
      </item>
      <item @click="handleSettings">
        <div slot="main">应用设置</div>
      </item>
    </template>
    <div class="category-title text">报表</div>
    <item v-for="(item,i) in items" :key="i" :hasClick="item.clickAble" @click="handleReport(item)">
      <div slot="main">{{item.name}}</div>
      <div slot="remark">{{item.value}}</div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from '@/views/group/report/api'

export default {
  mixins: [R],
  props: {
    app: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    appAdmin() {
      // this.isAdmin || this.isAppAdmin(this.app)
      return true
    },
    title() {
      return `${this.app.name}报表`
    }
  },
  data() {
    return { items: [] }
  },
  created() {
    Api.loadReportList(this.currentGroup.groupId, this.app.type).then(res => {
      this.items = res.table.items
    })
  },
  methods: {
    handleSettings() {
      this.routePush({
        name: 'commendAppSettings'
      })
    },
    handleReport(item) {
      this.routePush({
        path: `/vx/group/business/report/detail/${this.currentGroup.groupId}`,
        query: {
          appType: this.app.type,
          fromUserId: this.userId,
          appName: this.app.name,
          ...item.params
        }
      })
    }
  }
}

</script>
