<template>
  <page title="关联学校"
        @scrollEnd="scrollEnd">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <item v-for="(item,i) in list"
          :key="i"
          @click="handleItem(item)"
          :label="item.name"
          :hasArrow="false">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        keyword: '',
        hasNextPage: 0,
        page: 1
      }
    },
    computed: {},
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCrm']),
      fetchData(append) {
        Api.getSchools(this.keyword, this.page).then(res => {
          if (append) {
            this.list.push(...(res.schools || []))
          } else {
            this.list = res.schools || []
          }
          if (res.hasNextPage > 0) {
            this.hasNextPage = res.hasNextPage
            this.page = res.currentPage
          } else {
            this.hasNextPage = 0
          }
        })
      },
      scrollEnd() {
        if (this.hasNextPage > 0) {
          this.fetchData(true)
        }
      },
      handleItem(item) {
        this.setCrm({ school: item })
        this.routeBack()
      }
    },
    watch: {
      keyword(v) {
        this.page = 1
        this.fetchData()
      }
    }
  }
</script>
