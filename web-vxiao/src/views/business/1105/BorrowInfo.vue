<template>
  <page title="在借"
        :showTips="list.length === 0">
    <item v-for="(item,i) in list"
          :key="i"
          :hasClick="false"
          :label="item.productName"
          :remark="item.num">
      <div slot="after"
           v-html="item.unit"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      })
    },
    created() {
      if (this.crm.borrow) {
        this.list = this.crm.borrow.records || []
      }
    },
    methods: {}
  }
</script>
