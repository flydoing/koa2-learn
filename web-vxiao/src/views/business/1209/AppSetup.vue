<template>
  <Setup appType="'1209'">
    <template v-if="isOrg && (isSuperAdmin || isAdmin || isAppAdmin('1209'))" slot="others">
      <item @click="autoMoment">
        <div slot="main">自动全景瞬间</div>
      </item>
      <item @click="equipmentList">
        <div slot="main">全景设备列表</div>
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
    autoMoment() {
      this.routePush({ name: 'autoMoment1209' })
    },
    equipmentList() {
      this.routePush({ name: 'equipmentList1209' })
    }
  }
}

</script>
