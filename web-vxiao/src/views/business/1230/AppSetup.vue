<template>
  <Setup appType="'1230'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1230'))" slot="others">
      <item @click="templateSetting">
        <div slot="main">模板设置</div>
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
    templateSetting() {
      this.routePush({ name: 'templateSetting1230' })
    }
  }
}

</script>
