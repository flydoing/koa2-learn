<template>
  <Setup appType="'1142'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1142'))" slot="others">
      <item className="vx-item-show" @click="idcardSetting">
        <div slot="main" class="vx-item-text">家长身份证设置</div>
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
    idcardSetting() {
      this.routePush({ name: 'idcardSetting1142' })
    }
  }
}

</script>
