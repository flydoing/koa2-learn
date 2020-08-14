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
    <CardHref v-if="hasAuth"
              content="确认入库"
              @click="handleConfirm" />
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
      hasAuth() {
        let confirmer = this.approve.confirmer || {}
        return this.message.status === '3' && (this.isAdmin || confirmer.userId === this.userId)
      },
      approve() {
        let _m = this.message
        let approve = {
          confirmer: null,
          replys: [],
          remark: ''
        }

        try {
          if (Check.isRealArray(_m.toUsers)) {
            _m.toUsers.map(u => {
              if (u.type === 'to') {
                approve.confirmer = u
              }
            })
          }
          if (approve.confirmer && _m.status === '3') {
            approve.remark = `待${approve.confirmer.name}确认`
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
      handleConfirm() {
        this.$confirm('是否确认入库？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.modifyMessage({
            id: this.message.id,
            type: '1224',
            status: '8',
            toUsers: [
              {
                userId: this.userId,
                type: 'to'
              }
            ]
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      }
    }
  }
</script>
