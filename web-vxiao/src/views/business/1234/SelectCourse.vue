<template>
  <page :title="title"
        closePrompt>
    <div slot="top">
      <div class="sc-remark">以下为可调课程</div>
    </div>
    <div class="course-table">
      <vx-table :data="courseTable.datas"
                style="width: 100%"
                :height="tblHeight"
                stripe>
        <vx-table-column v-for="(item, i) in courseTable.titles"
                         :key="i"
                         :fixed="i===0"
                         :label="item"
                         min-width="100">
          <template slot-scope="scope">
            <label v-html="propTxt(scope.row, i)"></label>
            <div class="ct-period"
                 :style="courseStyle(scope.row[i])"
                 @click.stop="handleCourse(scope.row, scope.$index, i)">
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
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        courseTable: {},
        tblHeight: 0
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        exchange: 'getExchangeCourse'
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      ...mapActions(['setExchangeCourse', 'deleteExchangeCourseProp']),
      propTxt(datas, index) {
        let values = []
        let keys = ['course', 'groupName', 'userName', 'placeName']
        let col = datas[index]
        if (col) {
          keys.map(v => {
            if (col[v]) {
              values.push(col[v])
            }
          })
          return values.join('<br>')
        }
        return ''
      },
      courseStyle(item) {
        if (item && item.color) {
          return { background: item.color, color: '#fff' }
        }
        return {}
      },
      fetchData() {
        if (this.exchange.weekDate) {
          let date = this.exchange.weekDate
          let course = this.exchange.course
          Api.getExCourses(course.id, date.startTime, date.endTime).then(res => {
            this.courseTable = res.table || {}
            this.$nextTick(() => {
              this.tblHeight = this.$el.children[2].offsetHeight
            })
          })
        }
      },
      handleCourse(datas, rIndex, cIndex) {
        if (Check.isNullObject(datas[cIndex]) || datas[cIndex].isClick === '0' || cIndex === 0) {
          return false
        }
        let to = datas[cIndex]
        let from = this.exchange.course
        let postData = {
          apply: {
            groupId: from.groupId,
            fromUserId: this.userId,
            type: '1',
            fromCellId: from.id,
            toCellId: to.id
          }
        }
        Api.saveCourse(postData).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.setExchangeCourse({
            form: {
              ...this.exchange.form,
              curIndex: null,
              clsGroupId: null,
              showWeekExchange: false
            }
          })
          this.routeBack(-2)
        })
      }
    }
  }
</script>
<style lang="scss">
  .course-date {
    text-align: center;
    height: rem(40);
    line-height: rem(40);
  }

  .course-table {
    .vx-table {
      .cell {
        position: relative;
        height: 100%;
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
        @include borderColor;
      }
    }
  }
  .sc-remark {
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    color: #999;
    text-align: center;
  }
</style>
