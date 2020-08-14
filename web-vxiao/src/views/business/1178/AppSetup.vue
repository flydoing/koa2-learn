<template>
  <Setup appType="'1178'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1178'))" slot="others">
      <item @click="caseSetting">
        <div slot="main">评估方案设置</div>
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
    caseSetting() {
      this.routePush({ name: 'caseSetting1178' })
    }
  }
}

</script>
