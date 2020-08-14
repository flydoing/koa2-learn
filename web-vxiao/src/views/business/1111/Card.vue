<template>
  <Card :message="message"
        @more="handleMore">
    <div slot="title">{{message.title}}</div>
    <template v-if="replys"
              slot="contents">
      <div v-for="(reply,i) in replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </template>
    <CardHref v-if="button"
              :content="button.text"
              @click="button.handle" />
  </Card>
</template>
<script>
  import Check from '@/utils/check'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      replys() {
        let _m = this.message
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
        return replys
      },
      button() {
        let _m = this.message
        let json = JSON.parse(_m.msgJson) || {}

        try {
          if (json.status === '3' && _m.status === '3') {
            return {
              text: '修订',
              handle: this.handleRevise
            }
          }
        } catch (e) {}
        return false
      }
    },
    methods: {
      handleRevise() {
        this.routePushModel({
          name: 'reviseAmount1111',
          params: {
            msgId: this.message.id
          }
        })
      },
      handleMore() {
        this.$emit('more')
      }
    }
  }
</script>
