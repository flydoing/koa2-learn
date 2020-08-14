<template>
  <page title="微信设置">
    <item @click="wechatAccount">
      <div slot="main">账号设置</div>
    </item>
    <item @click="wechatMenu">
      <div slot="main">同步菜单</div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  components: {},
  created() {},
  computed: {},
  methods: {
    wechatAccount() {
      this.routePush({ name: 'wechatAccount1011' })
    },
    wechatMenu() {
      this.routePush({ name: 'wechatMenu1011' })
    }
  }
}

</script>
