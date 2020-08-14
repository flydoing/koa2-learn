<template>
  <page title="放学详情">
    <item v-for="(item,i) in list"
          :key="i"
          :item="item"
          :hasClick="false">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           class="ellipsis"
           :class="{'text-color error': item.type != '11'}"
           v-html="item.data"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    props: {},
    computed: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        let msgId = that.routeQuery('msgId')
        Api.loadLeaveSchoolDetail(msgId).then(res => {
          that.list = res.datas
        })
      }
    }
  }
</script>
