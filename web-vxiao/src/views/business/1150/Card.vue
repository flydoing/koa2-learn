<template>
  <card115006 v-if="childMessage && childMessage.type==='115006'"
              :message="childMessage"></card115006>
  <card115007 v-else-if="childMessage && childMessage.type==='115007'"
              :message="childMessage"></card115007>
  <Card v-else-if="childMessage"
        :message="childMessage"
        :parentType="1150"></Card>
  <ItemList @click="handle"
            v-else>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:wam.avatar,error:Image.ICO_AVATAR}"
         alt='LOGO'>-`
    <span slot="title"
          class="text-color">图书</span>
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
      Card115006: resolve => require(['@/views/business/115006/Card'], resolve),
      Card115007: resolve => require(['@/views/business/115006/Card'], resolve)
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
            appType: '1150',
            groupId: this.groupId
          }
        })
      }
    }
  }
</script>
