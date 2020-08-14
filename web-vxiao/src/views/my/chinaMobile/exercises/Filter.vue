<template>
  <page title="筛选">
    <item label="全部"
          @click="handleAll"></item>
    <div v-for="(item, i) in list"
         :key="i">
      <div class="category-title text"
           v-html="item.name"></div>
      <item v-for="(child, j) in item.childs"
            :key="j"
            :label="child.name"
            :remark="child.count"
            @click="handleItem(child)">
      </item>
    </div>
  </page>
</template>
<script>
  import Api from '../../api'
  export default {
    mixins: [],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      Api.getExercisesCategorys().then(res => {
        this.list = res.categorys || []
      })
    },
    methods: {
      handleItem(item) {
        this.setStorage('_exercises_categoryId', item.id)
        this.routeBack()
      },
      handleAll() {
        this.setStorage('_exercises_categoryId')
        this.routeBack()
      }
    }
  }
</script>
