<template>
  <child-card :message="childMessage"
              v-if="childMessage">
  </child-card>
  <ItemList @click="handle"
            v-else>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}"
         alt='LOGO'>
    <span slot="title"
          class="text-color">心理咨询</span>
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
      ChildCard: (resolve) => require(['@/views/business/1195/Card'], resolve)
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
            appType: '1194',
            groupId: this.groupId
          }
        })
      }
    }
  }
</script>
