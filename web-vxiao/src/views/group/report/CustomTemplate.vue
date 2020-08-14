<template>
  <MedalWall1005 v-if="type=='4'" :params="params"></MedalWall1005>
  <Chart1005 v-else-if="type=='5'" :params="params"></Chart1005>
  <Chart1237 v-else-if="type=='6'" :params="params"></Chart1237>
</template>
<script>
  export default {
    props: {
      type: { type: String, default: '' },
      params: { type: Object }
    },
    components: {
      MedalWall1005: resolve => require(['@/views/business/1005/MedalWall'], resolve),
      Chart1005: resolve => require(['@/views/business/1005/Chart'], resolve),
      Chart1237: resolve => require(['@/views/business/1237/Chart'], resolve)
    },
    computed: {},
    created() {}
  }

</script>
