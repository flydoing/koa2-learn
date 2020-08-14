<template>
  <Card :message="message"
        :parentType="1184">
    <span slot="name"
          class="text-color">{{message.categoryName}}</span>
    <div slot="title"
         if="notice.label"
         v-html="notice.label"></div>
    <div slot="contents"
         if="notice.remark"
         v-html="notice.remark"></div>
    <div slot="contents"
         v-if="notice.replys">
      <div v-for="(reply,i) in notice.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </div>
    <CardHref v-if="button"
              :content="button.text"
              @click="button.handle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import DateFormat from '@/utils/date'
  import Api from './api'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    components: {},
    data() {
      return {
        msg: this.message
      }
    },
    computed: {
      notice() {
        let m = this.msg
        let notice = {
          replys: [],
          remark: ' ',
          label: ' ',
          isEnd: false
        }

        try {
          if (m.extension) {
            notice.isEnd = new Date(m.extension).getTime() < new Date().getTime()
            notice.label = m.extension ? `截止时间：${DateFormat.format(m.extension, 'yyyy年MM月dd日 ')}${notice.isEnd ? '（已截止） ' : ' '}` : ' '
            notice.isEnd && m.readed === 1 && (notice.remark = '已报名 ')
          }

          let replys = []
          if (Check.isArray(m.replys)) {
            m.replys.map(function(r) {
              if (r.fromClientId === 'system ') {
                let cnt = r.content.substring(r.content.indexOf('： ') + 1)
                replys.push({
                  fromUserName: r.fromUserName,
                  content: cnt
                })
              }
            })
          }
          notice.replys = replys
        } catch (e) {}
        return notice
      },
      button() {
        let m = this.msg
        let notice = this.notice

        if (m.extension && !notice.isEnd) {
          return {
            text: m.readed !== 0 ? '取消报名 ' : '立即报名 ',
            handle: this.handleSignUp
          }
        }
        return false
      }
    },
    methods: {
      handleSignUp() {
        Api.noticeBoardSignUp(this.msg.id).then((res) => {
          this.$message({ message: '操作成功 ', type: 'success ' })
          this.msg = res.messages[0]
        })
      }
    }
  }
</script>
