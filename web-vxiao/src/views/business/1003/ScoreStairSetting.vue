<template>
  <page title="分数阶梯设置">
    <item v-for="(item, i) in cacheInfo.stairs" :key="i" v-if="cacheInfo.stairs.length>0" @click="itemClick(i)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active': item.isSelect}"></i>
      </div>
      <div>{{item.total}}</div>
    </item>
  </page>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        cacheInfo: 'getResultCreateInfo'
      })
    },
    methods: {
      itemClick(i) {
        this.routePush({
          name: 'ladderEdit1003',
          query: {
            index: i
          }
        })
      }
    }
  }

</script>
