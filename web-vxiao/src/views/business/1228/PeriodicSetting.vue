<template>
  <Page title="周期播放">
    <item v-for="(item, i) in list"
          :key="i"
          :label="item.name"
          :remark="item.description"
          @click="handleEdit(item)"></item>
    <item label="新增"
          :hasArrow="false"
          @click="handleEdit">
      <div slot="before"><i class="ico ico-plus"></i></div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
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
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      if (this.obj.periodic) {
        this.modifyCreateObjectField('periodic')
      }
      Api.getPeriodices(this.groupId).then(res => {
        this.list = res.broadcasts || []
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleEdit(item) {
        if (item) {
          this.setCreateObject({ periodic: item })
        }
        this.routePush({ name: 'periodicEdit1228' })
      }
    }
  }
</script>
