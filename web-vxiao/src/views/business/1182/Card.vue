<template>
  <Card :message="message">
    <img slot="avatar" class="avatar" v-lazy="{src:url(message.fromUserAvatar,'thumb'),error:Image.ICO_AVATAR}" alt='头像' />
    <div slot="title">{{message.title}}</div>
  </Card>
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
