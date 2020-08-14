<template>
  <Page :title="title"
        :hasSubmit="multiselect"
        @submit="submit">
    <Item v-for="category in categorys"
          :key="category.id"
          @click="handle(category)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':checkList[category.id]}"></i>
      </div>
      <div>{{category.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '@/api/category'
  export default {
    data() {
      return {
        multiselect: false,
        categorys: [],
        cachePlace: [],
        checkList: {}
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || '分类选择'
      }
    },
    created() {
      Api.getCategorys({
        groupId: this.routeQuery('schoold'),
        type: this.routeQuery('type')
      }).then(res => {
        this.categorys = res.categorys
      })
      // 获取缓存
      this.cacheCategory = this.getStorage('_cache_category') || []
    },
    methods: {
      handle(category) {
        if (this.multiselect) {
          this.checkList[category.id] ? this.$delete(this.checkList, category.id) : this.$set(this.checkList, category.id, category)
        } else {
          this.setStorage('_cache_categorys', category)
          if (this.routeQuery('depth')) {
            this.onPlace(category)
          } else {
            this.routeBack()
          }
        }
      },
      onPlace(category) {
        this.routePush({
          path: '/vx/group/place/select',
          query: {
            title: '场所选择',
            type: category.value,
            schoolId: this.routeQuery('groupId'),
            depth: this.routeQuery('depth')
          }
        })
      },
      submit() {
        let categorys = Object.values(this.checkList)
        if (categorys.length === 0) {
          this.$message({ type: 'warning', message: '还未选择任何数据' })
          return
        }
        this.setStorage('_cache_categorys', categorys)
        this.routeBack()
      }
    }
  }
</script>
