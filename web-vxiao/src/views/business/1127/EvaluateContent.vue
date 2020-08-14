<template>
  <page title="评价内容"
        @add="handleAdd"
        :hasAdd="true">
    <div class="evaluate-content">
      <div v-for="(item, i) in list"
           :key="i">
        <div class="category-title text">{{item.name}}<span class="right ec-edit"
                @click="handleItem(item)">编辑</span></div>
        <item v-for="(child, j) in item.childs"
              :key="j"
              :hasClick="false">
          <div slot="main"
               v-html="child.name"></div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        evaluate: 'getCourseEvaluate'
      })
    },
    methods: {
      ...mapActions(['setCourseEvaluate']),
      fetchData() {
        const that = this
        Api.getCatgeories(that.currentGroup.groupId).then(res => {
          that.list = res.items || []
        })
      },
      handleAdd() {
        this.setCourseEvaluate({ category: null })
        this.routePush({ name: 'categoryEdit1127' })
      },
      handleItem(item) {
        this.setCourseEvaluate({ category: item })
        this.routePush({ name: 'categoryEdit1127' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .evaluate-content {
    .ec-edit {
      cursor: pointer;
    }
  }
</style>
