<template>
  <Card :message="message"
        :parentType="1189" />
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    }
  }
</script>
