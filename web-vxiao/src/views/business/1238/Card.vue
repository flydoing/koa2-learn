<template>
  <Card :message="message">
    <div slot="contents" v-if="approve.remark" v-html="approve.remark"></div>
    <template slot="contents" v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys" :key="i" :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </template>
    <CardHref v-if="button" :content="button.text" @click="button.handle" />
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
        let approve = {
          confirmer: null,
          replys: [],
          remark: ''
        }

        try {
          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(function(u) {
              if (u.type === 'to') {
                approve.confirmer = u
              }
            })
          }

          approve.remark = approve.confirmer && _m.status === '3' ? '待'.concat(approve.confirmer.name).concat('确认') : ''

          let replys = []
          if (Check.isArray(_m.replys)) {
            _m.replys.map(function(r) {
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
      },
      button() {
        let _m = this.message

        if (_m.status === '3') {
          return {
            text: '确认入库',
            handle: this.confirmHandle
          }
        }
        return false
      }
    },
    methods: {
      confirmHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
