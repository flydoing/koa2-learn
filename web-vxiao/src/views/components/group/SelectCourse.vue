<template>
  <Page title="科目选择"
        hasSubmit
        @submit="submit">
    <Item v-for="(course,i) in categorys"
          :key="i"
          :hasArrow="false"
          @click="handle(course)">
      <div slot="before"><i :class="prefixCls(course)" /></div>
      <div>{{course.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/category'
  export default {
    data() {
      return {
        checkList: {},
        categorys: [],
        cache: []
      }
    },
    created() {
      Api.getCategorysByType(1).then(res => {
        this.categorys = res.categorys
      })
      let caches = this.getStorage('_cache_course') || []
      caches.forEach(c => {
        this.$set(this.checkList, c.id, c)
      })
    },
    methods: {
      submit() {
        if (Object.keys(this.checkList).length === 0) {
          this.$message({ type: 'warning', message: '还未选择任何科目' })
          return
        }
        this.setStorage('_cache_course', Object.values(this.checkList))
        this.routeBack()
      },
      handle(c) {
        this.checkList[c.id] ? this.$delete(this.checkList, c.id) : this.$set(this.checkList, c.id, c)
      },
      prefixCls(course) {
        return [
          `ico ico-select`,
          {
            [`active`]: !!this.checkList[course.id]
          }
        ]
      }
    }
  }
</script>
