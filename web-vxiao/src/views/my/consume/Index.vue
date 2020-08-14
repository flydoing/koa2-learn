<template>
  <Page :title="title"
        @scrollEnd="getDetails"
        :loading="loading"
        :showTips="details.length===0">
    <template v-for="(detail,i) in details">
      <div class="category-title text"
           :key="i">{{detail.month}}</div>
      <ItemList v-for="(d,j) in detail.records"
                :key="j">
        <span slot="title">{{d.remark}} {{d.tradeTime}}</span>
        <span slot="main">{{d.card}}</span>
        <span slot="remark">{{d.amount}}</span>
        <span slot="describe">{{d.balance || ''}}</span>
      </ItemList>
    </template>
  </Page>
</template>
<script>
import Api from '../api'
export default {
  data() {
    return {
      title: '消费',
      details: [],
      pageNum: 1,
      loading: true
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    getDetails() {
      if (this.pageNum > 0) {
        this.loading = true
        Api.loadConsumeDetails(this.routeParam('userId'), this.pageNum)
          .then(res => {
            this.details = this.details.concat(res.details || [])
            this.pageNum = res.pageNum
            this.loading = false
          })
          .catch((this.loading = false))
      }
    }
  }
}
</script>
