<template>
  <page title="错题本"
        @scrollEnd="scrollEnd"
        :showTips="questions.length < 1">
    <label slot="btn"
           @click="handleFilter">筛选</label>
    <div slot="top"
         class="category-title text">共{{total}}题</div>
    <Questions :questions="questions"
               @analysis="handleAnalysis"></Questions>
  </page>
</template>
<script>
  import Api from '../../api'
  export default {
    mixins: [],
    components: {
      Questions: resolve => require(['@/views/components/question/List'], resolve)
    },
    data() {
      return {
        questions: [],
        hasNextPage: 0,
        page: 1,
        categoryId: 0,
        total: 0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(append) {
        this.categoryId = this.getStorage('_exercises_categoryId')
        Api.getQuestions(this.page, this.categoryId).then(res => {
          this.total = res.count || 0
          if (append) {
            this.questions.push(...(res.questions || []))
          } else {
            this.questions = res.questions || []
          }
          if (res.hasNextPage > 0) {
            this.hasNextPage = res.hasNextPage
            this.page = res.currentPage
          } else {
            this.hasNextPage = 0
          }
        })
      },
      handleFilter() {
        if (this.categoryId) {
          this.setStorage('_exercises_categoryId', this.categoryId)
        }
        this.routePush({
          path: '/vx/user/exercises/filter'
        })
      },
      scrollEnd() {
        if (this.hasNextPage > 0) {
          this.fetchData(true)
        }
      },
      handleAnalysis(question) {
        this.setStorage('_question_cache', question)
        this.routePush({
          path: '/vx/user/exercises/analysis'
        })
      }
    }
  }
</script>
