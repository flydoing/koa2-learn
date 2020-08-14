<template>
  <Page title="新建排考"
        listenBack
        closePrompt
        @back="back">
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span class="active"><b>1</b><br>时间安排</span>
        <span><b>2</b><br>场所安排</span>
        <span><b>3</b><br>监考安排</span>
        <span><b>4</b><br>智能排考</span>
        <i></i>
      </div>
    </div>
    <item :hasClick="false">
      <div slot="main">考试名称</div>
      <input slot="remark"
             class="align-right"
             placeholder="必填"
             v-model="name" />
    </item>
    <!-- 校区 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showCampus">
      <Item v-for="(item, i) in campuses"
            :key="i"
            @click="handleCampus(item)">
        <div>{{item.name}}</div>
      </Item>
      <Item slot="reference">
        <div>校区</div>
        <div slot="remark"
             v-html="campusTxt"></div>
      </Item>
    </el-popover>
    <!-- 年级 -->
    <div class="each-grade"
         v-for="(item, i) in grades"
         :key="i">
      <item @click="handleGrade(item)">
        <div slot="before">
          <i class="ico ico-delete"
             @click.stop="handleRemoveGrade(item)"></i>
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="gradeTxt(item)"></div>
      </item>
      <!-- 科目 -->
      <item v-for="(sub, j) in item.subjects"
            :hasArrow="false"
            :key="j">
        <div slot="before">
          <i class="ico ico-delete"
             @click.stop="handleRemoveSubject(item, sub, j)"></i>
        </div>
        <div slot="main"
             v-html="sub.name"></div>
        <div slot="remark"
             v-html="dateTxt(sub)"
             @click="handleTime(item, sub)"></div>
      </item>
      <!-- 新增科目 -->
      <item @click="handleAddSubject(item)"
            :hasArrow="false">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
        <div slot="main">新增科目</div>
      </item>
    </div>
    <div class="category-title"></div>
    <!-- 新增年级 -->
    <item @click="handleAddGrade"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">新增考试年级</div>
    </item>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           @click="handleNext">下一步</div>
    </div>
    <SelectTime v-if="curSubject"
                :startTime="curSubject.startTime"
                :endTime="curSubject.endTime"
                :show.sync="showSelectTime"
                @confirm="handleTimeConfirm"
                @close="handleClose"></SelectTime>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      SelectTime: resolve => require(['../SelectDateTime'], resolve)
    },
    data() {
      return {
        name: '',
        campus: null,
        campuses: [],
        subjects: [],
        showCampus: false,
        showSelectTime: false,
        curSubject: null,
        curGrade: null,
        defaultSubjects: []
      }
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      campusTxt() {
        return this.campus ? this.campus.name : ''
      },
      grades() {
        let campus = this.campus || {}
        if (Check.isRealArray(campus.datas)) {
          let gs = campus.datas.filter(v => {
            return v.selected
          })
          if (gs.length > 0) {
            return gs.map(v => {
              return {
                id: v.id,
                name: v.name,
                campusId: campus.id,
                campusName: campus.name,
                classes:
                  v.classes ||
                  v.datas.map(v => {
                    if (v.selected === undefined) {
                      v.selected = true
                    }
                    return v
                  }),
                subjects: v.subjects
              }
            })
          }
          return []
        }
        return []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      gradeTxt(item) {
        if (Check.isRealArray(item.classes)) {
          let cs = item.classes.filter(v => {
            return v.selected
          })
          return cs.length > 0 ? `${cs.length}个班` : ''
        }
        return ''
      },
      dateTxt(subject) {
        if (subject.startTime && subject.endTime) {
          return `${subject.startTime} 至 ${subject.endTime}`
        }
        return '设置考试时间'
      },
      fetchData() {
        if (this.arrange.name) {
          this.name = this.arrange.name
          this.deleteArrangeExamProp('name')
        }
        if (this.arrange.campus) {
          this.campus = JSON.parse(JSON.stringify(this.arrange.campus))
          if (this.arrange.grade) {
            let grade = this.arrange.grade
            this.campus.datas = this.campus.datas.map(v => {
              if (grade.id === v.id) {
                let gd = JSON.parse(JSON.stringify(grade))
                return { ...gd, selected: true }
              }
              return v
            })
            this.deleteArrangeExamProp('grade')
          }
          this.deleteArrangeExamProp('campus')
        } else if (this.arrange.timeForm) {
          this.campus = JSON.parse(JSON.stringify(this.arrange.timeForm.campus))
          this.name = this.arrange.timeForm.name
          this.deleteArrangeExamProp('timeForm')
        }

        Api.getCampusGrades(this.groupId).then(res => {
          this.campuses = res.datas
        })

        Api.getSubjects(this.groupId).then(res => {
          if (res.categorys) {
            this.subjects = res.categorys
            this.defaultSubjects = res.categorys.filter(v => {
              return v.extension === '1'
            })
            if (this.campus && this.campus.datas) {
              this.campus.datas = this.campus.datas.map(v => {
                v.subjects = v.subjects || JSON.parse(JSON.stringify(this.defaultSubjects))
                return v
              })
            }
          }
        })
      },
      handleCampus(item) {
        this.campus = item
        this.showCampus = false
      },
      handleAddGrade() {
        if (!this.campus) {
          this.$message({ message: '请选择排考校区', type: 'warning' })
          return false
        }

        this.setArrangeExam({ campus: this.campus, name: this.name })
        this.routePush({
          path: '/vx/group/business/1164/intelligentArrange/selectGrade'
        })
      },
      handleGrade(item) {
        this.setArrangeExam({ campus: this.campus, grade: item, name: this.name })
        this.routePush({
          path: '/vx/group/business/1164/intelligentArrange/selectClass',
          query: {
            title: item.name
          }
        })
      },
      handleAddSubject(grade) {
        this.setArrangeExam({ campus: this.campus, grade: grade, name: this.name })
        this.routePush({
          path: '/vx/group/business/1164/intelligentArrange/selectSubject'
        })
      },
      handleRemoveGrade(grade) {
        this.campus.datas = this.campus.datas.map(v => {
          if (grade.id === v.id) {
            v.selected = false
          }
          return v
        })
      },
      handleRemoveSubject(grade, item, i) {
        this.campus.datas = this.campus.datas.map(v => {
          if (grade.id === v.id && v.subjects) {
            v.subjects = v.subjects.filter(s => {
              return s.id !== item.id
            })
          }
          return v
        })
      },
      handleTime(grade, subject) {
        this.curGrade = grade
        this.curSubject = subject
        this.showSelectTime = true
      },
      handleClose() {
        this.curGrade = null
        this.curSubject = null
        this.showSelectTime = false
      },
      handleTimeConfirm(times) {
        let grade = this.curGrade
        let subject = this.curSubject
        this.campus.datas = this.campus.datas.map(v => {
          if (v.id === grade.id) {
            v.subjects = grade.subjects.map(s => {
              if (s.id === subject.id) {
                return { ...s, startTime: times[0], endTime: times[1] }
              }
              return s
            })
          }
          return v
        })
        this.curGrade = null
        this.curSubject = null
        this.showSelectTime = false
      },
      handleNext() {
        if (Check.isNullString(this.name)) {
          this.$message({ message: '考试名称不能为空', type: 'warning' })
          return false
        }

        if (!this.campus) {
          this.$message({ message: '请选择排考校区', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(this.grades)) {
          this.$message({ message: '排考年级不能为空', type: 'warning' })
          return false
        }

        let flag = true
        this.grades.forEach(v => {
          if (v.selected && flag) {
            if (Check.isRealArray(v.subjects)) {
              v.subjects.forEach(s => {
                if (Check.isNullString(s.startTime) || Check.isNullString(s.endTime)) {
                  this.$message({ message: '科目考试时间不能为空，请检查各科考试时间', type: 'warning' })
                  flag = false
                }
              })
            } else {
              this.$message({ message: '排考科目不能为空', type: 'warning' })
              flag = false
            }
          }
          return v
        })
        if (!flag) {
          return false
        }

        let groupIds = []
        this.grades.map(v => {
          v.classes.map(c => {
            if (c.selected) {
              groupIds.push(c.groupId)
            }
          })
        })
        Api.getArrangePlaces({
          groupIds: groupIds,
          campusId: this.campus.id
        }).then(res => {
          this.setArrangeExam({
            timeForm: {
              name: this.name,
              campus: this.campus,
              datas: this.grades,
              reexamsMap: res.reexamsMap,
              studentCount: res.studentNum,
              groupIds: groupIds
            }
          })
          this.routePush({ name: 'placeStep1164' })
        })
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteArrangeExamProp('timeForm')
          this.$router.go(-2)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tp-steps {
    padding: rem(20) rem(10);
    text-align: center;
    border-bottom: $border;

    .step-content {
      margin: 0 auto;
      display: inline-block;
      position: relative;

      i {
        position: absolute;
        border-top: $border2;
        top: 50%;
        width: 100%;
        left: 0;
      }

      span {
        display: inline-block;
        margin-left: rem(30);
        color: nth($font-color, 1);
        background: nth($background, 6);
        position: relative;
        text-align: center;
        z-index: 1;

        b {
          font-weight: normal;
          margin-right: rem(5);
          border-radius: rem(18);
          width: rem(18);
          height: rem(18);
          line-height: rem(18);
          text-align: center;
          border: $border2;
          display: inline-block;
          margin-bottom: rem(3);
        }

        &.active {
          @include fc;
        }

        &.active b {
          @include borderColor;
        }

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .btm-operate {
    padding: rem(5) 0;
  }
</style>
