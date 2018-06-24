<template>
  <div class="j-index j-common">
    头部组件
    多个列表（3个按状态）
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      listQuery: {
        page: 1,
        pageSize: 20
      }
    }
  },
  components: {
    // none
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        '1': '有效',
        '2': '无效'
      }
      return statusMap[status]
    }
  },
  created () {
    // none
  },
  methods: {
    linkageValue () {
      // none
    }
  }
}
</script>
