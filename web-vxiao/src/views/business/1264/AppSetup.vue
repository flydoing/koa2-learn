<template>
  <Setup appType="'1264'">
    <template slot="others">
      <item @click="medalSetting">
        <div slot="main">应用设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'
import CardMixin from '@/views/components/card/mixin'
import { mapActions } from 'vuex'
export default {
  mixins: [R, CardMixin],
  props: {
    message: { type: [Object] }
  },
  // 引入头部，应用提醒和新建权限
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  methods: {
    ...mapActions(['modifyMetaData']),
    isSwitched(meta) {
      return meta ? meta.obj === '1' : false
    },
    medalSetting() {
      this.routePush({
        name: 'medalSetting1264'
      })
    },

    handlePrint() {
      this.openBrowser(`/rest/webpage/index?path=rcd-print&name=assess&groupId=${this.currentGroup.groupId}`)
    }
  }
}
</script>
