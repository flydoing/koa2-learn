<template>
  <Page title="类型选择">
    <Item v-for="category in categorys"
          :key="category.id"
          @click="handle(category)">
      <div>{{category.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return { categorys: [] }
    },
    created() {
      Api.getScreenTypes(this.routeQuery('schoolId')).then(res => {
        this.categorys = res.categories
      })
    },
    methods: {
      handle(category) {
        this.setStorage('_cache_category', category)
        this.routeBack()
      }
    }
  }
</script>
