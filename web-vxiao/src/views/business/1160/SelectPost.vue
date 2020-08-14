<template>
  <page title="选择职位"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
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
        mien: 'getTeacherMien'
      })
    },
    methods: {
      ...mapActions(['setTeacherMien']),
      fetchData() {
        const that = this

        let caches = that.mien.posts
        let pMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            pMap.set(v.id, v)
          })
        }

        CategoryApi.getCategorysByType('106').then(res => {
          that.list = res.categorys.map(v => {
            if (pMap.get(v.id)) {
              v.selected = true
            } else {
              v.selected = false
            }
            return v
          })
        })
      },
      handleSubmit() {
        let posts = this.list.filter(v => {
          return v.selected
        })
        if (posts.length < 1) {
          this.$message({ message: '请选择职务', type: 'warning' })
          return false
        }
        this.setTeacherMien({ posts: posts })
        this.routeBack()
      },
      handleSelect(item, index) {
        item.selected = !item.selected
      }
    }
  }
</script>
