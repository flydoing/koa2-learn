<template>
  <page title="新建代课"
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
      <vx-table :data="courseTable.datas"
                style="width: 100%"
                :height="tblHeight"
                border
                stripe>
        <vx-table-column v-for="(item, i) in courseTable.titles"
                         :key="i"
                         fixed
                         :label="item"
                         min-width="100">
          <template slot-scope="scope">
            <label v-html="propTxt(scope.row, i)"></label>
            <div class="ct-period"
                 :style="courseStyle(scope.row[i])"
                 @click="handleCourse(scope.row, scope.$index, i)">
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
        tblHeight: 0,
        form: {
          date: null,
          approvers: [],
          hasChange: false
        }
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
        return this.approveMeta.obj === '1'
      },
      approveMeta() {
        return this.filterMeta('m_coursetable_exchange_control') || {}
      },
      subjectMeta() {
        return this.filterMeta('m_substitute_cross_subject') || {}
      },
      acrossSubject() {
        return this.subjectMeta.obj === '1'
      },
      dateTxt() {
        return this.form.date ? this.form.date.name : ''
      },
      approverTxt() {
        let aps = this.form.approvers
        return aps.length > 0 ? `${aps.length}人` : ''
      }
    },
    methods: {
      ...mapActions(['setExchangeCourse']),
      filterMeta(type) {
        const that = this
        let school = that.getSchool(that.schoolId)
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
      courseStyle(item) {
        if (item && item.color) {
          return { background: item.color, color: '#fff' }
        }
        return {}
      },
      fetchData() {
        if (this.exchange.form) {
          this.form = this.exchange.form
          let apvs = this.exchange.users
          if (Check.isRealArray(apvs)) {
            this.form = { ...this.form, approvers: apvs }
            this.setExchangeCourse({ users: [] })
          }
        }
        if (this.exchange.date) {
          let exDate = this.exchange.date
          let oDate = this.form.date || {}
          this.form.date = exDate
          if (oDate.startTime === exDate.startTime && oDate.endTime === exDate.endTime) {
            this.getTableData()
          } else {
            this.cancelExchange(() => {
              this.form.hasChange = false
              this.getTableData()
            })
          }
          this.setExchangeCourse({ date: null })
        } else {
          Api.getTimePeriods().then(res => {
            this.form.date = res.datas[0]
            this.getTableData()
          })
        }
      },
      getTableData() {
        let date = this.form.date
        Api.getCourseTable(this.currentGroup.parentId, this.userId, date.startTime, date.endTime).then(res => {
          if (res.table) {
            this.courseTable = res.table
          }
          this.$nextTick(() => {
            this.tblHeight = this.$el.children[2].offsetHeight
          })
        })
      },
      handleCourse(datas, rIndex, cIndex) {
        if (Check.isNullObject(datas[cIndex]) || datas[cIndex].isClick === '0' || cIndex === 0) {
          return false
        }
        this.setExchangeCourse({ form: this.form, cell: datas[cIndex] })
        if (this.acrossSubject) {
          this.routePush({ name: 'selectSubject1234' })
        } else {
          this.routePush({ name: 'selectTeacher1234' })
        }
      },
      handleApprover() {
        this.setExchangeCourse({ form: this.form, users: this.form.approvers })
        this.routePush({ name: 'selectMember1234' })
      },
      handleTime() {
        this.$confirm('切换日期将清空当前代课', '提示', {
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
        if (!that.form.hasChange) {
          that.$message({ message: '请选择你需要替代的课程', type: 'warning' })
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
          msgType: '2'
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
          that.setExchangeCourse({ form: null })
          that.routeBack(-2)
        })
      },
      cancelExchange(callback) {
        Api.cancelCourseExchange(this.currentGroup.parentId, this.userId, '2').then(res => {
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
            this.setExchangeCourse({ form: null })
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
</style>
