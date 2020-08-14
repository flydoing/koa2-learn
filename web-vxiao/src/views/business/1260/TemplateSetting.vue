<template>
  <page title="模板设置">
    <item v-for="(item,i) in list"
          :key="i"
          :item="item"
          @click="handleItem(item)">
      <div slot="main"
           v-html="item.title"></div>
    </item>
    <item @click="handleSelect"
          label="选择地址"
          :hasArrow="false" />
    <item @click="handleChart"
          :hasArrow="false"
          label="图表" />
    <item @click="handleDetail"
          label="定位详情"
          :hasArrow="false" />
    <item @click="handleAdd"
          label="添加"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    components: {},
    methods: {
      ...mapActions(['setHomeVisit']),
      fetchData() {
        const that = this
        Api.getTemplates(that.currentGroup.parentId).then(res => {
          that.list = res.templets || []
        })
      },
      handleAdd() {
        this.setHomeVisit({ cache: null })
        this.routePush({ name: 'templateEdit1260' })
      },
      handleItem(item) {
        this.setHomeVisit({ cache: item })
        this.routePush({ name: 'templateEdit1260' })
      },
      handleSelect() {
        this.routePush({ name: 'selectAddress1260' })
      },
      handleDetail() {
        this.routePush({ name: 'locationDetail1260' })
      },
      handleChart() {
        this.routePush({ name: 'chartDetail1260' })
      }
    }
  }
</script>
