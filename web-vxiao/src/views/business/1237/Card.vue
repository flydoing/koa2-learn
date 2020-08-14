<template>
  <card123701 v-if="childMessage && childMessage.type === '123701'"
              :message="childMessage"></card123701>
  <card128401 v-else-if="childMessage && childMessage.type === '128401'"
              :message="childMessage"></card128401>
  <ItemList @click="handle"
            v-else>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}"
         alt='LOGO'>
    <span slot="title"
          class="text-color">{{message.businessName}}</span>
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
    components: {
      Card123701: resolve => require(['@/views/business/123701/Card'], resolve),
      Card128401: resolve => require(['@/views/business/128401/Card'], resolve)
    },
    computed: {
      childMessage() {
        return this.message.children ? { ...this.message.children[0] } : null
      }
    },
    methods: {
      handle() {
        this.routePushModel({
          path: `/vx/group/business`,
          query: {
            appType: '1237',
            groupId: this.groupId
          }
        })
      }
    }
  }
</script>
