<template>
  <page title="新建调课"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div slot="top">
      <item v-if="showApprove"
            @click="handleApprover">
        <div slot="main">审批人</div>
        <div slot="remark"
             v-html="approverTxt"></div>
      </item>
      <div class="course-date text-color text"
           v-html="dateTxt"
           @click="handleTime"></div>
    </div>
    <div class="course-table">
      <vx-table v-if="courseTable"
                :data="courseTable.datas"
                style="width: 100%"
                :height="maxHeight"
                stripe>
        <template v-if="courseTable.titles">
          <vx-table-column v-for="(item, i) in courseTable.titles"
                           :key="i"
                           :fixed="i===0"
                           :label="item"
                           min-width="100">
            <template slot-scope="scope">
              <label v-html="propTxt(scope.row, i)"></label>
              <div class="ct-period"
                   :class="{'selected': courseStatus(scope.row[i])}"
                   :style="courseStyle(scope.row[i])"
                   @click="handleCourse(scope.row, scope.$index, i)">
                <span v-html="propTxt(scope.row, i)"></span>
              </div>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
    <div slot="bottom">
      <div class="ec-btn-operate"
           v-if="showWeekExchange"
           @click.stop="weekExchange">跨周调课</div>
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
        maxHeight: 0,
        form: {
          date: null,
          approvers: [],
          curIndex: null,
          clsGroupId: null
        },
        showWeekExchange: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas',
        getSchool: 'getSchoolBySchoolId',
        exchange: 'getExchangeCourse'
      }),
      showApprove() {
        return Check.isNullObject(this.approveMeta) || this.approveMeta.obj === '1'
      },
      approveMeta() {
        return this.filterMeta('m_coursetable_exchange_control')
      },
      dateTxt() {
        return this.form.date ? this.form.date.name : ''
      },
      approverTxt() {
        let aps = this.form.approvers || []
        return aps.length > 0 ? `${aps.length}人` : ''
      },
      changeDatas() {
        let values = []
        let datas = this.courseTable.datas || []
        if (Check.isRealArray(datas)) {
          datas.map(v => {
            let arr = v.filter(item => {
              return item && item.color
            })
            values.push(...arr)
          })
        }
        return values
      }
    },
    methods: {
      ...mapActions(['setExchangeCourse', 'deleteExchangeCourseProp']),
      filterMeta(type) {
        const that = this
        let school = that.getSchool(that.currentGroup.parentId)
        let meta = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === school.groupId
        })[0]
        return meta
      },
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
      courseStatus(item) {
        return item ? item.selected : false
      },
      courseStyle(item) {
        if (item && item.color) {
          return { background: item.color, color: '#fff' }
        }
        return {}
      },
      fetchData() {
        if (this.exchange.course) {
          this.deleteExchangeCourseProp('course')
        }
        if (this.exchange.form) {
          this.form = this.exchange.form
          let apvs = this.exchange.users
          if (Check.isRealArray(apvs)) {
            this.form = { ...this.form, approvers: apvs }
            this.deleteExchangeCourseProp('users')
          }
          this.deleteExchangeCourseProp('form')
        }
        if (this.exchange.date) {
          let exDate = this.exchange.date
          let oDate = this.form.date || {}
          this.form.date = exDate
          if (oDate.startTime === exDate.startTime && oDate.endTime === exDate.endTime) {
            this.getTableData()
          } else {
            this.cancelExchange(() => {
              this.form.curIndex = null
              this.getTableData()
            })
          }
          this.deleteExchangeCourseProp('date')
        } else {
          Api.getTimePeriods().then(res => {
            if (res.datas) {
              this.form.date = res.datas[0]
              this.getTableData()
            }
          })
        }
      },
      initTableData(tbl) {
        tbl.datas = tbl.datas.map(v => {
          v.map(n => {
            if (n) {
              n.selected = n.isSelected === '1'
            }
            return n
          })
          return v
        })
        return tbl
      },
      getTableData() {
        let date = this.form.date
        Api.getCourseTable(this.currentGroup.parentId, this.userId, date.startTime, date.endTime).then(res => {
          if (res.table) {
            this.courseTable = this.initTableData(res.table)
          }
          this.$nextTick(() => {
            this.maxHeight = this.$el.children[2].offsetHeight
          })
        })
      },
      getCourses(cellId) {
        let date = this.form.date
        Api.getExCourses(cellId, date.startTime, date.endTime).then(res => {
          this.courseTable = this.initTableData(res.table)
          this.showWeekExchange = true
        })
      },
      handleCourse(datas, rIndex, cIndex) {
        if (cIndex === 0) {
          this.showWeekExchange = false
          this.form.curIndex = null
          this.getTableData()
          return false
        }
        if (Check.isNullObject(datas[cIndex]) || datas[cIndex].isClick === '0') {
          return false
        }
        if (this.form.curIndex) {
          let to = datas[cIndex]
          let from = this.courseTable.datas[this.form.curIndex.row][this.form.curIndex.cell]
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
            this.getTableData()
            this.form.curIndex = null
            this.form.clsGroupId = from.groupId
            this.showWeekExchange = false
            this.$message({ type: 'success', message: '操作成功' })
          })
        } else {
          this.form.curIndex = { row: rIndex, cell: cIndex }
          this.getCourses(datas[cIndex].id)
        }
      },
      handleApprover() {
        this.setExchangeCourse({ form: this.form, users: this.form.approvers })
        this.routePush({ name: 'selectMember1234' })
      },
      weekExchange() {
        let course = this.courseTable.datas[this.form.curIndex.row][this.form.curIndex.cell]
        this.setExchangeCourse({ form: this.form, course: course })
        this.routePush({ name: 'weeks1234' })
      },
      handleTime() {
        this.$confirm('切换日期将清空当前调课', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setExchangeCourse({ form: this.form, date: this.form.date })
          this.routePush({ name: 'selectTime1234' })
        })
      },
      handleSubmit() {
        const that = this
        let date = that.form.date
        if (!Check.isRealArray(that.changeDatas)) {
          that.$message({ message: '请选择你需要调换的课程', type: 'warning' })
          return false
        }

        if (this.showApprove && !Check.isRealArray(that.form.approvers)) {
          that.$message({ message: '请选择审批人', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1234',
          groupId: that.groupId,
          startDate: date.startTime,
          endDate: date.endTime,
          isPrivate: '1',
          msgType: '1'
        })

        if (Check.isRealArray(that.form.approvers)) {
          postData.toUsers = that.form.approvers.map(v => {
            return {
              userId: v.userId,
              name: v.name,
              status: '3',
              avatar: v.avatar ? v.avatar : null,
              userType: v.userType,
              type: 'to'
            }
          })
        }

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.deleteExchangeCourseProp('form')
          that.routeBack(-2)
        })
      },
      cancelExchange(callback) {
        Api.cancelCourseExchange(this.currentGroup.parentId, this.userId, '1').then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          callback()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.cancelExchange(() => {
            this.deleteExchangeCourseProp('form')
            this.routeBack()
          })
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
  .ec-btn-operate {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    color: #fff;
    background: #00c162;
    text-align: center;
    cursor: pointer;
  }
</style>
