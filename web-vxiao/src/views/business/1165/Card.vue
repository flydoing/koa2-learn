<template>
  <Card :message="childMessage"
        v-if="childMessage"
        :parentType="1165">
    <div slot="title"
         v-html="childMessage.title"></div>
    <CardHref content="查看详情"
              @click="handleDetail" />
  </Card>
  <ItemList @click="handle"
            v-else>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}"
         alt='LOGO'>
    <span slot="title"
          class="text-color">{{message.title}}</span>
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
    computed: {
      childMessage() {
        return this.message.children ? this.message.children[0] : null
      }
    },
    methods: {
      handle() {
        this.routePushModel({
          path: `/vx/group/business`,
          query: {
            appType: '1165',
            groupId: this.groupId
          }
        })
      },
      handleDetail() {
        this.routePush({
          name: 'detail1157',
          params: {
            msgId: this.childMessage.id
          },
          query: {
            type: this.childMessage.type
          }
        })
      }
    }
  }
</script>
