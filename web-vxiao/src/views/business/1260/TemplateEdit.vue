<template>
  <page title="家访模板"
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="template-edit">
      <div v-for="(item,i) in list"
           :key="i">
        <Question :num="i+1"
                  :question="item"
                  @click="handleQuestion">
          <template v-if="item.isDefault == '1'"
                    slot="name">
            <div class="qi-name"><i class="ico ico-select"
                 :class="{'active': item.select}"></i><span v-html="qtName(item, i+1)"></span></div>
          </template>
        </Question>
        <div class="category-title"></div>
      </div>
      <item v-for="(item, i) in types"
            :key="i"
            :hasArrow="false"
            @click="handleAdd(item)">
        <div slot="before">
          <div class='ico ico-plus'></div>
        </div>
        <div slot="main"
             v-html="item.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      Question: resolve => require(['@/views/business/1042/Question'], resolve)
    },
    data() {
      return {
        list: [],
        types: [],
        type: {
          '1': '单选题',
          '2': '多选题',
          '3': '问答题',
          '4': '统计题',
          '5': '评分题',
          '19': '定位题'
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        visit: 'getHomeVisit'
      })
    },
    methods: {
      ...mapActions(['setHomeVisit', 'deleteHomeVisitProp']),
      qtName(item, num) {
        return `${num}、${item.title}（${this.type[item.type]}）`
      },
      fetchData() {
        const that = this
        if (that.visit.questions) {
          let qst = that.getStorage('_question_edit_cache')
          let qtIndex = that.visit.qtIndex
          let questions = [...that.visit.questions]
          if (Check.isObject(qst)) {
            if (qst.status === 'd') {
              questions.splice(qtIndex, 1)
            } else if (qst.status === '1' || qst.id) {
              questions.splice(qtIndex, 1, qst)
            } else {
              questions.push({ ...qst, status: '1' })
            }
          }
          that.list = questions
          this.deleteHomeVisitProp('qtIndex')
          this.deleteHomeVisitProp('questions')
        } else {
          Api.getQuestions(that.currentGroup.parentId).then(res => {
            if (res.questions) {
              that.list = res.questions
            }
          })
        }

        CategoryApi.getCategorysByType('137').then(res => {
          that.types = res.categorys
          that.types.push({ name: '定位题', value: '19' })
        })
      },
      handleQuestion(item, index) {
        if (item.isDefault === '1') {
          item.select = !item.select
        } else {
          this.setStorage('_question_edit_cache', item)
          this.setHomeVisit({ questions: this.list, qtIndex: index - 1 })
          this.routePush({ name: 'questionEdit1042' })
        }
      },
      handleAdd(item) {
        this.setStorage('_question_edit_type', item)
        this.setHomeVisit({ questions: this.list })
        this.routePush({ name: 'questionEdit1042' })
      },
      handleSubmit() {
        const that = this
        let qts = that.list.filter(v => {
          return v.select === undefined || v.select
        })

        let postData = {
          questions: qts.map(v => {
            let q = { ...v }
            delete q.status
            delete q.name
            if (q.type === '3') {
              q.options = [{ content: '' }]
              return q
            }
            if (!q.chartType) {
              q.chartType = q.type === '19' ? '4' : '1'
            }
            return q
          }),
          schoolId: that.currentGroup.parentId
        }

        Api.modifyQuestion(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.deleteHomeVisitProp('questions')
          that.routeBack()
        })
      },
      handleBack() {
        this.deleteHomeVisitProp('questions')
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .question-item {
    cursor: pointer;
    .qi-name {
      .ico-select,
      span {
        vertical-align: middle;
      }
      .ico-select {
        margin-right: rem(8);
      }
    }
  }
</style>
