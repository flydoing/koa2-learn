<template>
  <Card :message="message">
    <CardContent slot="content"
                 :content="message.content">
      <div>标题：{{message.title}}</div>
      <div v-if="message.extensionType">编号：{{message.extensionType}}</div>
      <div>分类：{{message.categoryName}}</div>
    </CardContent>
    <CardHref slot="href"
              content="查看详情"
              @click="handleDetail"></CardHref>
    <div v-if="approve.remark"
         v-html="approve.remark"></div>
    <template v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </template>
    <template v-if="approve.isApprover">
      <CardHref content="立即审批"
                @click="handleResult" />
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import ApproveMixin from '@/views/business/1001/mixin'
  import Api from '@/views/business/1001/api'
  export default {
    mixins: [CardMixin, ApproveMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        meta: {}
      }
    },
    computed: {
      approve() {
        return this.toApprove(this.message)
      },
      isOpen() {
        let meta = this.meta || {}
        return meta.obj === '1'
      }
    },
    created() {
      Api.getSignatureMeta('1248', this.schoolId).then(res => {
        if (res.metaDatas) {
          this.meta = res.metaDatas[0]
        }
      })
    },
    methods: {
      handleDetail() {
        this.routePushModel({
          name: 'detail1248',
          params: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
