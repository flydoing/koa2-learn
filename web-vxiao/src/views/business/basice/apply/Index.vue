<template>
  <Page title="审核列表"
        :loading="loading"
        :showTips="list.length < 1">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handle(item, i)"
          :label="item.name"
          :remark="remarkTxt(item)">
    </item>
  </Page>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        loading: false
      }
    },
    created() {
      const that = this
      this.loading = true
      if (this.isEducation) {
        Api.getApplyList(this.schoolId).then(res => {
          this.list = res.schools || []
          this.loading = false
        })
      } else {
        Api.loadUncertified(this.schoolId).then(res => {
          that.list = res.groups || []
          this.loading = false
        })
      }
    },
    methods: {
      remarkTxt(school) {
        return school.identify === '1' ? '待审核' : '审核通过'
      },
      commitData(school, value, cback) {
        Api.approveApply({
          school: {
            id: school.id,
            identify: value,
            parentId: school.parentId
          }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          cback && cback()
        })
      },
      handle(school, index) {
        const that = this
        this.$confirm('审核通过？', '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '忽略',
          type: 'warning'
        })
          .then(() => {
            that.commitData(school, '2', () => {
              that.$set(school, 'identify', '2')
            })
          })
          .catch(() => {
            that.commitData(school, '3', () => {
              that.list.splice(index, 1)
            })
          })
      }
    }
  }
</script>
