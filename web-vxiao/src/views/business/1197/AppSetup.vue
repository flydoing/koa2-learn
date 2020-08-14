<template>
  <Setup>
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1197'))" slot="others">
      <item @click="timeSetting">
        <div slot="main">考勤时间</div>
      </item>
      <item @click="pathogenySetting">
        <div slot="main">病因设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  props: {},
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  methods: {
    timeSetting() {
      this.routePush({ name: 'timeSetting1197' })
    },
    pathogenySetting() {
      this.routePush({ name: 'pathogenySetting1197' })
    }
  }
}

</script>
