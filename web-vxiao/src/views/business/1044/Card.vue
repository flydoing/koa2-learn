<template>
  <CardSimple v-if="isSchool" :message="message" />
  <Card v-else :message="message">
    <CardContent slot="content" :content="m.content">
      <div slot="other" v-html="m.title"></div>
      <div slot="other" v-if="appraise.abort">已截止</div>
    </CardContent>
    <CardHref slot="href" v-if="button" :content="button.text" @click="button.handle" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      appraise() {
        let _m = this.message
        let ap = {
          abort: false,
          btnText: ''
        }

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson) : null
          if (!Check.isNullObject(json)) {
            let date = new Date(DateUtils.format(json.expirationTime, DateUtils.YMD_HMS))
            if (date.getTime() < new Date().getTime() && _m.fromUserId !== this.$store.state.USERID) {
              ap.abort = true
            }
          }
          if (_m.fromUserId === this.$store.state.USERID) {
            ap.isCreator = true
            ap.btnText = '查看评价结果'
          } else if (_m.readed === 1) {
            ap.btnText = '已评价'
          } else {
            ap.btnText = '开始评价'
          }
          return ap
        } catch (e) {}
      },
      button() {
        let ap = this.appraise

        return {
          text: ap.btnText,
          handle: this.appraiseHandle
        }
      }
    },
    methods: {
      appraiseHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
