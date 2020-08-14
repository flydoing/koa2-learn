<template>
  <Page title="报名结果">
    <Item :hasClick="false"
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i></div>
      <input placeholder="搜索"
             v-model="keyword"
             @keyup.enter="handleSearch" />
    </Item>
    <item v-for="(item,i) in types"
          :key="i"
          @click="handleResult(item, i)"
          :label="item.name"
          :remark="item.count">
    </item>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        types: [],
        keyword: ''
      }
    },
    computed: {
      msgId() {
        return this.routeQuery('msgId')
      }
    },
    created() {
      Api.getTypes(this.msgId).then(res => {
        this.types = res.admissionSummarys || []
      })
    },
    methods: {
      handleResult(item, i) {
        this.routePush({
          path: '/vx/group/business/1300/result/members',
          query: {
            msgId: this.msgId,
            type: item.type
          }
        })
      },
      handleSearch() {}
    }
  }
</script>
