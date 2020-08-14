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
  import ApproveMixin from '@/views/business/1001/mixin'
  import Api from '@/views/business/1001/api'
  export default {
    mixins: [CardMixin, ApproveMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        executeBtn: {
          name: '备案',
          txt: '备案完毕',
          handle: this.handleExecute
        },
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
      Api.getSignatureMeta('1235', this.schoolId).then(res => {
        if (res.metaDatas) {
          this.meta = res.metaDatas[0]
        }
      })
    },
    methods: {}
  }
</script>
