<template>
  <page title="适用年级" :hasSubmit="true" @submit="submitHandle">
    <item @click="itemClick(grade)" v-if="grades.length>0" v-for="(grade, g) in grades" :key="g">
      <div slot="before"><i class="ico ico-select" :class="{'active': grade.selected}"></i></div>
      <div>{{grade.name}}</div>
    </item>
  </page>
</template>
<script>
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        grades: []
      }
    },
    computed: {
      ...mapGetters({
        cacheContent: 'getContentManage'
      })
    },
    created() {
      const that = this
      CategoryApi.getCategorys({ type: 189 }).then(res => {
        that.grades = res.categorys
        if (that.cacheContent.grades.length > 0) {
          that.cacheContent.grades.forEach(g => {
            that.grades.forEach(grade => {
              if (grade.name === g.name) {
                // that.selected = true
                that.$set(grade, 'selected', true)
              }
            })
          })
        }
      })
    },
    methods: {
      ...mapActions(['saveContentManage']),
      itemClick(grade) {
        this.$set(grade, 'selected', !grade.selected)
      },
      submitHandle() {
        let grades = this.grades.filter(grade => { return grade.selected })
        const that = this
        that.saveContentManage({
          // ...that.cacheContent,
          grades: grades
        })
        that.routeBack()
      }
    }
  }

</script>
