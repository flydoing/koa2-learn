<template>
  <page title="巡检详情">
    <div class="inspection-detail">
      <div v-for="(item,i) in list"
           :key="i"
           :item="item">
        <div class="category-title text"
             v-html="item.itemName"></div>
        <item v-for="(child,j) in item.childs"
              :key="j"
              :child="child"
              @click="handleItem(child)">
          <div slot="main"
               v-html="child.itemName"></div>
          <div slot="remark">
            <label :class="{'text-color': child.result === '2', 'error': child.result === '2'}"
                   v-html="stateTxt(child.result)"></label>
          </div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    computed: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        that.msgId = that.routeParam('msgId')
        that.uId = that.routeQuery('uId') // userId
        that.pId = that.routeQuery('pId') // placeId
        Api.loadInspectionDetail(that.msgId, that.pId, that.uId).then(res => {
          that.list = res.details
        })
      },
      stateTxt(status) {
        return status === '1' ? '正常' : '异常'
      },
      handleItem(item) {
        this.routePush({
          name: 'remarks121601',
          params: {
            msgId: this.msgId
          },
          query: {
            cId: item.itemId
          }
        })
      }
    }
  }
</script>
