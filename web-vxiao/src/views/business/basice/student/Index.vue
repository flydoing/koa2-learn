<template>
  <Page title="学生信息">
    <label slot="btn"
           @click="importStudent">导入学生信息</label>
    <Item :hasClick="false"
          slot="top"
          class="full-input search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索学生姓名/学号/身份证号/学籍号"
             v-model="search"
             @keyup.enter="searchStudent" />
      <span slot="after"></span>
    </Item>
    <div class="category-title"></div>
    <Item v-for="(grade,i) in grades"
          :key="i"
          @click="handleGrade(grade)">
      <div>{{grade.name}}年 {{grade.gradeFullName}}</div>
    </Item>
  </Page>
</template>
<script>
  import GroupApi from '@/api/group'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        schoolId: '',
        search: '',
        grades: []
      }
    },
    activated() {
      this.init()
    },
    methods: {
      init() {
        this.schoolId = this.routeQuery('schoolId') || this.routeQuery('extension')
        GroupApi.getSchoolGrades(this.schoolId).then(res => {
          this.grades = res.groups
        })
      },
      searchStudent() {
        if (!Check.isNullString(this.search)) {
          this.routePush({
            name: 'basiceStudentList',
            query: {
              keyword: this.search,
              schoolId: this.schoolId
            }
          })
        } else {
          this.$message({ type: 'success', message: '请输入搜索关键字' })
        }
      },
      handleGrade(g) {
        this.routePush({
          name: 'basiceStudentList',
          query: {
            gradeId: g.groupId,
            schoolId: this.schoolId
          }
        })
      },
      importStudent() {
        let that = this
        let schoolId = this.schoolId
        let userId = this.USER.id
        that.$import({
          title: '导入学生信息',
          uploadURI: this.uploadURL,
          templateUrl: '/static/templates/basice_student.xls',
          receiptUrl: `/base/schoolimportfile/student/import?schoolId=${schoolId}&userId=${userId}`,
          callback: (res, file) => {
            that.init()
          },
          receiptBack: (res, file) => {
            if (res.commonTable) {
              let lines = []
              res.commonTable.lines.map((l, i) => {
                lines.push(l.slice(0, 13))
              })
              that.setStorage('_import_receipt', {
                headers: res.commonTable.headers,
                lines: lines
              })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: `/base/schoolimportfile/student/import?schoolId=${schoolId}&userId=${userId}`,
                  fileId: res.fileId
                }
              })
            }
          }
        })
      }
    }
  }
</script>
