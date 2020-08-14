<template>
  <Page title="新建排考"
        hasSubmit
        closePrompt
        listenBack
        @back="back"
        @submit="handleSubmit">
    <div class="seat-arrange">
      <item :hasClick="false">
        <div slot="main">考试名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item @click="handleGrade">
        <div slot="main">考试年级</div>
        <div slot="remark"
             v-html="gradeTxt"></div>
      </item>
      <div v-if="form.grades.length>0"
           class="category-title"></div>
      <item v-for="(item, i) in form.grades"
            :key="i">
        <div slot="main">{{item.campusName}}{{item.name}}</div>
        <div slot="remark"
             @click.stop="handleItem(item)"
             v-html="subjectTxt(item.subjects)"></div>
        <i slot="after"
           class='ico ico-delete'
           @click="handleRemove(i)"></i>
      </item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          grades: []
        }
      }
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      gradeTxt() {
        let grades = this.form.grades
        return grades.length > 0 ? `已选${grades.length}个年级` : ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      subjectTxt(datas) {
        if (Check.isRealArray(datas)) {
          return `已选${datas.length}个科目`
        }
        return '编辑考场信息'
      },
      fetchData() {
        if (this.arrange.form) {
          this.form = { ...this.arrange.form }
          if (Check.isRealArray(this.arrange.grades)) {
            this.form.grades.push(...this.arrange.grades)
            this.deleteArrangeExamProp('grades')
          }
          let grade = this.arrange.grade
          if (grade) {
            this.form.grades = this.form.grades.map(v => {
              if (v.id === grade.id) {
                return JSON.parse(JSON.stringify(grade))
              }
              return v
            })
            this.deleteArrangeExamProp('grade')
          }
        }
      },
      handleGrade() {
        this.setArrangeExam({ form: this.form })
        this.routePush({ name: 'selectGrade1164' })
      },
      handleItem(item) {
        this.setArrangeExam({ form: this.form, grade: item })
        this.routePush({ name: 'gradeInfo1164' })
      },
      handleRemove(i) {
        this.$confirm('确定删除该年级？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.grades.splice(i, 1)
        })
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '考试名称不能为空', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.grades)) {
          that.$message({ message: '请选择考试年级', type: 'warning' })
          return false
        }

        let datas = []
        let flag = true
        form.grades.forEach((v, i) => {
          if (!v.subjects || !v.reexams) {
            flag = false
          } else if (v.subjects && v.reexams) {
            datas.push({
              subjects: v.subjects.map(s => {
                return {
                  subjectId: s.id,
                  subjectName: s.name,
                  startDate: DateUtils.format_0800(s.startTime),
                  endDate: DateUtils.format_0800(s.endTime)
                }
              }),
              reexams: v.reexams
            })
          }
        })

        if (!flag) {
          this.$message({ message: '请设置年级排考信息', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1164',
          groupId: that.groupId,
          content: form.name,
          msgJson: JSON.stringify(datas),
          msgType: '2'
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.deleteArrangeExamProp('form')
          that.routeBack(-2)
        })
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteArrangeExamProp('form')
          this.$router.go(-2)
        })
      }
    }
  }
</script>
