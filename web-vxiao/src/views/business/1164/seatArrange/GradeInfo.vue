<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleSubject">
      <div slot="main">考试科目</div>
      <div slot="remark"
           v-html="subjectTxt"></div>
    </item>
    <div v-if="form.subjects.length>0"
         class="category-title"></div>
    <item v-for="(item, i) in form.subjects"
          :key="i">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="dateTxt(item)"
           @click="handleTime(item)"></div>
      <i slot="after"
         class='ico ico-delete'
         @click="handleRemove(i)"></i>
    </item>
    <div class="category-title text"
         v-if="form.reexams.length>0">考场信息</div>
    <item v-for="(item, i) in form.reexams"
          :key="i"
          @click="handleReexam(item)">
      <div slot="main">{{item.campusName}} {{item.examPlaceName}}</div>
    </item>
    <div class="button button-common"
         @click="handleImport">导入考场座位表</div>
    <SelectTime v-if="curSubject"
                :startTime="curSubject.startTime"
                :endTime="curSubject.endTime"
                :show.sync="showSelectTime"
                @confirm="handleTimeConfirm"
                @close="handleClose"></SelectTime>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectTime: (resolve) => require(['../SelectDateTime'], resolve)
    },
    data() {
      return {
        form: {
          subjects: [],
          reexams: []
        },
        curSubject: null,
        showSelectTime: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      subjectTxt() {
        let subjects = this.form.subjects
        return subjects.length > 0 ? `已选${subjects.length}个科目` : ''
      }
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      dateTxt(item) {
        if (item.startTime && item.endTime) {
          return `${item.startTime} 至 ${item.endTime}`
        }
        return '设置考试时间'
      },
      fetchData() {
        const that = this
        let form = that.arrange.gradeForm
        let grade = that.arrange.grade
        if (form) {
          that.form = JSON.parse(JSON.stringify(form))
          if (that.arrange.subjects) {
            that.form.subjects.push(...that.arrange.subjects)
            this.deleteArrangeExamProp('subjects')
          }
          if (that.arrange.reexams) {
            that.form.reexams = that.arrange.reexams
            this.deleteArrangeExamProp('reexams')
          }
          this.deleteArrangeExamProp('gradeForm')
        } else if (grade) {
          that.form = {
            subjects: grade.subjects ? JSON.parse(JSON.stringify(grade.subjects)) : [],
            reexams: grade.reexams || []
          }
        }
      },
      handleImport() {
        const that = this
        let grade = that.arrange.grade
        that.$import({
          title: '导入考场座位表',
          uploadURI: `/commons/file/readExcel`,
          templateUrl: `/business/reexam/download/excel`,
          callback: (res, file) => {
            Api.importSeatArrangeData({
              excelDatas: res.dataGirds[0].data,
              schoolId: that.currentGroup.parentId,
              campusId: grade.parentId,
              gradeId: grade.id,
              gradeName: grade.name
            }).then((res) => {
              if (res.reexams) {
                this.form.reexams = res.reexams
              } else {
                this.setArrangeExam({
                  gradeForm: this.form,
                  tableDatas: res.reexamDatas,
                  errorMap: res.errorMap
                })
                this.routePush({ name: 'importSeatView1164' })
              }
            })
          }
        })
      },
      handleSubject() {
        this.setArrangeExam({ gradeForm: this.form, subjects: this.form.subjects })
        this.routePush({ name: 'selectSubject1164' })
      },
      handleTime(item) {
        this.curSubject = item
        this.showSelectTime = true
      },
      handleReexam(item) {
        this.setArrangeExam({ gradeForm: this.form, seats: JSON.parse(item.seat) })
        this.routePush({
          name: 'seatInfo116401',
          query: {
            title: item.examPlaceName
          }
        })
      },
      handleClose() {
        this.curSubject = null
        this.showSelectTime = false
      },
      handleTimeConfirm(times) {
        this.form.subjects = this.form.subjects.map((v) => {
          if (v.id === this.curSubject.id) {
            v = { ...v, startTime: times[0], endTime: times[1] }
          }
          return v
        })
        this.curSubject = null
        this.showSelectTime = false
      },
      handleRemove(i) {
        this.form.subjects.splice(i, 1)
      },
      handleSubmit() {
        const that = this
        let form = this.form
        if (!Check.isRealArray(form.subjects)) {
          this.$message({ message: '考试科目不能为空', type: 'warning' })
          return false
        }

        let flag = true
        form.subjects.forEach((v, i) => {
          if (!v.startTime || !v.endTime) {
            flag = false
          }
        })

        if (!flag) {
          this.$message({ message: '请设置科目考试时间', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.reexams)) {
          this.$message({ message: '请导入考场座位表信息', type: 'warning' })
          return false
        }
        this.setArrangeExam({ grade: { ...that.arrange.grade, subjects: form.subjects, reexams: form.reexams } })
        this.routeBack()
      }
    }
  }
</script>
