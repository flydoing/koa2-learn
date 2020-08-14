<template>
  <Page :title="title"
        :loading="loading">
    <div class="title"
         @click="handleTime">{{table.title || ''}}</div>
    <vx-table :data="table.datas"
              :cellStyle="cellStyle"
              border>
      <vx-table-column v-for="(item, i) in table.titles"
                       :key="i"
                       :label="item">
        <template slot-scope="scope">
          <span @click="handleCourse(scope.row, scope.$index, i)"
                v-html="propTxt(scope.row[i], table.keys)"></span>
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        table: {},
        loading: false,
        maxHeight: 'auto',
        curCourse: null,
        date: null
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || '课程表'
      }
    },
    created() {
      this.loading = true
      this.fetchData()
    },
    methods: {
      cellStyle(rowIndex, columnIndex, row) {
        if (columnIndex !== 0 && row[columnIndex] && row[columnIndex].isClick === '0') {
          return {
            background: '#F8F8F8'
          }
        } else if (row[columnIndex] && row[columnIndex].selected) {
          return {
            background: '#00C162',
            color: '#FFF'
          }
        }
        return {}
      },
      propTxt(row, keys) {
        if (Check.isRealArray(keys) && row) {
          let values = []
          keys.forEach((v, i) => {
            if (!Check.isNullString(row[v])) {
              values.push(row[v])
            }
          })
          return values.join('<br>')
        }
        return '-'
      },
      courseStatus(item) {
        return item ? item.selected : false
      },
      fetchData() {
        this.getTableData()
      },
      getTableData() {
        this.loading = true
        let course = this.getStorage('_exchange_course_cache')
        if (course) {
          Api.getManagerCourses(course.id)
            .then(res => {
              this.table = this.initTableData(res.table)
              this.loading = false
              this.$nextTick(() => {
                this.maxHeight = this.$refs._page.sh
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          let date = this.getStorage('coursetbl_date') || this.date || {}
          if (!Check.isNullObject(date)) {
            this.date = date
          }
          let groupId = this.routeQuery('groupId')
          Api.loadClass(groupId || this.groupId, date.startTime, date.endTime)
            .then(res => {
              this.table = res.table || {}
              this.loading = false
              this.$nextTick(() => {
                this.maxHeight = this.$refs._page.sh - 30
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      },
      initTableData(tbl) {
        tbl.datas = tbl.datas.map(v => {
          v.map(n => {
            if (n) {
              n.selected = n.isSelected === '1'
              if (n.isSelected === '1') {
                this.curCourse = n
              }
            }
            return n
          })
          return v
        })
        return tbl
      },
      handleCourse(datas, rIndex, cIndex) {
        if (!this.isSchool) {
          return false
        }
        if (Check.isNullObject(datas[cIndex]) || datas[cIndex].isClick === '0' || cIndex === 0) {
          this.curCourse = null
          this.getTableData()
          return false
        }
        if (this.curCourse) {
          let to = datas[cIndex]
          let from = this.curCourse
          let postData = {
            groupId: from.groupId,
            userId: this.userId,
            apply: {
              fromPoint: `${from.week}${from.courseOrder}`,
              toPoint: `${to.week}${to.courseOrder}`,
              alternateType: from.alternateType || ''
            }
          }
          Api.saveCourseExchange(postData).then(res => {
            this.getTableData()
            this.curCourse = null
            this.$message({ type: 'success', message: '操作成功' })
          })
        } else {
          this.setStorage('_exchange_course_cache', datas[cIndex])
          this.getTableData()
        }
      },
      handleTime() {
        this.routePush({ path: '/vx/group/business/coursetblTime' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title {
    text-align: center;
    max-height: rem(30);
    line-height: rem(30);
    @include fc;
    cursor: pointer;
  }

  .course-column {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    cursor: pointer;
    background: #fff;

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
      @include bc;
      color: #fff;
    }
  }

  .course-layer {
    background: #000;
    opacity: 0.2;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
</style>
