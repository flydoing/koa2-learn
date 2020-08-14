<template>
  <page title="适用年级">
    <item v-if="grades.length>0" v-for="(grade, g) in grades" :key="g" :hasClick="false">
      <div>{{grade.name}}</div>
    </item>
  </page>
</template>
<script>
  import CategoryApi from '@/api/category'
  export default {
    data() {
      return {
        grades: [],
        cacheGrades: []
      }
    },
    created() {
      const that = this
      this.cacheGrades = this.getStorage('grades')
      CategoryApi.getCategorys({ type: 189 }).then(res => {
        res.categorys.forEach(category => {
          that.cacheGrades.forEach(cache => {
            if (category.id === cache) {
              that.grades.push(category)
            }
          })
        })
      })
    }
  }

</script>
