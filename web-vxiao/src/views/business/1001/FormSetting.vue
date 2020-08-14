<template>
  <page title="表单设置"
        @add="handleAdd"
        :hasAdd="true">
    <item v-for="(item,i) in list"
          :key="i"
          :item="item"
          @click="handleItem(item)">
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    components: {},
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        Api.getApproveForms(that.currentGroup.groupId).then(res => {
          that.list = res.approveFroms
        })
      },
      handleAdd() {
        this.setCreateObject({ cache: null, form: null, formItem: null })
        this.routePush({ name: 'formEdit1001' })
      },
      handleItem(item) {
        this.setCreateObject({ cache: item, form: null, formItem: null })
        this.routePush({ name: 'formEdit1001' })
      }
    }
  }
</script>
