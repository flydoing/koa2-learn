<template>
  <div class="period-step">
    <vx-table v-if="table"
              :data="table.datas"
              :height="maxHeight"
              stripe
              border>
      <template v-if="table.columns">
        <vx-table-column v-for="(item, i) in table.columns"
                         :key="i"
                         :fixed="i===0"
                         :label="item">
          <template slot-scope="scope">
            <div class="column-content"
                 v-html="colTxt(scope.row, i, scope.$index)"></div>
            <div class="column-item"
                 :class="{'selected':selectStatus(scope.row, i)}"
                 @click="handleColumn(scope.row, i, scope.$index)">
              <span v-html="colTxt(scope.row, i, scope.$index)"></span>
            </div>
          </template>
        </vx-table-column>
      </template>
    </vx-table>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  // import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {
      maxHeight: { type: [String, Number] },
      timeStamp: { type: [String, Number] }
    },
    components: {},
    data() {
      return {
        table: null
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      let form = this.obj.form || {}
      let data = form.periodData || {}
      if (data.table) {
        this.table = JSON.parse(JSON.stringify(data.table))
      } else {
        this.loadPeriodData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadPeriodData() {
        let form = this.obj.form || {}
        let data = form.periodData || {}
        let scheduleId = form.schedule.id
        Api.getPeriodInfo(scheduleId).then(res => {
          if (res.commonTable) {
            let tbl = res.commonTable
            this.table = {
              columns: tbl.headers,
              datas: tbl.lines
            }
            this.setCreateObject({
              form: {
                ...form,
                periodData: {
                  ...data,
                  table: this.table
                }
              }
            })
          }
        })
      },
      colTxt(row, index, rowIndex) {
        if (index === 0) {
          return row.title
        } else {
          let cell = row.datas[index - 1]
          return cell.id ? '选修时段' : '点击设置'
        }
      },
      selectStatus(row, i) {
        let cell = row.datas[i - 1] || {}
        return cell.id !== undefined
      },
      handleColumn(row, i, rowIndex) {
        if (i === 0) {
          return false
        }
        let form = this.obj.form
        let cell = row.datas[i - 1]
        let grades = form.modelData.datas
        if (cell.id) {
          this.$confirm('确认取消选修时段设置？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Api.setPeriodInfo({
              classSection: {
                id: cell.id,
                status: 'd'
              }
            }).then(res => {
              this.$message({ message: '操作成功', type: 'success' })
              this.$set(row.datas, i - 1, {
                sectionIndex: cell.sectionIndex,
                week: cell.week
              })
            })
          })
        } else {
          Api.setPeriodInfo({
            classSection: {
              scheduleId: form.schedule.id,
              week: cell.week,
              sectionIndex: cell.sectionIndex,
              datas: grades.map(v => {
                return { groupId: v.groupId }
              }),
              status: '1'
            }
          }).then(res => {
            this.$set(row.datas, i - 1, res.classSection)
          })
        }
      }
    },
    watch: {
      timeStamp(val) {
        this.loadPeriodData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .period-step {
    .column-content {
      visibility: hidden;
    }
    .column-item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: pointer;

      span {
        display: inline-block;
        vertical-align: middle;
        padding: 0 rem(10);
      }

      &:after {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
      }

      &.selected {
        background: nth($background, 3);
        color: #fff;
      }
    }
  }
</style>
