<template>
  <page title="食谱详情">
    <div class="food-menu-detail">
      <Tables :tableData="table"
              v-on:cellClick="cellClick" />
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R],
    components: {
      Tables: resolve => require(['@/components/table/Table'], resolve)
    },
    props: {},
    computed: {},
    data() {
      return {
        table: {
          lockRows: 1,
          lockColumns: 1,
          columns: [],
          datas: []
        },
        tableData: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        let msgId = that.routeParam('msgId')
        Api.loadFoodMenuDetail(msgId, this.routeQuery('userId')).then(res => {
          that.table.columns.push(...res.table.tableTitle)
          res.table.cookbooks.forEach((v, i) => {
            let columns = []
            let objColumns = [null]
            columns.push(`${v.name}<br>${DateUtils.format(v.weekDate, DateUtils.MD)}`)
            v.menu.forEach((k, j) => {
              objColumns.push(k.foods ? { ...k, weekName: v.name } : null)
              let menuTxt = k.foods
                ? k.foods
                    .map(f => {
                      return f.name
                    })
                    .join('<br>')
                : ''
              columns.push(k.totalPrice ? `<span class="text-color">${res.isAllowPay ? '已付款' : '已选'}（${k.totalPrice}元）</span><br>${menuTxt}` : menuTxt)
            })
            that.table.datas.push({ columns: columns, clickAble: false, isSummary: false })
            that.tableData.push(objColumns)
          })
        })
      },
      cellClick(cell, columnIndex, rowIndex) {
        let menu = this.tableData[rowIndex][columnIndex]
        if (menu) {
          this.routePushModel({
            path: `/vx/group/business/1058/DetailMenuList/${menu.id}`,
            query: {
              title: `${menu.name}食谱（${menu.weekName}）`,
              userId: this.routeQuery('userId')
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .food-menu-detail {
    .t-cell {
      cursor: pointer;
    }
  }
</style>
