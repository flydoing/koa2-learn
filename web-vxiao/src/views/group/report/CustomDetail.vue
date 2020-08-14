<template>
  <AddRemark1237 v-if="type=='workAttendanceRemark'" :params="params"></AddRemark1237>
</template>
<script>
  export default {
    props: {
      acion: { type: String, default: '' },
      params: { type: Object }
    },
    components: {
      AddRemark1237: resolve => require(['@/views/business/1237/AddRemark'], resolve)
    },
    computed: {},
    created() {}
  }

</script>