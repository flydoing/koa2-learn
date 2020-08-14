<template>
  <Scroller :height="sh"
            style="background:#FFF;">
    <Item v-for="(catalog,i) in catalogs"
          :key="i"
          @click="catalogHandle(catalog)">
      <div slot="main">{{catalog.name}}</div>
      <div slot="remark">{{catalog.count && catalog.count>0 ? catalog.count : ''}}</div>
    </Item>
    <div class="vx-model-tips"
         v-if="catalogs.length === 0">
      <slot name="tips">
        <img src="/static/ico/icon_commoneuse.png" />
        <span>暂无内容</span>
      </slot>
    </div>
  </Scroller>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    data() {
      return {
        catalogs: []
      }
    },
    computed: {
      sh() {
        return this.innerHeight - 75 - 40 - 10
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        Api.loadCategorys(this.currentGroup.groupId).then(res => {
          this.catalogs = res.categorys || []
        })
      },
      catalogHandle(catalog) {
        this.routePush({
          path: '/vx/group/business/catalogDetail',
          query: {
            categoryId: catalog.id,
            title: catalog.name
          }
        })
      }
    },
    watch: {
      groupId(v) {
        if (v) {
          this.fetchData()
        }
      }
    }
  }
</script>
