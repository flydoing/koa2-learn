<template>
  <Page title="新建排课"
        listenBack
        closePrompt
        @back="back">
    <label v-if="curStep.url"
           slot="btn"
           @click="handleImport">导入</label>
    <div class="top-step"
         slot="top">
      <scroller>
        <div class="tp-steps">
          <div class="step-content">
            <div class="each-step"
                 v-for="(item, i) in steps"
                 :key="i"
                 :class="{'activate':item.active, 'selected': item.selected}"
                 @click="handleStep(item)">
              <b>{{item.value}}</b>
              <div>{{item.name}}</div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
    <!--模式切换 -->
    <template v-if="curStep.value === 1">
      <ModelStep></ModelStep>
    </template>
    <template v-else>
      <!-- 不走班 -->
      <template v-if="model.type === '1'">
        <template v-if="curStep.value === 2">
          <TimeStep></TimeStep>
        </template>
        <template v-else-if="curStep.value === 3">
          <SubjectStep :timeStamp.sync="timeStamp"
                       :maxHeight="maxHeight"></SubjectStep>
        </template>
        <template v-else-if="curStep.value === 4">
          <ClassStep :timeStamp.sync="timeStamp"
                     :maxHeight="maxHeight"></ClassStep>
        </template>
        <template v-else-if="curStep.value === 5">
          <TeacherStep :timeStamp.sync="timeStamp"
                       :maxHeight="maxHeight"></TeacherStep>
        </template>
        <template v-else-if="curStep.value === 6">
          <TeachStep :timeStamp.sync="timeStamp"
                     :maxHeight="maxHeight"></TeachStep>
        </template>
        <template v-else-if="curStep.value === 7">
          <RoomStep :timeStamp.sync="timeStamp"></RoomStep>
        </template>
        <template v-else-if="curStep.value === 8">
          <RuleStep :timeStamp.sync="timeStamp"
                    :maxHeight="maxHeight"></RuleStep>
        </template>
      </template>
      <!-- 大走班 -->
      <template v-else>
        <template v-if="curStep.value === 2">
          <TimeStep></TimeStep>
        </template>
        <template v-else-if="curStep.value === 3">
          <SubjectStep :timeStamp.sync="timeStamp"
                       :maxHeight="maxHeight"></SubjectStep>
        </template>
        <template v-else-if="curStep.value === 4">
          <PeriodStep :timeStamp.sync="timeStamp"
                      :maxHeight="maxHeight"></PeriodStep>
        </template>
        <template v-else-if="curStep.value === 5">
          <ClassStep :timeStamp.sync="timeStamp"
                     :maxHeight="maxHeight"></ClassStep>
        </template>
        <template v-else-if="curStep.value === 6">
          <TeacherStep :timeStamp.sync="timeStamp"
                       :maxHeight="maxHeight"></TeacherStep>
        </template>
        <template v-else-if="curStep.value === 7">
          <TeachStep :timeStamp.sync="timeStamp"
                     :maxHeight="maxHeight"></TeachStep>
        </template>
        <template v-else-if="curStep.value === 8">
          <ElectiveStep :timeStamp.sync="timeStamp"
                        :refresh.sync="curStep.refresh"
                        :maxHeight="maxHeight"></ElectiveStep>
        </template>
        <template v-else-if="curStep.value === 9">
          <RoomStep :timeStamp.sync="timeStamp"></RoomStep>
        </template>
        <template v-else-if="curStep.value === 10">
          <RuleStep :timeStamp.sync="timeStamp"
                    :maxHeight="maxHeight"></RuleStep>
        </template>
      </template>
    </template>
    <div slot="bottom"
         class="btm-operate">
      <el-row v-if="isRule">
        <el-col :span="12">
          <div class="button button-common"
               :class="{'disabled': ruleDisabled}"
               @click="handleRuleSet">设置规则</div>
        </el-col>
        <el-col :span="12">
          <div class="button button-common"
               @click="handlePreview">预排课表</div>
        </el-col>
      </el-row>
      <div v-else
           class="button button-common"
           @click="handleNext">下一步</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      ModelStep: resolve => require(['@/views/business/1147/modelStep/Index'], resolve),
      TimeStep: resolve => require(['@/views/business/1147/timeStep/Index'], resolve),
      SubjectStep: resolve => require(['@/views/business/1147/subjectStep/Index'], resolve),
      ClassStep: resolve => require(['@/views/business/1147/classStep/Index'], resolve),
      TeacherStep: resolve => require(['@/views/business/1147/teacherStep/Index'], resolve),
      TeachStep: resolve => require(['@/views/business/1147/teachStep/Index'], resolve),
      RoomStep: resolve => require(['@/views/business/1147/roomStep/Index'], resolve),
      RuleStep: resolve => require(['@/views/business/1147/ruleStep/Index'], resolve),
      PeriodStep: resolve => require(['@/views/business/1147/periodStep/Index'], resolve),
      ElectiveStep: resolve => require(['@/views/business/1147/electiveStep/Index'], resolve)
    },
    data() {
      return {
        stepObj: {
          time: {
            name: '教学时间',
            value: 2,
            selected: false,
            active: false
          },
          subject: {
            name: '科目信息',
            value: 3,
            selected: false,
            active: false
          },
          cls: {
            name: '班级信息',
            value: 4,
            template: '/static/templates/arrangingClass.xlsx',
            url: `/rest/courseschedule/class/import`,
            ingoreUrl: `/rest/courseschedule/class/importByFileId`,
            selected: false,
            active: false
          },
          period: {
            name: '选修时段',
            value: 4,
            selected: false,
            active: false
          },
          teacher: {
            name: '老师信息',
            value: 5,
            template: '/static/templates/arrangingTeacher.xlsx',
            url: `/rest/courseschedule/teacher/import`,
            ingoreUrl: `/rest/courseschedule/teacher/importByFileId`,
            selected: false,
            active: false
          },
          teach: {
            name: '必修任教',
            value: 6,
            template: `/rest/courseschedule/course/allocation/templet`,
            url: `/rest/courseschedule/course/allocation/import`,
            ingoreUrl: `/rest/courseschedule/course/allocation/importByFileId`,
            selected: false,
            active: false
          },
          elective: {
            name: '选修任教',
            value: 8,
            selected: false,
            active: false
          },
          room: {
            name: '课室信息',
            value: 7,
            template: `/static/templates/arrangingPlace.xlsx`,
            url: `/rest/courseschedule/place/import`,
            ingoreUrl: `/rest/courseschedule/place/importByFileId`,
            selected: false,
            active: false
          },
          rule: {
            name: '规则预设',
            value: 8,
            selected: false,
            active: false
          }
        },
        steps: [
          {
            name: '选择模式',
            value: 1,
            selected: true,
            active: false
          }
        ],
        form: {},
        maxHeight: 0,
        timeStamp: 0
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      curStep() {
        let step = this.steps.filter(v => {
          return v.selected
        })[0]
        return step || this.steps[0]
      },
      isRule() {
        let model = this.model || {}
        let step = this.curStep || {}
        return (model.type === '1' && step.value === 8) || (model.type === '3' && step.value === 10)
      },
      ruleDisabled() {
        let data = this.obj.form.ruleData || {}
        return !Check.isRealArray(data.rules)
      },
      model() {
        let form = this.obj.form || {}
        let data = form.modelData || {}
        return data.curModel
      }
    },
    activated() {
      this.timeStamp = new Date().getTime()
      if (this.obj.form) {
        this.form = { ...this.obj.form }
      } else {
        this.setCreateObject({ form: this.form })
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleStep(item) {
        if (!item.active) {
          return false
        }
        this.steps = this.steps.map(v => {
          if (v.value === item.value) {
            if (v.value === 8 && this.model.type === '3') {
              v.refresh = false
            }
            v.selected = true
          } else {
            v.selected = false
          }
          return v
        })
      },
      // 更新步骤状态
      updateStepStatus() {
        let step = this.curStep
        this.steps = this.steps.map(v => {
          if (v.value === step.value + 1) {
            if (v.value === 8 && this.model.type === '3') {
              v.refresh = true
            }
            v.active = true
            v.selected = true
          } else {
            v.selected = false
          }
          return v
        })
      },
      // （1）模式步骤提交
      modelStepCommit(form) {
        let modelData = form.modelData
        let type = modelData.curModel.type
        if (!Check.isRealArray(modelData.datas)) {
          this.$message({ message: '请选择排课模式', type: 'warning' })
          return false
        }

        let postData = {
          schoolId: this.currentGroup.parentId,
          type: type
        }

        if (type === '1') {
          postData = {
            ...postData,
            grades: modelData.datas.map(v => {
              return {
                groupId: v.groupId,
                groupName: `${v.campus || ''}${v.name}`
              }
            })
          }
        } else {
          postData = {
            ...postData,
            grades: [{ groupId: modelData.datas[0].groupId }],
            projectId: modelData.datas[0].id
          }
        }

        Api.saveScheduleData({
          schedule: postData
        }).then(res => {
          this.setCreateObject({
            form: {
              ...form,
              schedule: res.schedule
            }
          })
          this.updateStepStatus()
        })
      },
      handleRuleSet() {
        if (this.ruleDisabled) {
          return false
        }
        this.routePush({ path: '/vx/group/business/1147/ruleStep/rules' })
      },
      handlePreview() {
        this.routePush({ path: '/vx/group/business/1147/preview' })
      },
      handleImport() {
        const that = this
        let step = this.curStep
        let tempUrl = step.template
        if (step.value === 6 || step.value === 7) {
          tempUrl = `${tempUrl}?schoolId=${this.schoolId}`
        }
        this.$import({
          title: '导入',
          uploadURI: `${step.url}?schoolId=${this.schoolId}&userId=${this.userId}`,
          templateUrl: tempUrl,
          callback: (res, file) => {
            if (res.code === '1') {
              that.$message({ message: '操作成功', type: 'success' })
              that.timeStamp = new Date().getTime()
            } else if (res.commonTable) {
              let tbl = res.commonTable
              that.setStorage('_import_receipt', { lines: tbl.lines, headers: tbl.headers })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: `${step.ingoreUrl}?schoolId=${this.schoolId}&userId=${this.userId}`,
                  fileId: res.fileId
                }
              })
            } else if (res.errors) {
              if (res.errors.length < 10) {
                this.$message({
                  dangerouslyUseHTMLString: true,
                  message: res.errors.join('<br>'),
                  type: 'error'
                })
              } else {
                let errors = res.errors.slice(0, 10)
                this.$message({
                  dangerouslyUseHTMLString: true,
                  message: `${errors.join('<br>')}<br>......`,
                  type: 'error'
                })
              }
            }
          }
        })
      },
      handleNext() {
        let model = this.model
        let step = this.curStep
        let stepObj = this.stepObj
        if (model.type === '1' && step.value === 1) {
          this.steps.push(stepObj['time'], stepObj['subject'], stepObj['cls'], stepObj['teacher'], stepObj['teach'], stepObj['room'], stepObj['rule'])
        } else if (step.value === 1) {
          this.steps.push(
            stepObj['time'],
            stepObj['subject'],
            stepObj['period'],
            { ...stepObj['cls'], value: 5 },
            { ...stepObj['teacher'], value: 6 },
            { ...stepObj['teach'], value: 7 },
            stepObj['elective'],
            { ...stepObj['room'], value: 9 },
            { ...stepObj['rule'], value: 10 }
          )
        }

        if (step.value === this.steps.length) {
          return false
        }

        let form = this.obj.form
        if (step.value === 1) {
          let result = this.modelStepCommit(form)
          if (!result) {
            return false
          }
        } else {
          this.updateStepStatus()
        }
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.modifyCreateObjectField('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .top-step {
    border-bottom: $border;
  }
  .tp-steps {
    padding: rem(20) rem(10);
    text-align: center;

    .step-content {
      position: relative;
      @include flex;
      @include jc(flex-start);
      @include ai;
      white-space: nowrap;

      i {
        position: absolute;
        border-top: $border2;
        top: 50%;
        width: 118%;
        left: 0;
      }

      .each-step {
        @include flex;
        @include jc;
        @include ai;
        flex-direction: column;
        margin-left: rem(30);
        color: nth($font-color, 1);
        background: nth($background, 6);
        position: relative;
        text-align: center;
        z-index: 1;
        color: #999;
        cursor: pointer;

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
          border-color: #999;
        }

        &.selected {
          color: nth($font-color, 2) !important;
        }

        &.selected b {
          border-color: nth($font-color, 2) !important;
        }

        &.activate {
          color: #333;
        }

        &.activate b {
          border-color: #333;
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
