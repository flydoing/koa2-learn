<template>
  <Card :message="message">
    <div slot="titles"
         v-if="message.categoryName"
         v-html='message.categoryName'></div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {},
    methods: {}
  }
</script>
