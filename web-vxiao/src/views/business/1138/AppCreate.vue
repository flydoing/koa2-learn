<template>
  <Page title="新建选课"
        listenBack
        closePrompt
        @back="back">
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span v-for="(item, i) in steps"
              :key="i"
              :class="{'active': item.selected}"><b>{{item.value}}</b><br>{{item.name}}</span>
        <i></i>
      </div>
    </div>
    <template v-if="curStep.value === 1">
      <ObjectStep></ObjectStep>
    </template>
    <template v-else-if="curStep.value === 2">
      <SubjectStep></SubjectStep>
    </template>
    <template v-else>
      <setStep :timeStamp.sync="timeStamp"></setStep>
    </template>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           v-if="curStep.value !== 3"
           @click="handleNext">下一步</div>
      <div class="button button-common"
           v-else
           @click="handlePublish">发布</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import MixinMessage from '@/views/group/mixinMessage'
  import DateUtils from '@/utils/date'
  // import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      ObjectStep: resolve => require(['@/views/business/1138/objectStep/Index'], resolve),
      SubjectStep: resolve => require(['@/views/business/1138/subjectStep/Index'], resolve),
      SetStep: resolve => require(['@/views/business/1138/setStep/Index'], resolve)
    },
    data() {
      return {
        steps: [
          {
            name: '选课对象',
            value: 1,
            selected: true
          },
          {
            name: '选修科目',
            value: 2,
            selected: false
          },
          {
            name: '选课设置',
            value: 3,
            selected: false
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
      handleNext() {
        let step = this.curStep
        let form = this.obj.form
        if (step.value === 1) {
          let oData = form.objectData || {}
          if (!oData.grade) {
            this.$message({ type: 'warning', message: '请选择选课对象' })
            return false
          }
        } else if (step.value === 2) {
          let sData = form.subjectData || {}
          let subjects = (sData.datas || []).filter(v => {
            return v.selected
          })
          if (!Check.isRealArray(subjects)) {
            this.$message({ type: 'warning', message: '请选择选课科目' })
            return false
          }
        }
        this.steps = this.steps.map(v => {
          if (v.value === step.value + 1) {
            v.selected = true
          } else {
            v.selected = false
          }
          return v
        })
      },
      handlePublish() {
        let form = this.obj.form
        let oData = form.objectData
        let sData = form.subjectData
        let sets = form.setData.setItems
        if (Check.isNullString(sets.name)) {
          this.$message({ type: 'warning', message: '选课名称不能为空' })
          return false
        }
        if (Check.isNullString(sets.startTime)) {
          this.$message({ type: 'warning', message: '开始时间不能为空' })
          return false
        }
        if (Check.isNullString(sets.endTime)) {
          this.$message({ type: 'warning', message: '结束时间不能为空' })
          return false
        }
        if (new Date(sets.startTime).getTime() > new Date(sets.endTime).getTime()) {
          this.$message({ type: 'warning', message: '开始时间不能大于结束时间' })
          return false
        }
        if (!Check.isNumber(sets.count)) {
          this.$message({ type: 'warning', message: '科目要求不能为空/输入有误' })
          return false
        }
        if (!sets.exam) {
          this.$message({ type: 'warning', message: '请选择关联成绩分析' })
          return false
        }

        let subjects = (sData.datas || []).filter(v => {
          return v.selected
        })

        let mJson = JSON.stringify({
          name: sets.name,
          startTime: DateUtils.format_0800(sets.startTime),
          endTime: DateUtils.format_0800(sets.endTime),
          groupId: oData.grade.groupId,
          groupName: oData.grade.name,
          num: sets.count,
          examId: sets.exam.id,
          subjects: subjects.map(v => {
            return {
              subjectId: v.categoryId
            }
          }),
          description: sets.content
        })

        let postData = this.constructionMessage({
          groupId: this.groupId,
          type: '1138',
          msgJson: mJson
        })

        this.addMessage(postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.modifyCreateObjectField('form')
          this.routeBack()
        })
      },
      back() {
        let step = this.curStep
        // let form = this.obj.form
        if (step.value === 3) {
          this.steps = this.steps.map(v => {
            if (v.value === 2) {
              v.selected = true
            } else {
              v.selected = false
            }
            return v
          })
          return false
        } else if (step.value === 2) {
          this.steps = this.steps.map(v => {
            if (v.value === 1) {
              v.selected = true
            } else {
              v.selected = false
            }
            return v
          })
          return false
        } else if (step.value === 1) {
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
