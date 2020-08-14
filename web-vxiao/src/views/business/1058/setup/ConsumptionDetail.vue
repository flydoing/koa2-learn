<template>
  <page :title="titelText">
    <TableVue :tableData="tableDatas" />
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  import TableVue from '@/components/table/Table'
  export default {
    components: {
      TableVue
    },
    mixins: [G],
    data() {
      return {
        titelText: '',
        tableDatas: {
          columns: ['菜名', '价格'],
          datas: []
        }
      }
    },
    created() {
      this.titelText = `${this.routeQuery('date')}消费情况`
      Api.loadConsumptionDetail(this.currentGroup.parentId, this.routeQuery('date')).then(res => {
        res.datas && res.datas.forEach(data => {
          let columns = []
          for (let k in data) {
            columns.push(data[k])
          }
          this.tableDatas.datas.push({
            clickAble: false,
            columns: columns
          })
        })
      })
    }
  }

</script>
