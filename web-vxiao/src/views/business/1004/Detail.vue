<template>
  <vx-table :data="datas">
    <vx-table-column label="学生姓名"
                     prop="name" />
    <vx-table-column label="考勤结果"
                     prop="data" />
  </vx-table>
</template>
<script>
  'use strict'
  import Api from './api'
  import Check from '@/utils/check'
  export default {
    created() {},
    components: {
      Tables: resolve => require(['@/components/table/Table'], resolve)
    },
    data() {
      return {
        datas: []
      }
    },
    computed: {},
    methods: {},
    mounted() {
      Api.loadDetailById(this.routeParam('id')).then(res => {
        if (Check.isRealArray(res.attendances)) {
          this.datas = res.attendanceshg
        }
      })
    }
  }
</script>
