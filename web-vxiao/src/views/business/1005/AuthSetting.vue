<template>
  <page title="颁发数权限设置">
    <label slot="btn"
           @click="handleExtraScore">额外权限</label>
    <div class="auth-setting">
      <!-- <TableView :tableData="table" v-on:cellClick="cellClick"></TableView> -->
      <vx-table v-if="table"
                :data="table.datas"
                :height="maxHeight"
                stripe>
        <vx-table-column v-for="(item, i) in table.columns"
                         :key="i"
                         :fixed="i===0 && table.columns.length > 4"
                         :label="item"
                         width="150">
          <template slot-scope="scope">
            <div :class="{'tbl-column': i>1}"
                 @click="cellClick(scope.row, scope.$index, i)">
              <span v-html="scope.row.columns[i]"></span>
            </div>
          </template>
        </vx-table-column>
      </vx-table>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    // components: {
    //   TableView: resolve => require(['@/components/table/Table'], resolve)
    // },
    props: {},
    computed: {
      ...mapGetters({
        evaluate: 'getCreateObject'
      })
    },
    data() {
      return {
        table: null,
        tableData: {
          datas: []
        },
        maxHeight: 0
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        Api.loadAuthTableData(this.currentGroup.groupId).then(res => {
          // 表格对象数据
          let objDatas = []
          let columns = []
          let datas = []

          if (Check.isArray(res.limits)) {
            res.limits.forEach((v, i) => {
              if (i === 0) {
                let batch = {
                  columns: [],
                  clickAble: false,
                  isSummary: true
                }

                // 批量设置对象数据
                let objBatchs = [null, null]

                columns.push('身份', '上限规则')
                batch.columns.push('/', v.description)

                v.upperlimits.map(function(u) {
                  columns.push(u.name)
                  batch.columns.push('批量设置')
                  objBatchs.push({
                    batch: 1,
                    groupId: u.groupId,
                    evaluationCategoryId: u.evaluationCategoryId,
                    categoryParentId: u.categoryParentId
                  })
                })

                datas.push(batch)
                objDatas.push(objBatchs)
              }

              let set = {
                columns: [v.dutyName, v.description],
                clickAble: false,
                isSummary: false
              }

              // 设置对象数据
              let objSets = [null, null]

              v.upperlimits.map(function(u) {
                if (u.monthScore || u.monthScore === 0 || u.weekScore || u.weekScore === 0 || u.dayScore || u.dayScore === 0) {
                  set.columns.push(
                    [u.monthScore !== undefined ? u.monthScore : '无限制', u.weekScore !== undefined ? u.weekScore : '无限制', u.dayScore !== undefined ? u.dayScore : '无限制'].join('\\') + '分'
                  )
                } else {
                  set.columns.push('无限制')
                }
                objSets.push(u)
              })
              datas.push(set)
              objDatas.push(objSets)
            })
          }

          this.table = {
            datas: datas,
            columns: columns
          }
          this.tableData.datas = objDatas
        })
      },
      cellClick(cell, rowIndex, columnIndex) {
        let tbl = this.tableData.datas
        let obj = tbl[rowIndex][columnIndex]

        if (!obj) {
          return false
        }

        this.setCreateObject({ auth: obj })
        this.routePush({
          name: 'authEdit1005'
        })
      },
      handleExtraScore() {
        this.routePush({ name: 'extraScore1005' })
      }
    }
  }
</script>
<style lang="scss">
  .auth-setting {
    .tbl-column {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
</style>
