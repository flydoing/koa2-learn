<template>
  <page title="家访内容"
        @back="handleBack"
        listenBack>
    <div v-for="(item,i) in list"
         :key="i">
      <Question :num="i+1"
                :question="item">
      </Question>
      <div v-if="i+1!=list.length"
           class="category-title"></div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      Question: (resolve) => require(['@/views/business/1042/Question'], resolve)
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      if (this.visit.questions) {
        this.list = this.visit.questions
      }
    },
    computed: {
      ...mapGetters({
        visit: 'getHomeVisit'
      })
    },
    methods: {
      ...mapActions(['deleteHomeVisitProp']),
      handleBack() {
        this.deleteHomeVisitProp('questions')
        this.routeBack()
      }
    }
  }
</script>
