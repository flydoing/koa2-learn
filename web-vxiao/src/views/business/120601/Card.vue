<template>
  <Card :message="message">
    <CardHref v-if="button" :content="button.text" @click="button.handle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {

      button() {
        let _m = this.converMessage(this.message)

        return {
          text: _m.extension ? '查看客户详情' : '业主单位新建为客户',
          handle: _m.extension ? this.detailHandle : this.createHandle
        }
      }
    },
    methods: {
      detailHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      },
      createHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
