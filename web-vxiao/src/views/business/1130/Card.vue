<template>
  <Card :message="message">
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:url(message.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
         alt='头像' />
    <!-- <img slot="avatar"
         class="avatar"
         v-lazy="{src:m.url(message.fromUserAvatar,'thumb'),error:Image.ICO_USER}"
         alt='头像' /> -->
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    }
  }
</script>
