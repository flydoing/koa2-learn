<template>
  <Setup appType="'1055'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1005'))" slot="others">
      <item @click="bindIpHandle">
        <div>报名信息设置</div>
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
  methods: {
    bindIpHandle() {
      this.routePush({
        name: 'applyInfoList1055'
      })
    }
  }
}

</script>
