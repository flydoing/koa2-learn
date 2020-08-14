<template>
  <Page title="群组申请"
        :loading="loading"
        :showTips="list.length < 1">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handle(item, index)"
          :label="item.name"
          :remark="item.extension">
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
      Api.loadUncertified(this.schoolId).then(res => {
        that.list = res.groups || []
        this.loading = false
      })
    },
    methods: {
      commitData(school, value, cback) {},
      handle(school, index) {
        const that = this
        this.$confirm('认证通过？', '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '忽略',
          type: 'warning'
        })
          .then(() => {
            that.commitData()
          })
          .catch(() => {
            that.commitData()
          })
      }
    }
  }
</script>
