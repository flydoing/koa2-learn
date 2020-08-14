<template>
  <page title="上课时间"
        @submit="handleSubmit"
        hasSubmit>
    <div class="course-time">
      <vx-table :data="timeTable.datas"
                border>
        <vx-table-column v-for="(item, i) in timeTable.titles"
                         :key="i"
                         :fixed="i==0"
                         :label="item"
                         min-width="100">
          <template slot-scope="scope">
            <label v-html="propTxt(scope.row, i)"></label>
            <div class="ct-period"
                 :style="propStyle(scope.row, i)"
                 @click="handlePeriod(scope.row, scope.$index, i)">
              <span v-html="propTxt(scope.row, i)"></span>
            </div>
          </template>
        </vx-table-column>
      </vx-table>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        timeTable: {}
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      propTxt(datas, index) {
        if (index === 0) {
          return datas[index].sectionName
        }
        if (datas[index].selected) {
          return '上课'
        }
        return '点击选中'
      },
      propStyle(datas, index) {
        if (datas[index].sectionIndex && datas[index].isClick === '0') {
          return { background: '#e0e0e0' }
        } else if (datas[index].selected) {
          return { background: '#00C162', color: '#fff' }
        } else {
          return { background: '#fff', color: '#444' }
        }
      },
      fetchData() {
        let pMap = new Map()
        if (Check.isRealArray(this.selection.periods)) {
          this.selection.periods.map(v => {
            pMap.set(`${v.sectionIndex}_${v.dayOfWeek}`, v)
          })
        }
        Api.getTimePeriod(this.currentGroup.parentId).then(res => {
          if (res.commonTable) {
            let tbl = res.commonTable
            tbl.datas = tbl.datas.map(v => {
              let i = 0
              let sName = ''
              v.map(n => {
                if (i === 0) {
                  sName = n.sectionName
                } else {
                  n.sectionName = sName
                  n.dayName = tbl.titles[i]
                  n.selected = Check.isObject(pMap.get(`${n.sectionIndex}_${n.dayOfWeek}`))
                }
                i++
                return n
              })
              return v
            })
            this.timeTable = tbl
          }
        })
      },
      handlePeriod(datas, rIndex, cIndex) {
        if (datas[cIndex].isClick === '0' || cIndex === 0) {
          return false
        }
        datas[cIndex].selected = !datas[cIndex].selected
        this.$set(this.timeTable.datas, rIndex, datas)
      },
      handleSubmit() {
        let periods = []
        this.timeTable.datas.map(v => {
          let ps = v.filter(n => {
            return n.selected
          })
          periods.push(...ps)
        })
        if (!Check.isRealArray(periods)) {
          this.$message({ type: 'warning', message: '请选择上课时间' })
          return false
        }
        this.setSelection({ periods: periods })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
  .course-time {
    .vx-table {
      .cell {
        position: relative;
      }
    }

    .ct-period {
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
    }
  }
</style>
