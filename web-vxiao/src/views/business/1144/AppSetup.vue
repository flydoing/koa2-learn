<template>
  <Setup appType="'1144'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1144'))" slot="others">
      <item @click="medalSetting">
        <div slot="main">奖章设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  created() {},
  computed: {},
  methods: {
    medalSetting() {
      this.routePush({ name: 'medalSetting1144' })
    }
  }
}

</script>
