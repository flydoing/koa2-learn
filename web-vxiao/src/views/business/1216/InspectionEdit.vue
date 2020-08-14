<template>
  <page title="编辑巡检" @submit="handleSubmit" hasSubmit @back="handleBack" listenBack>
    <div class="inspection-edit">
      <item :hasClick="false">
        <div slot="main">场所名称</div>
        <div slot="remark" v-html="currentGroup.name"></div>
      </item>
      <div v-for="(item,i) in list" :key="i">
        <div class="category-title" v-html="item.itemName"></div>
        <item v-for="(child,j) in item.childs" :key="j" @click="handleItem(child)">
          <div slot="main" v-html="child.itemName"></div>
          <div slot="remark" :class="{'text-color':child.result==='2','error':child.result==='2'}" v-html="remarkTxt(child)"></div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
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
        inspection: 'getInspection'
      })
    },
    methods: {
      ...mapActions(['setInspection', 'modifyChannelMessage']),
      remarkTxt(item) {
        return item.result === '1' ? '正常' : '异常'
      },
      fetchData() {
        const that = this
        that.placeId = that.routeQuery('pId')
        that.msgId = that.routeQuery('msgId')
        that.uId = that.routeQuery('uId')
        if (Check.isRealArray(that.inspection.list)) {
          that.list = JSON.parse(JSON.stringify(that.inspection.list))
          if (that.inspection.item) {
            let item = that.inspection.item
            that.list = that.list.map(v => {
              v.childs = v.childs.map(c => {
                if (c.itemId === item.itemId) {
                  c = item
                }
                return c
              })
              return v
            })
          }
        } else {
          Api.loadDetails(that.uId, that.placeId, that.msgId).then(res => {
            that.list = res.details || []
          })
        }
      },
      handleItem(item) {
        this.setInspection({ list: this.list, item: item })
        this.routePush({ name: 'resultEdit1216' })
      },
      handleSubmit() {
        const that = this
        let remarks = []
        let mJson = []
        that.list.forEach((v, i) => {
          v.childs.map(c => {
            mJson.push({ itemId: c.itemId, placeId: that.placeId, result: c.result })
            if (c.remark) {
              remarks.push(c.remark)
            }
          })
        })
        let postData = that.constructionMessage({
          id: that.msgId,
          type: '121601',
          groupId: that.currentGroup.groupId,
          categoryId: that.placeId,
          msgJson: JSON.stringify(mJson),
          children: remarks
        })

        that.modifyMessage(postData).then(res => {
          if (res.message) {
            that.modifyChannelMessage(res.message)
          }
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleBack() {
        this.setInspection({ list: [], item: null })
        this.routeBack()
      }
    }
  }

</script>
