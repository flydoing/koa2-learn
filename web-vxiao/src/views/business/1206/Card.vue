<template>
  <ItemList @click="handle">
    <img slot="avatar" class="avatar" v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}" alt='LOGO'>
    <span slot="title" class="text-color">招投标</span>
    <span slot="main">{{message.content}}</span>
  </ItemList>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    methods: {
      handle() {
        this.routePushModel({
          name: 'childCardList1206',
          params: { msgId: this.message.id }
        })
      }
    }
  }

</script>
