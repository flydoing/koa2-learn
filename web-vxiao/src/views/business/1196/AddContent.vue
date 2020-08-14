<template>
  <page title="评估内容" @submit="handleSubmit" hasSubmit>
    <TextInput placeholder="输入内容" v-model="content"></TextInput>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getStudentAppraisal'
    })
  },
  methods: {
    ...mapActions(['setStudentAppraisal']),
    fetchData() {
      let item = this.appraisal.item
      this.content = item.appraisalComment
    },
    handleSubmit() {
      const that = this
      if (Check.isNullString(that.content)) {
        that.$message({ message: '内容不能为空', type: 'warning' })
        return false
      }

      let item = this.appraisal.item
      this.setStudentAppraisal({ item: { ...item, appraisalComment: that.content } })
      this.routeBack()
    }
  }
}

</script>
