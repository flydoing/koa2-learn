<template>
  <Card :message="message">
    <template slot="images">
      <CardImages :images="message.images"
                  listenEvent
                  @callback="onClick" />
    </template>
    <template slot="files"></template>
  </Card>
</template>
<script>
  export default {
    props: {
      message: { type: [Object] }
    },
    methods: {
      onClick(image) {
        this.$message({ type: 'warning', message: '请使用PC客户端查看' })
      }
    }
  }
</script>
