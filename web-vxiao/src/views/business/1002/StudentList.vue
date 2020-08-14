<template>
  <page title="发布作业成绩" hasSubmit @submit="commitGrade">
    <div class="offline-homework">
      <template v-if="scoreType.value==='1'">
        <el-dropdown trigger="click" @command="gradeHandle" v-if="studentList.length>0" v-for="(student, s) in studentList" :key="s">
          <item class="el-dropdown-link">
            <div>{{student.name}}</div>
            <div slot="remark">{{student.gradeName}}</div>
          </item>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{grade: grade, student: student}" v-if="scoreTyepChild.length>0" v-for="(grade, g) in scoreTyepChild" :key="g">{{grade.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <item v-for="(student, s) in studentList" :key="s" v-if="studentList.length>0" :hasClick="false">
          <div slot="main">{{student.name}}</div>
          <div slot="remark">
            <div v-if="scoreType.value==='2'" class="star-box">
              <i class="ico ico-star-press" :class="[n <= student.sortNum ? 'star active' : 'star']" v-for="n in 5" :key="n" @click="setStarAccount(n, s)"></i>
            </div>
            <input v-else-if="scoreType.value==='0'" maxlength="3" type="text" v-model.number="student.score">
          </div>
        </item>
      </template>
      <!-- <Dialogs :visible.sync="gradeModalShowBol" :height="260" ref="_dialog_list">
        <DialogPage title="评价" :hasReturn="true" :hasClose="false">
          <item v-for="(grade, g) in scoreTyepChild" :key="g" @click="gradeHandle(grade)">
            <div slot="main">{{grade.name}}</div>
            <span slot="after"></span>
          </item>
        </DialogPage>
      </Dialogs> -->
    </div>
  </page>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  import CategoryEnum from '@/constant/category'
  import M from '@/views/business/mixin'
  import {
    mapActions,
    mapGetters
  } from 'vuex'
  export default {
    name: 'homeworkStudentList',
    mixins: [CardMixin, M],
    data() {
      return {
        studentList: [],
        studentIndex: null,
        scoreType: [],
        scoreTyepChild: [],
        gradeModalShowBol: false
      }
    },
    created: function() {
      const that = this
      let sgroupId = that.getSchoolGroupId(that.currentGroup.parentId)
      Api.getScoreType(sgroupId, that.routeQuery('appType')).then(res => {
        if (res && res.code === '1') {
          res.categories.forEach(c => {
            if (c.id === Number(res.metaDatas[0].obj)) {
              that.scoreType = c
            }
          })
          if (that.isTeacher) {
            Api.loadStudentList(that.routeQuery('msgId')).then(res => {
              if (res && res.code === '1') {
                that.studentList = res.relations
                if (that.scoreType.value === '1') {
                  Api.getScoreTypeChild(CategoryEnum.SCORESHOW_CHILD, that.scoreType.id,
                    '0').then(res => {
                    if (res && res.code === '1') {
                      that.scoreTyepChild = res.categorys
                      that.studentList.forEach(val => {
                        // val.score = 100
                        // val.gradeName = res.categorys[0].name
                        // val.optionId = res.categorys[0].id
                        that.$set(val, 'score', 100)
                        that.$set(val, 'gradeName', res.categorys[0].name)
                        that.$set(val, 'optionId', res.categorys[0].id)
                      })
                    }
                  })
                } else {
                  that.studentList.forEach(val => {
                    val.score = 100
                    that.$set(val, 'sortNum', 5)
                  })
                }
              }
            })
          } else if (that.isParent) {
            Api.getChilrenList(that.currentGroup.groupId).then(res => {
              if (res && res.code === '1') {
                that.studentList = res.relations
                if (that.scoreType.value === '1') {
                  Api.getScoreTypeChild(CategoryEnum.SCORESHOW_CHILD, that.scoreType.id,
                    '0').then(res => {
                    if (res && res.code === '1') {
                      that.scoreTyepChild = res.categorys
                      that.studentList.forEach(val => {
                        that.$set(val, 'score', 100)
                        that.$set(val, 'gradeName', res.categorys[0].name)
                        that.$set(val, 'optionId', res.categorys[0].id)
                      })
                    }
                  })
                } else {
                  that.studentList.forEach(val => {
                    val.score = 100
                    that.$set(val, 'sortNum', 5)
                  })
                }
              }
            })
          }
        }
      })
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      commitGrade() {
        let studentGrade = []
        if (this.scoreType.value !== '1') {
          this.studentList.forEach((val, i) => {
            var tempObj = {}
            tempObj.userId = val.userId
            tempObj.score = val.score
            studentGrade.push(tempObj)
          })
        } else {
          this.studentList.forEach((val, i) => {
            var tempObj = {}
            tempObj.userId = val.userId
            tempObj.optionId = val.optionId
            tempObj.score = val.score
            studentGrade.push(tempObj)
          })
        }

        if (this.isTeacherBol || this.isTeacher) {
          let tearchReqBody = {
            categoryId: this.scoreType.id,
            datas: studentGrade,
            msgId: this.routeQuery('msgId')
          }
          Api.teacherCommitGrade(tearchReqBody).then(res => {
            if (res.code === '1') {
              this.routeBack()
              this.$message({
                type: 'success',
                message: '发布成功'
              })
              // this.$store.commit('modifyGroupMessage', {
              //   groupId: res.messages[0].groupId,
              //   m: res.messages[0]
              // })
              this.modifyChannelMessage(res.messages[0])
            } else {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          })
        } else if (this.isParentBol || this.isParent) {
          let parentReqBody = {
            msgId: this.$route.query.msgId,
            ratings: studentGrade
          }
          Api.parentCommitGrade(parentReqBody).then(res => {
            if (res.code === '1') {
              this.routeBack()
              this.$message({
                type: 'success',
                message: '发布成功'
              })
              // this.$store.commit('modifyGroupMessage', {
              //   groupId: res.messages[0].groupId,
              //   m: res.messages[0]
              // })
              this.modifyChannelMessage(res.messages[0])
            } else {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          })
        }
      },
      gradeHandle(obj) {
        // this.gradeModalShowBol = false
        this.$set(obj.student, 'score', obj.grade.value)
        this.$set(obj.student, 'gradeName', obj.grade.name)
        this.$set(obj.student, 'optionId', obj.grade.id)
      },
      setStarAccount(n, sortIndex) {
        this.$set(this.studentList[sortIndex], 'sortNum', n)
        this.$set(this.studentList[sortIndex], 'score', n * 20)
      }
    },
    computed: {
      ...mapGetters(['getRelationById'])
    }
  }

</script>
<style lang="scss">
  @import "~scss/_mixin";
  .offline-homework {
    .el-dropdown {
      display: block !important;
    }
    .star-box {
      @include flex;
      &.center {
        @include jc;
        margin-bottom: rem(20);
        .star {
          width: rem(25);
          height: rem(25);
          margin-right: rem(10);
        }
      }
      .star {
        width: rem(18);
        height: rem(18);
        margin-right: rem(5);
        cursor: pointer;
        font-size: rem(18);
        /* background: url(~images/ico/ico_star.png) no-repeat center;
        background-size: 100%; */
        &.active {
          /* background: url(~images/ico/ico_light_star.png) no-repeat center;
          background-size: 100%; */
          color: #f4ea2a;
        }
        &:hover {
          /* background: url(~images/ico/ico_light_star.png) no-repeat center;
          background-size: 100%; */
          color: #f4ea2a;
        }
      }
    }
  }

</style>
