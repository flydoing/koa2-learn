<template>
  <Setup appType="'1149'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1149'))" slot="others">
      <item className="vx-item-show" @click="columnSetting">
        <div slot="main" class="vx-item-text">栏目设置</div>
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
    columnSetting() {
      this.routePush({ name: 'columnSetting1149' })
    }
  }
}

</script>
