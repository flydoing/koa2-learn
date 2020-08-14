<template>
  <Page :title="title"
        listenBack
        closePrompt
        @back="back"
        :hasSubmit="curStep.value !== 1"
        @submit="handleSave">
    <template slot="btn">
      <label v-if="caseId"
             @click="handleRemove">删除</label>
      <label v-if="curStep.value === 1"
             @click="handleNext">下一步</label>
    </template>

    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span v-for="(item, i) in steps"
              :key="i"
              :class="{'active': item.selected}"><b>{{item.value}}</b><br>{{item.name}}</span>
        <i></i>
      </div>
    </div>
    <template v-if="obj.form">
      <template v-if="curStep.value === 1">
        <SignStep :timeStamp.sync="timeStamp"
                  @set="handleSet"></SignStep>
      </template>
      <template v-else>
        <VolunteerStep v-if="needSet"
                       :timeStamp.sync="timeStamp"></VolunteerStep>
        <AssessStep v-else
                    :timeStamp.sync="timeStamp"></AssessStep>
      </template>
    </template>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import MixinMessage from '@/views/group/mixinMessage'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {
      SignStep: resolve => require(['@/views/business/1300/signStep/Index'], resolve),
      VolunteerStep: resolve => require(['@/views/business/1300/volunteerStep/Index'], resolve),
      AssessStep: resolve => require(['@/views/business/1300/assessStep/Index'], resolve)
    },
    data() {
      return {
        stepObj: {
          sign: {
            name: '报名题目',
            value: 1,
            selected: true
          },
          volunteer: {
            name: '志愿设置',
            value: 2,
            selected: false
          },
          assess: {
            name: '评估题目',
            value: 2,
            selected: false
          }
        },
        steps: [
          {
            name: '报名题目',
            value: 1,
            selected: true
          }
        ],
        maxHeight: 0,
        timeStamp: 0
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      caseId() {
        return this.routeQuery('formId')
      },
      curStep() {
        let step = this.steps.filter(v => {
          return v.selected
        })[0]
        return step || this.steps[0]
      },
      cache() {
        return this.obj.caseCache
      },
      title() {
        return this.caseId !== undefined ? '编辑招生方案' : '新建招生方案'
      },
      needSet() {
        let form = this.obj.form || {}
        let sData = form.signData || {}
        return sData.set === '1'
      }
    },
    activated() {
      let form = this.obj.form
      if (!form && this.caseId) {
        Api.getCaseDetail(this.caseId).then(res => {
          if (res.form) {
            let cache = res.form
            let sData = {
              id: cache.id || void 0,
              name: cache.title || '',
              set: cache.hasAspiration,
              removeItems: []
            }
            if (Check.isRealArray(cache.questions)) {
              sData.items = cache.questions.map(v => {
                let it = {
                  id: v.id,
                  name: v.title,
                  type: { name: v.typeName, value: v.type },
                  default: v.isDefault
                }
                if (v.type === '8' || v.type === '7') {
                  it.options = v.options.map(o => {
                    return { ...o, content: o.title }
                  })
                }
                if (v.type === '8') {
                  it.up = v.maxSelect
                  it.down = v.minSelect
                }
                return it
              })
            }
            let vData = void 0
            let aData = void 0
            let asp = cache.aspiration
            if (cache.hasAspiration === '1') {
              vData = {
                id: asp.id,
                title: asp.title,
                type: asp.isMultiple === '1' ? { name: '多选', value: '1' } : { name: '单选', value: '0' }
              }
              if (asp.isMultiple === '1') {
                vData.up = asp.maxSelect
                vData.down = asp.minSelect
              }
              if (Check.isRealArray(asp.children)) {
                vData.items = asp.children.map(v => {
                  let it = {
                    id: v.id,
                    name: v.title,
                    questions: []
                  }
                  it.questions = this.getQuestions(v.questions)
                  return it
                })
              }
            } else if (asp) {
              let it = asp.children[0]
              aData = {
                id: it.id,
                datas: this.getQuestions(it.questions)
              }
            }
            if (cache.hasAspiration === '1') {
              this.steps = [this.stepObj['sign'], this.stepObj['volunteer']]
            } else {
              this.steps = [this.stepObj['sign'], this.stepObj['assess']]
            }
            this.setCreateObject({ form: { signData: sData, volunteerData: vData, assessData: aData } })
          }
        })
      } else if (!form) {
        this.steps = [this.stepObj['sign'], this.stepObj['volunteer']]
        this.setCreateObject({ form: {} })
      }
      this.timeStamp = new Date().getTime()
    },
    methods: {
      ...mapActions(['setCreateObject']),
      // 初始化题型集合数据
      getQuestions(datas) {
        if (Check.isRealArray(datas)) {
          return datas.map(q => {
            let qst = {
              id: q.id,
              title: q.title,
              type: { name: q.typeName, value: q.type }
            }
            if (q.type === '8' || q.type === '7') {
              qst.options = q.options.map(o => {
                return { ...o, content: o.title }
              })
            }
            if (q.type === '8') {
              qst.up = q.maxSelect
              qst.down = q.minSelect
            }
            return qst
          })
        }
        return []
      },
      // 转换题型提交数据
      convertQtData(data, index) {
        let tpValue = data.type.value
        let qst = {
          id: Check.isNumber(data.id) ? data.id : void 0,
          title: data.title,
          type: tpValue,
          sort: index + 1,
          status: data.status || '1'
        }
        if (tpValue === '7' || tpValue === '8') {
          qst.options = data.options.map(o => {
            return { id: o.id || void 0, title: o.content, score: o.score }
          })
        }
        if (tpValue === '8') {
          qst.maxSelect = data.up
          qst.minSelect = data.down
        }
        return qst
      },
      handleSet() {
        let sData = this.obj.form.signData
        let steps = [this.stepObj['sign']]
        if (sData.set === '1') {
          steps.push(this.stepObj['volunteer'])
        } else {
          steps.push(this.stepObj['assess'])
        }
        this.steps = steps
      },
      handleNext() {
        let step = this.curStep
        let form = this.obj.form
        if (step.value === 1) {
          let sData = form.signData || {}
          if (Check.isNullString(sData.name)) {
            this.$message({ type: 'warning', message: '方案名称不能为空' })
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
      handleSave() {
        let form = this.obj.form
        let sData = form.signData
        let vData = form.volunteerData
        let aData = form.assessData
        let postData = {
          id: this.caseId || void 0,
          schoolId: this.schoolId,
          title: sData.name,
          hasAspiration: sData.set
        }
        let items = []
        sData.items.forEach((v, i) => {
          let tpValue = v.type.value
          let it = {
            id: Check.isNumber(v.id) ? v.id : void 0,
            title: v.name,
            isDefault: v.default || void 0,
            sort: i + 1,
            type: tpValue
          }
          if (tpValue === '8' || tpValue === '7') {
            it.options = v.options.map(o => {
              return { id: o.id || void 0, title: o.content, score: o.score }
            })
          }
          if (v.type === '8') {
            it.maxSelect = v.up
            it.minSelect = v.down
          }
          items.push(it)
        })
        postData.questions = [...items, ...(sData.removeItems || [])]

        if (this.needSet) {
          if (Check.isNullString(vData.title)) {
            this.$message({ type: 'warning', message: '标题不能为空' })
            return false
          }
          if (!Check.isRealArray(vData.items) || vData.items.length < 2) {
            this.$message({ type: 'warning', message: '至少设置两个志愿选项' })
            return false
          }
          let tpValue = vData.type.value
          let asp = {
            id: vData.id || void 0,
            title: vData.title,
            isMultiple: tpValue
          }
          if (tpValue === '1') {
            asp.maxSelect = vData.up
            asp.minSelect = vData.down
          }
          asp.children = vData.items.map(v => {
            let it = {
              id: Check.isNumber(v.id) ? v.id : void 0,
              title: v.name,
              questions: [],
              status: v.status || '1'
            }
            if (Check.isRealArray(v.questions)) {
              let qsts = []
              v.questions.forEach((q, i) => {
                qsts.push(this.convertQtData(q, i))
              })
              it.questions = qsts
            }
            return it
          })
          postData.aspiration = asp
        } else if (Check.isRealArray(aData.datas)) {
          let qsts = []
          aData.datas.forEach((q, i) => {
            qsts.push(this.convertQtData(q, i))
          })
          postData.aspiration = {
            children: [{ id: aData.id || void 0, questions: qsts }]
          }
        }

        Api.modifyCase({ form: postData }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该方案？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyCase({
            form: {
              id: this.caseId,
              status: 'd',
              schoolId: this.schoolId
            }
          }).then(res => {
            this.$message({ type: 'success', message: '操作成功' })
            this.routeBack()
          })
        })
      },
      back() {
        let step = this.curStep
        if (step.value !== 1) {
          this.steps = this.steps.map(v => {
            if (v.value === step.value - 1) {
              v.selected = true
            } else {
              v.selected = false
            }
            return v
          })
          return false
        } else {
          this.$confirm('是否取消当前操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
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
</style>
