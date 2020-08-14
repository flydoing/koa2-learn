<template>
  <page title="关联空间">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword"
             @keyup="handleSearch" />
    </Item>
    <item v-for="(item,i) in results"
          :key="i"
          @click="handleSelect(item, i)">
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark">{{item.count}}人</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        keyword: '',
        list: [],
        results: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setSelection']),
      fetchData() {
        const that = this
        Api.getSpaces(that.currentGroup.parentId).then(res => {
          that.list = that.results = res.spaces
        })
      },
      handleSearch() {
        if (!Check.isNullString(this.keyword)) {
          this.results = this.list.filter(v => {
            return v.name.indexOf(this.keyword) !== -1
          })
        } else {
          this.results = this.list
        }
      },
      handleSelect(item) {
        this.setSelection({ space: item })
        this.routeBack()
      }
    }
  }
</script>
