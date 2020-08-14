<template>
  <child-card v-if="childMessage"
              :message="childMessage"
              @more="handle"></child-card>
  <ItemList @click="handle"
            v-else>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}"
         alt='LOGO'>
    <span slot="title"
          class="text-color">{{m.title}}</span>
    <span slot="main">{{m.content}}</span>
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
    components: {
      ChildCard: (resolve) => require(['@/views/business/1005/Card'], resolve)
    },
    computed: {
      childMessage() {
        return this.message.children ? { ...this.message.children[0] } : null
      }
    },
    methods: {
      handle() {
        this.routePushModel({
          name: 'evaluateCardList1097',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
