<template>
  <Card :message="message">
    <div slot="contents"
         v-if="approve.remark"
         v-html="approve.remark"></div>
    <template slot="contents"
              v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </template>
    <CardHref v-if="(approve.isReceiver || isAdmin) && message.status === '3'"
              content="确认接收"
              @click="handleReceive" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      approve() {
        let _m = this.message
        let _this = this
        let approve = {
          isReceiver: false,
          receiver: null,
          replys: [],
          remark: ''
        }

        try {
          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(u => {
              if (u.type === 'to') {
                if (u.userId === _this.userId) {
                  approve.isReceiver = true
                }
                approve.receiver = u
              }
            })
          }
          if (approve.receiver && _m.status === '3') {
            approve.remark = `待${approve.receiver.name}接收`
          }

          let replys = []
          if (Check.isArray(_m.replys)) {
            _m.replys.map(r => {
              if (r.fromClientId === 'system') {
                let cnt = r.content.substring(r.content.indexOf('：') + 1)
                replys.push({
                  fromUserName: r.fromUserName,
                  content: cnt
                })
              }
            })
          }
          approve.replys = replys
        } catch (e) {}
        return approve
      }
    },
    methods: {
      handleReceive() {
        this.$confirm('是否确认接收？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.modifyMessage({
            id: this.message.id,
            type: '1211',
            status: '8',
            toUsers: [this.approve.receiver]
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      }
    }
  }
</script>
