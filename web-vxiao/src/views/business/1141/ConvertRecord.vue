<template>
  <page title="兑奖记录" @scrollEnd="loadMore">
    <item v-for="(item,i) in list" :key="i" @click="handleItem(item, i)">
      <div slot="main">{{item.description}}&#12288;兑奖记录</div>
      <div slot="remark">{{item.count}}条未处理</div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      list: [],
      page: 1

    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      prize: 'getPrize'
    })
  },
  methods: {
    ...mapActions(['setPrize']),
    fetchData() {
      const that = this
      Api.getPrizeHistroy(this.currentGroup.parentId, that.page).then(res => {
        if (that.page > 1 && res.summarys) {
          this.list.push(...res.summarys)
        } else {
          that.list = res.summarys
        }
      })
    },
    handleItem(item, index) {
      this.setPrize({ history: item })
      this.routePush({ name: 'recordDetail1141' })
    },
    loadMore() {
      this.page += 1
      this.fetchData()
    }
  }
}

</script>
