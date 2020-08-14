<template>
  <page title="图表">
    <Chart type="bar"></Chart>
    <Chart type="pie"></Chart>
    <Chart type="radar"></Chart>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: {},
    created() {},
    components: {
      Chart: (resolve) => require(['./Chart'], resolve)
    },
    methods: {}
  }
</script>
