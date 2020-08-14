<template>
  <page title="备注"
        :hasSubmit="hasSubmit"
        @submit="handleSubmit">
    <div class="add-remark">
      <TextInput placeholder="输入内容"
                 v-model="form.remark" />
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        form: {
          remark: ''
        }
      }
    },
    computed: {
      hasSubmit() {
        return this.form.id !== undefined
      }
    },
    created() {
      let params = this.$route.query
      if (params.id) {
        Api.getRemarkById(params.id).then(res => {
          if (res.workAttendance) {
            this.form = res.workAttendance
          }
        })
      } else {
        this.$set(this.form, 'remark', params.extension)
      }
    },
    methods: {
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.remark)) {
          this.$message({ message: '备注内容不能为空', type: 'warning' })
          return false
        }
        Api.saveRemark({
          workAttendance: {
            id: form.id,
            remark: form.remark
          }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .add-remark {
    & > textarea {
      height: rem(150);
    }
  }
</style>
