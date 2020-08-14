<template>
  <page title="职务">
    <template v-if="list.length>0">
      <item v-for="(item,i) in list"
            :key="i"
            :hasClick="false"
            :label="item.name"
            :remark="item.value">
      </item>
    </template>
    <template v-else>
      <CardTips text="暂无职务" />
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        Api.getTeacherJobs(this.obj.userId).then(res => {
          this.list = res.datas || []
        })
      }
    }
  }
</script>
