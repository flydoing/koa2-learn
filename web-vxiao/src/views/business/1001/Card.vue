<template>
  <Card :message="message">
    <CardContent slot="content"
                 :content="m.content">
      <div slot="other"
           v-if="approve.remark"
           v-html="approve.remark"></div>
      <template slot="other"
                v-if="approve.replys">
        <div v-for="(reply,i) in approve.replys"
             :key="i"
             :reply="reply">
          <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
        </div>
      </template>
    </CardContent>
    <template v-if="approve.isApprover">
      <CardHref content="立即审批"
                @click="handleResult" />
    </template>
    <template v-else-if="approve.isExecutor && m.status==='4'">
      <CardHref slot="href"
                :content="executeBtn.txt"
                @click="executeBtn.handle" />
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  import ApproveMixin from './mixin'
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
      m() {
        let _m = this.converMessage(this.message)
        _m.title = `${this.message.businessName}：${this.message.title}`
        return _m
      },
      approve() {
        return this.toApprove(this.message)
      },
      isOpen() {
        let meta = this.meta || {}
        return meta.obj === '1'
      }
    },
    created() {
      Api.getSignatureMeta('1001', this.schoolId).then(res => {
        if (res.metaDatas) {
          this.meta = res.metaDatas[0]
        }
      })
    },
    methods: {}
  }
</script>
