<template>
  <Page title="报表">
    <div class="pd">
      <template v-if="appAdmin">
        <item @click="handleReportSetup">
          <div slot="main">报表设置</div>
        </item>
        <item @click="handleAppSetup">
          <div slot="main">应用设置</div>
        </item>
      </template>
      <div class="category-title text"></div>
      <item v-for="(item,i) in items" :key="i" :hasClick="item.clickAble" @click="handleReport(item)">
        <div slot="main">{{item.name}}</div>
        <div slot="remark">{{item.value}}</div>
      </item>
    </div>
  </Page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
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
      return this.isAdmin || this.isAppAdmin(this.app)
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
    handleReportSetup() {
      this.routePush({
        path: '/vx/group/business/report/setup',
        query: {
          groupId: this.currentGroup.groupId,
          appType: this.app.type
        }
      })
    },
    handleAppSetup() {
      this.routePush({
        path: '/vx/group/business/app/setup',
        query: {
          groupId: this.currentGroup.groupId,
          appType: this.app.type
        }
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
