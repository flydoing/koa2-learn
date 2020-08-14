<template>
  <Page title="预排课表"
        closePrompt>
    <div class="exchange-course-tbl">
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
                   :class="{'selected':selectStatus(scope.row, i), 'exchange': exchangeStatus(scope.row, i)}"
                   @click="handleColumn(scope.row, i, scope.$index)">
                <span v-html="colTxt(scope.row, i, scope.$index)"></span>
              </div>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        table: null,
        maxHeight: 0,
        exchanges: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let form = this.obj.form || {}
        let course = this.obj.course
        Api.getClassCourseTable(form.schedule.id, course.groupId).then(res => {
          if (res.commonTable) {
            Api.getExchangeCourses({
              schedule: {
                unitKe: {
                  groupId: course.groupId,
                  jie: course.jie,
                  scheduleId: form.schedule.id,
                  userIds: course.userIds,
                  week: course.week
                }
              }
            })
              .then(result => {
                if (result.schedule) {
                  this.exchanges = result.schedule.unitKes || []
                }
                this.table = {
                  columns: res.commonTable.headers,
                  datas: res.commonTable.lines
                }
              })
              .catch(result => {
                this.table = {
                  columns: res.commonTable.headers,
                  datas: res.commonTable.lines
                }
              })
          }
        })
      },
      colTxt(row, index, rowIndex) {
        if (index === 0) {
          return `${row.jie}`
        } else {
          let cell = row.datas[index - 1]
          if (cell) {
            return [cell.course, cell.userName, cell.place].join('<br>')
          }
          return ''
        }
      },
      selectStatus(row, i) {
        let course = this.obj.course || {}
        let cell = row.datas[i - 1] || {}
        return course.jie === cell.jie && course.week === cell.week
      },
      exchangeStatus(row, i) {
        let eMap = new Map()
        if (Check.isRealArray(this.exchanges)) {
          this.exchanges.map(v => {
            eMap.set(`${v.jie}_${v.week}`, v)
          })
        }

        let cell = row.datas[i - 1] || {}
        return Check.isObject(eMap.get(`${cell.jie}_${cell.week}`))
      },
      handleColumn(row, i, rowIndex) {
        if (i === 0) {
          return false
        }
        let form = this.obj.form
        this.$set(row.datas[i - 1], 'selected', !row.datas[i - 1].selected)
        this.setCreateObject({
          form: {
            ...form,
            ruleData: {
              rules: this.selectedRules,
              table: this.table
            }
          }
        })
      },
      handlePublish() {}
    }
  }
</script>
<style lang="scss" scoped>
  .exchange-course-tbl {
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

      &.exchange {
        color: #f93;
      }
    }
  }
</style>
