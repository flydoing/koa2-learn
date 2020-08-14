<template>
  <page title="消费情况">
    <item v-if="datas.length>0" v-for="(data, d) in datas" :key="d" @click="itemClick(data)">
      <div>{{data.name}}消费情况</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    data() {
      return {
        datas: []
      }
    },
    created() {
      Api.loadConsumption(this.currentGroup.parentId).then(res => {
        this.datas = res.datas
      })
    },
    methods: {
      itemClick(data) {
        this.routePush({
          name: 'consumptionDetail1058',
          query: {
            date: data.name
          }
        })
      }
    }
  }

</script>
