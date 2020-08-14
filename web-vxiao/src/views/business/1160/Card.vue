<template>
  <Card :message="childMessage"
        v-if="childMessage"
        :parentType="1160">
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:m.avatar,error:Image.ICO_AVATAR}"
         alt='头像' />
    <template slot="titles">
      <div>老师：{{childMessage.extensionType}}</div>
      <div>职务：{{job}}</div>
    </template>
    <template slot="content">
      <CardContent :content="description" />
    </template>
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
          class="text-color">教师风采</span>
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
        return this.message.children ? { ...this.message.children[0] } : null
      },
      job() {
        const that = this
        if (that.childMessage) {
          let mJson = JSON.parse(that.childMessage.msgJson || '{}')
          let arr = []
          if (mJson.categorys) {
            arr = mJson.categorys.map((v) => {
              return v.name
            })
          }
          return arr.join('、')
        }
        return ''
      },
      description() {
        return `荣誉介绍：${this.childMessage.title}`
      }
    },
    methods: {
      handle() {
        this.routePushModel({
          path: `/vx/group/business`,
          query: {
            appType: '1160',
            groupId: this.groupId
          }
        })
      },
      handleDetail() {
        this.routePush({
          name: 'cardDetail1161',
          params: { msgId: this.childMessage.id },
          query: { type: this.childMessage.type }
        })
      }
    }
  }
</script>
