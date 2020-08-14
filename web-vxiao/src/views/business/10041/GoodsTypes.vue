<template>
  <Page title="分类管理">
    <div v-for="(item, i) in types"
         :key="i">
      <div class="category-title text">
        {{item.name}}
        <span class="right"
              @click="handleCategory(item)">編輯</span>
      </div>
      <item @click="handleCategory(child)"
            v-for="(child, j) in item.children"
            :key="j"
            :label="child.name">
      </item>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        types: []
      }
    },
    created() {
      Api.getGoodsTypes().then(res => {
        this.types = res.mallGoodsTypes || []
      })
    },
    computed: {},
    methods: {
      ...mapActions(['setCreateObject']),
      handleCategory(item) {
        this.setCreateObject({ category: item })
        this.routePush({
          name: 'categoryEdit10041'
        })
      }
    }
  }
</script>
