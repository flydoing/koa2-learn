<template>
  <page title="默认审批人设置">
    <div v-for="(item,i) in list" :key="i">
      <item @click="handleItem(item)">
        <div slot="main" v-html="item.name"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fectchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setDocument']),
      fectchData() {
        Api.getItems(this.currentGroup.parentId, this.currentGroup.groupId).then(res => {
          this.list = res.items
        })
      },
      handleItem(item) {
        this.setDocument({ category: item })
        this.routePush({ name: 'approverEdit1248' })
      }
    }
  }

</script>
