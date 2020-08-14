<template>
  <Card :message="message">
    <div slot="title"
         class="card-title"
         v-html="m.title"></div>
    <CardHref slot="href"
              :content="btnText"
              @click="handleHrefDetail" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Str from '@/utils/string'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    methods: {
      handleHrefDetail() {
        if (this.message.fromUserId === this.userId || this.message.flag) {
          this.routePushModel({
            name: 'checkStyleList1055App',
            query: {
              msgId: this.message.id
            }
          })
        } else {
          let startTime = new Date(this.message.times[1].setTime).getTime()
          let currentTime = new Date().getTime()
          if (currentTime < startTime) {
            this.$message.warning('报名还没开始')
            return
          }
          this.routePushModel({
            name: 'applyAppDetail',
            query: {
              token: this.$store.state.TOKENID,
              userId: this.userId,
              clientId: this.$store.state.CLIENTID,
              refId: Str.uuid(),
              msgId: this.message.id
            }
          })
        }
      }
    },
    computed: {
      btnText() {
        // 1. 如果是创建者 或者 应用管理员、学校管理员 显示 查看报名结果
        if (this.message.remark) {
          return this.message.remark || '审核通过'
        }
        if (this.message.fromUserId === this.userId || this.message.flag) {
          return '查看报名结果'
        } else {
          // 2.否则如果已报名，显示 已报名， 未报名就显示未报名
          return this.message.readed ? '已报名' : '立即报名'
        }
      }
    }
  }
</script>
