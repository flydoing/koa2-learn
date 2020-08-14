<template>
  <page title="目录">
    <item v-if="categorys.length>0" v-for="(category, c) in categorys" :key="c" @click="itemClick(category)">
      <div>{{category.name}}</div>
    </item>
  </page>
</template>
<script>
  import Api from '@/views/business/1073/api'
  import G from '@/views/group/mixin'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        categorys: []
      }
    },
    computed: {
      ...mapGetters({
        cachePraxis: 'getPraxis'
      })
    },
    created() {
      Api.getResourceCatalogues({
        groupId: this.currentGroup.groupId,
        isCount: 0,
        isGlobal: 1,
        isSerial: 1
      }).then(res => {
        this.categorys = res.categorys
      })
    },
    methods: {
      ...mapActions(['savePraxis']),
      itemClick(category) {
        if (this.routeQuery('index')) {
          let questions = JSON.parse(JSON.stringify(this.cachePraxis.questions))
          questions.splice(this.routeQuery('index') - 1, 1, { ...questions[this.routeQuery('index') - 1],
            curCategory: category
          })
          this.savePraxis({
            questions: questions
          })
          this.routeBack()
        } else {
          this.savePraxis({
            curCategory: category
          })
          this.routeBack()
        }
      }
    }
  }

</script>
