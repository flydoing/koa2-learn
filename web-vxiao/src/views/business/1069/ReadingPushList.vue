<template>
  <page title="阅读作业">
    <div v-if="list.length>0" v-for="(item, i) in list" :key="i">
      <div class="category-title">{{item.name}}
        <span class="right">{{item.extension}}</span>
      </div>
      <item v-if="item.datas.length>0&&data.title" v-for="(data, d) in item.datas" :key="d" @click="itemClick(data)">
        <div>{{data.title}}</div>
        <div slot="remark" v-if="data.extension">{{data.extension}}</div>
      </item>
    </div>
  </page>
</template>
<script>
import Api from './api'
import G from '@/views/group/mixin'
export default {
  mixins: [G],
  data() {
    return {
      list: []
    }
  },
  created() {
    Api.getPushList(this.routeQuery('cGroupId'), this.currentGroup.groupId).then(res => {
      this.list = res.datas
    })
  },
  methods: {
    itemClick(data) {
      this.routePushModel({
        name: 'pushDetail1069',
        query: {
          pushId: data.id
        }
      })
    }
  }
}

</script>
