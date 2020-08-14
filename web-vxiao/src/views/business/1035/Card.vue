<template>
  <Card :message="message">
    <img slot="avatar" class="avatar" v-lazy="{src:url(message.fromUserAvatar),error:Image.ICO_USER}" alt='头像' />
  </Card>
</template>
<script>
  export default {
    props: {
      message: { type: [Object] }
    }
  }

</script>
