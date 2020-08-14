<template>
  <page title="疾控上报"
        @add="handleAdd"
        :hasAdd="true"
        :loading="loading"
        ref="_page">
    <div slot="top">
      <div class="report-date text-color text"
           @click="handleDate"
           v-html="dateTxt"></div>
    </div>
    <div class="course-table">
      <vx-table :data="table.datas"
                :height="tblHeight"
                border
                @row-click="handleEdit">
        <vx-table-column prop="groupName"
                         label="班级">
        </vx-table-column>
        <vx-table-column prop="userName"
                         label="姓名">
        </vx-table-column>
        <vx-table-column prop="sickleaveTitle"
                         label="症状">
        </vx-table-column>
        <vx-table-column prop="centerSickLeaveTitle"
                         label="诊断（病因）">
        </vx-table-column>
        <vx-table-column label="结果">
          <template slot-scope="scope">
            <label v-html="resultTxt(scope.row.send)"></label>
          </template>
        </vx-table-column>
      </vx-table>
    </div>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           :class="{'disabled': !isNowDay}"
           @click="handleReport">一键上报</div>
    </div>
    <SelectDate :date.sync="date"
                :show.sync="showSelectDate"
                @confirm="handleDateConfirm"></SelectDate>
  </page>
</template>
<script>
  // import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      SelectDate: resolve => require(['./SelectDate'], resolve)
    },
    data() {
      return {
        table: {},
        tblHeight: 0,
        date: '',
        loading: false,
        showSelectDate: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        attendance: 'getAttendance'
      }),
      dateTxt() {
        return this.date ? DateUtils.format(this.date, 'MM月dd日') : ''
      },
      isNowDay() {
        let nowDate = DateUtils.format(new Date(), 'yyyy-MM-dd')
        let tStamp1 = new Date(nowDate).getTime()
        let tStamp2 = new Date(this.date || nowDate).getTime()
        return tStamp1 === tStamp2
      }
    },
    methods: {
      ...mapActions(['setAttendance', 'deleteAttendanceProp']),
      resultTxt(value) {
        return value === '1' ? '已报' : '未报'
      },
      fetchData() {
        const that = this
        if (that.attendance.date) {
          that.date = that.attendance.date
          that.deleteAttendanceProp('date')
        } else if (!that.date) {
          that.date = DateUtils.format(new Date(), 'yyyy-MM-dd')
        }
        this.loading = true
        Api.getDiseaseReportData(that.currentGroup.parentId, DateUtils.format(that.date, 'yyyyMMdd'))
          .then(res => {
            this.loading = false
            this.table.datas = res.workDiseases || []
            that.$nextTick(() => {
              that.tblHeight = that.$refs._page.sh
            })
          })
          .catch(res => {
            this.loading = false
          })
      },
      handleAdd() {
        this.routePush({ name: 'diseaseReportEdit1237' })
      },
      handleDate() {
        this.showSelectDate = true
      },
      handleDateConfirm(date) {
        this.date = date
        this.showSelectDate = false
        this.fetchData()
      },
      handleEdit(row, event, column) {
        this.setAttendance({ cache: row, date: this.date })
        this.routePush({ name: 'diseaseReportEdit1237' })
      },
      handleReport() {
        if (!this.isNowDay) {
          return false
        }
        Api.reportDiseaseRecord(this.currentGroup.parentId).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.fetchData()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .report-date {
    text-align: center;
    max-height: rem(30);
    line-height: rem(30);
    cursor: pointer;
  }
  .btm-operate {
    padding: rem(5) 0;
  }
</style>
