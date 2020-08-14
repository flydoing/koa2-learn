<template>
  <Setup>
    <template slot="split"></template>
    <template slot="others">
      <div class="category-title">果实规则</div>
      <Item v-for="(item, i) in list"
            :key="i"
            @click="handleItem(item)"
            :label="item.dimensionName"
            :remark="scoreTxt(item)">
      </Item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      Api.getDimensions(this.groupId).then(res => {
        this.list = res.fruitMetas || []
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      scoreTxt(item) {
        return item.score ? `${item.score}分` : ''
      },
      handleItem(item) {
        this.setCreateObject({ dimension: item })
        this.routePush({
          name: 'dimensionEdit1245'
        })
      }
    }
  }
</script>
