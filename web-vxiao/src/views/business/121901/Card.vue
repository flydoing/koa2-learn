<template>
  <Card :message="message">
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
      button() {
        let _m = this.message
        let _this = this
        let isHandler = false

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson) : null

          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(function(u) {
              if (u.type === 'to' && u.userId === _this.$store.state.USERID) {
                isHandler = true
              }
            })
          }

          if (isHandler && json) {
            return {
              text: '新建合同',
              handle: this.createHandle
            }
          }
        } catch (e) {}
        return false
      }
    },
    methods: {
      createHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
