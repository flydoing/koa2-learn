<template>
  <page :title="title"
        v-if="course">
    <div class="course-selection-detail">
      <!-- 学生视图 -->
      <template v-if="students.length > 0">
        <div class="category-title text center"
             v-html="dayTxt"></div>
        <template v-if="students.length === 1">
          <item label="选课对象"
                :hasClick="false"
                :remark="student.userName"></item>
        </template>
        <template v-else>
          <el-dropdown class="block-element"
                       trigger="click"
                       @command="handleStudent">
            <div class="el-dropdown-link">
              <item label="选课对象"
                    :remark="student.userName"></item>
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <el-dropdown-item class="menu-item"
                                v-for="(user,i) in students"
                                :key="i"
                                :command="user">{{user.userName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <div class="category-title text center">可选组合分析（含语数英）</div>
        <div class="analysis-item"
             v-for="(item, i) in student.datas"
             :key="i"
             :class="{'selected': item.selected}"
             @click="handleAnalysis(item, i)">
          组合{{i + 1}}：{{item.subjectNames}}<br>
          总分：<br>
          年级{{item.totalCount}}人，排名{{item.odds}}% <br>
          已选{{item.joinCount}}人，排名{{item.joinOdds}}% <br>
          <div class="text-color"
               @click.stop="handleMajor(item)">查看适选专业</div>
        </div>
      </template>
      <!-- 老师管理员视图 -->
      <template v-else>
        <item :label="unselectedTxt"
              @click="handleUnselected"></item>
        <template v-if="subjects.length > 0">
          <div class="category-title"></div>
          <item v-for="(item,i) in subjects"
                :key="i"
                @click="handleItem(item, i, '1')"
                :label="item.subjectName"
                :remark="item.count">
          </item>
        </template>
        <template v-if="mixtures.length > 0">
          <div class="category-title"></div>
          <item v-for="(item,i) in mixtures"
                :key="i"
                @click="handleItem(item, i, '2')"
                :label="item.subjectNames"
                :remark="item.count">
          </item>
        </template>
      </template>
    </div>
    <div slot="bottom"
         v-if="dayCount>0 && students.length>0"
         class="btm-operate">
      <div class="button button-common"
           @click="handleFinish">完成</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        course: null,
        students: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      },
      unselectedTxt() {
        let course = this.course || {}
        return course.notSelectedCount ? `${course.notSelectedCount}人未选` : ''
      },
      student() {
        let user = this.students.filter(v => {
          return v.selected
        })[0]
        return user || this.students[0]
      },
      dayCount() {
        let course = this.course || {}
        let date = new Date(course.endTime).getTime() - new Date(course.startTime).getTime()
        return Math.floor(date / (1000 * 60 * 60 * 24))
      },
      dayTxt() {
        return this.dayCount > 0 ? `${this.dayCount}天后截止` : '选课已截止'
      },
      mixtures() {
        let course = this.course || {}
        return course.assembleSummarys || []
      },
      subjects() {
        let course = this.course || {}
        return course.subjectSummarys || []
      }
    },
    methods: {
      fetchData() {
        let projectId = this.routeQuery('pid')
        let userId = this.routeQuery('userId') || this.userId
        Api.getSelectionInfo(projectId, userId).then(res => {
          if (res.project) {
            this.course = res.project
            if (res.project.studentAnalyses) {
              this.students = res.project.studentAnalyses.map(v => {
                v.selected = false
                v.datas = v.datas.map(d => {
                  d.selected = d.selectStatus === '1'
                  return d
                })
                return v
              })
            }
          }
        })
      },
      handleStudent(user) {
        this.students = this.students.map(v => {
          v.selected = v.userId === user.userId
          return v
        })
      },
      handleAnalysis(item, index) {
        if (this.dayCount > 0) {
          this.students = this.students.map(v => {
            if (v.userId === this.student.userId) {
              v.datas = v.datas.map(d => {
                if (d.id === item.id) {
                  d.selected = !item.selected
                } else {
                  d.selected = false
                }
                return d
              })
            }
            return v
          })
        }
      },
      handleItem(item, index, type) {
        this.routePush({
          name: 'studentList1138',
          query: {
            title: this.title,
            name: type === '1' ? item.subjectName : item.subjectNames,
            pid: this.routeQuery('pid'),
            sid: item.subjectId || item.id,
            type: type
          }
        })
      },
      handleUnselected() {
        this.routePush({
          name: 'studentList1138',
          query: {
            title: this.title,
            pid: this.routeQuery('pid'),
            unselected: '1'
          }
        })
      },
      handleMajor(item) {
        this.routePush({
          name: 'majorList1138',
          query: {
            title: this.title,
            key: item.majorKeys
          }
        })
      },
      handleFinish() {
        let major = this.student.datas.filter(v => {
          return v.selected
        })[0]
        if (!major) {
          this.$message({ message: '请选择课程', type: 'warning' })
          return false
        }
        Api.commitSelection({
          analysis: {
            id: major.id
          }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .course-selection-detail {
    .analysis-item {
      line-height: 1.5;
      padding: rem(10);
      border-bottom: rem(10) solid #ebebeb;
      position: relative;
      background: #fff;
      &.selected:before {
        content: '';
        border: rem(3) solid #2dbd60;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        pointer-events: none;
      }
    }
  }
  .btm-operate {
    padding: rem(5) 0;
  }
</style>
