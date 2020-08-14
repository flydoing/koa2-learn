<template>
  <Card :message="message">
    <div slot="titles" v-if="operate.label" v-html='operate.label'></div>
    <div slot="titles" v-if="operate.remark" v-html='operate.remark'></div>
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
      operate() {
        let _m = this.message
        let op = {
          isCreator: false,
          remark: '',
          label: ''
        }

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson).object : null

          if (!Check.isNullObject(json)) {
            op.label = '客户：'.concat(json.schoolName)
          }

          if (_m.extension) {
            op.remark = _m.extension
          }

          if (this.USER.id === _m.fromUserId) {
            op.isCreator = true
          }
        } catch (e) {}
        return op
      },
      button() {
        let op = this.operate

        if (op.isCreator) {
          return {
            text: '编辑回访纪要',
            handle: this.editHandle
          }
        }
        return false
      }
    },
    methods: {
      editHandle() {
        this.$message({ type: 'warning', message: '开发中...' })
      }
    }
  }

</script>
