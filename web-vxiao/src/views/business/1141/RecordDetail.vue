<template>
  <page :title="title" @scrollEnd="loadMore">
    <Tabs @click="handleType" :showBtns="types.length > 1" :value="typeValue">
      <TabPane v-for="(item,i) in types" :key="i" :label="item.name" :name="i" :currentData="item"></TabPane>
    </Tabs>
    <item v-for="(item,i) in list" :key="i" @click="handleRecord(item, i)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':item.selected}"></i>
      </div>
      <div slot="main">{{item.userName}}&#12288;{{item.groupName}}</div>
      <div slot="remark">兑奖{{item.prizeName}}&#12288;<span class="text-color">取消兑换</span></div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'
import Tabs from '@/components/tab/Tab'
import TabPane from '@/components/tab/TabPane'

export default {
  mixins: [R],
  components: {
    Tabs,
    TabPane
  },
  data() {
    return {
      types: [{
        name: '未处理',
        value: '1',
        selected: false
      }, {
        name: '已处理',
        value: '2',
        selected: false
      }],
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
      let history = that.prize.history.startDate
      let type = that.types.filters(v => { return v.selected })[0]
      if (!type) {
        that.types = that.types.map(v => {
          v.value === '1' && (v.selected = true)
          return v
        })
        type = that.types[0]
      }
      Api.getRecordList(that.currentGroup.parentId, history.startDate, history.endDate, type.value, that.page).then(res => {
        if (that.page > 1 && res.records) {
          let records = res.records.map(v => { return { ...v, selected: false } })
          that.list.push(...records)
        } else {
          that.list = res.records.map(v => { return { ...v, selected: false } })
        }
      })
    },
    handleType(item) {
      this.types = this.types.map(v => {
        v.selected = v.id === item.sourceData.id
        return v
      })
      this.fetchData()
    },
    handleRecord(item) {
      item.selected = !item.selected
    },
    handleCancel() {

    },
    loadMore() {
      this.page += 1
      this.fetchData()
    }
  }
}

</script>
