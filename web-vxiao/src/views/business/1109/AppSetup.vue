<template>
  <Setup appType="'1109'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1109'))" slot="others">
      <item className="vx-item-show" @click="handlerSetting">
        <div slot="main" class="vx-item-text">处理人设置</div>
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
    handlerSetting() {
      this.routePush({ name: 'handlerSetting1109' })
    }
  }
}

</script>
