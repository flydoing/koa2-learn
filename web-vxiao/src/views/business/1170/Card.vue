<template>
  <Card :message="message">
    <CardHref content="查看报表" @click="reportHandle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },

    methods: {
      reportHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
