<template>
  <page title="来源"
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
    <template v-if="list.length > 0">
      <item v-for="(item,i) in list"
            :key="i"
            @click="handleItem(item)"
            :label="item.name"
            :hasArrow="false">
      </item>
    </template>
    <template v-else>
      <div class="category-title"></div>
      <item label="内部需求"
            @click="handleItem"
            :hasArrow="false"></item>
      <item v-for="(item,i) in histories"
            :key="i"
            @click="handleItem(item)"
            :label="item.name"
            :hasArrow="false">
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        keyword: '',
        hasNextPage: 0,
        page: 1,
        histories: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      this.histories = this.getStorage(`_${this.groupId}_${this.userId}_1203_sources_cache`, true) || []
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData(append) {
        Api.getSchools(this.schoolId, this.keyword, this.page).then(res => {
          if (append) {
            this.list.push(...(res.groups || []))
          } else {
            this.list = res.groups || []
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
        if (item) {
          let hMap = new Map()
          this.histories.forEach(v => {
            hMap.set(v.id, v)
          })
          if (hMap.get(item.id) === undefined) {
            this.setStorage(`_${this.groupId}_${this.userId}_1203_sources_cache`, [...this.histories, item])
          }
        }
        let source = item || { name: '内部需求', id: 0 }
        this.setCreateObject({ source: source })
        this.routeBack()
      }
    },
    watch: {
      keyword(v) {
        if (!Check.isNullString(v)) {
          this.fetchData()
        } else {
          this.list = []
        }
      }
    }
  }
</script>
