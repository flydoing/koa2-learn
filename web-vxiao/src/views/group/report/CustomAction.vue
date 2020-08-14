<template>
  <ConsumeEdit1240 v-if="action==='editAmount'"></ConsumeEdit1240>
  <AddRemark1237 v-else-if="action==='workAttendanceRemark'"></AddRemark1237>
  <Detail1109 v-else-if="action==='wipedList'"></Detail1109>
</template>
<script>
  export default {
    components: {
      ConsumeEdit1240: resolve => require(['@/views/business/1240/ConsumeEdit'], resolve),
      AddRemark1237: resolve => require(['@/views/business/1237/AddRemark'], resolve),
      Detail1109: resolve => require(['@/views/business/1109/Detail'], resolve)
    },
    data() {
      return {
        params: {}
      }
    },
    computed: {
      action() {
        return this.routeQuery('action') || ''
      }
    }
  }
</script>
