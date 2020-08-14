<template>
  <Setup appType="'1196'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1196'))" slot="others">
      <item @click="templateSetting">
        <div slot="main" class="vx-item-text">模板设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  computed: {},
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  methods: {
    templateSetting() {
      this.routePush({ name: 'templateSetting1196' })
    }
  }
}

</script>
