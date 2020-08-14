<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="question-edit">
      <keep-alive>
        <EditorSimple v-model="question.title"
                      placeholder="标题"
                      :store.sync="question"
                      :toolbars="['photo', 'file']" />
      </keep-alive>
      <template v-if="question.type==1 || question.type==4">
        <div v-for="(item,i) in question.options"
             :key="i">
          <div class="category-title"></div>
          <keep-alive>
            <EditorSimple :store.sync="question.options[i]"
                          placeholder="选项内容"
                          :toolbars="['photo', 'file']" />
          </keep-alive>
          <template v-if="question.type==4">
            <item :hasClick="false">
              <div slot="main">分值</div>
              <input slot="remark"
                     placeholder="必填"
                     v-model="item.score" />
            </item>
          </template>
        </div>
        <div class="category-title"></div>
        <item @click="handleAddOption"
              :hasArrow="false">
          <div slot="before">
            <div class='vx-item-icon plus-light-Icon'></div>
          </div>
          <div slot="main">添加选项</div>
        </item>
      </template>
      <template v-if="question.type==5">
        <div class="category-title"></div>
        <div v-for="(item,i) in question.options"
             :key="i">
          <item :hasClick="false">
            <div slot="main">最高分</div>
            <input slot="remark"
                   placeholder="必填"
                   v-model="item.score" />
          </item>
        </div>
      </template>
      <div v-if="appraisal.question"
           class="button button-common"
           @click="handleRemove">删除题目</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R, MixinMessage],
    data() {
      return {
        question: {
          title: '',
          medias: [],
          options: []
        }
      }
    },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getTeacherAppraisal'
      }),
      title() {
        if (this.question.id) {
          return `编辑题目`
        }
        let type = this.question.type
        if (type === '1') {
          return '新建选择题'
        }
        if (type === '4') {
          return '新建选择题（计分）'
        }
        if (type === '5') {
          return '新建评分题'
        }
        return '新建问答题'
      }
    },
    methods: {
      ...mapActions(['setTeacherAppraisal']),
      fetchData() {
        const that = this
        if (that.appraisal.question) {
          that.question = JSON.parse(JSON.stringify(that.appraisal.question))
        } else {
          let tp = that.appraisal.type
          that.question = { ...that.question, type: tp.value }

          if (tp.value === '1' || tp.value === '4') {
            for (let i = 0; i < 3; i++) {
              let op = { content: '', medias: [] }
              tp.value === '4' && (op.score = '')
              that.question.options.push(op)
            }
          } else if (tp.value === '5') {
            that.question.options.push({ score: '' })
          }
        }
      },
      handleAddOption() {
        let op = { content: '', medias: [] }
        this.question.type === '4' && (op.score = '')
        this.question.options.push(op)
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该题目', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            let aplCase = JSON.parse(JSON.stringify(that.appraisal.aplCase))
            let index = that.appraisal.qtIndex

            aplCase.questions.splice(index, 1)

            that.setTeacherAppraisal({ aplCase: { ...aplCase } })
            that.routeBack()
          })
      },
      handleSubmit() {
        const that = this
        let aplCase = JSON.parse(JSON.stringify(that.appraisal.aplCase))
        let index = that.appraisal.qtIndex

        let qt = that.question
        if (Check.isNullString(qt.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        let qts = aplCase.questions
        if (qt.type === '1') {
          let opts = that.question.options.filter(v => {
            return !Check.isNullString(v.content) || !Check.isRealArray(v.medias)
          })
          if (opts.length < 2) {
            that.$message({ message: '选择题不能少于两个选项', type: 'warning' })
            return false
          }
          qts[index] ? (qts[index] = { ...qt, options: opts }) : qts.push({ ...qt, options: opts })
        } else if (qt.type === '4') {
          let flag = true
          let opts = []
          that.question.options.map(v => {
            if ((!Check.isNullString(v.content) || !Check.isRealArray(v.medias)) && !Check.isNullString(v.score)) {
              opts.push(v)
            } else if (
              (Check.isNullString(v.content) && !Check.isRealArray(v.medias) && !Check.isNullString(v.score)) ||
              ((!Check.isNullString(v.content) || Check.isRealArray(v.medias)) && Check.isNullString(v.score))
            ) {
              flag = false
            }
          })

          if (opts.length < 2) {
            that.$message({ message: '选择题（计分）不能少于两个选项', type: 'warning' })
            return false
          }

          if (!flag) {
            that.$message({ message: '存在未填的选项内容/分值', type: 'warning' })
            return false
          }

          qts[index] ? (qts[index] = { ...qt, options: opts }) : qts.push({ ...qt, options: opts })
        } else {
          if (qt.type === '5') {
            let score = qt.options[0].score
            if (Check.isNullString(score)) {
              that.$message({ message: '最高分值不能为空', type: 'warning' })
              return false
            }
            if (parseInt(score) < 1) {
              that.$message({ message: '最高分值不能小于1', type: 'warning' })
              return false
            }
          }
          qts[index] ? (qts[index] = { ...qt }) : qts.push({ ...qt })
        }

        that.setTeacherAppraisal({ aplCase: { ...aplCase, questions: qts } })
        that.routeBack()
      }
    }
  }
</script>
