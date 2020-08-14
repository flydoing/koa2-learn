<template>
  <page title="表单默认处理人设置">
    <item v-for="(item,i) in list"
          :key="i"
          :item="item"
          @click="handleItem(item)">
      <div v-html="item.name"></div>
      <div slot="remark"
           class="ellipsis"
           v-html="itemTxt(item)"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'
  import Check from '@/utils/check'

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
      itemTxt(item) {
        return item.approveFromPersons ? `${item.approveFromPersons.length}位默认处理人` : '设置默认处理人'
      },
      fetchData() {
        const that = this
        Api.getApproveForms(that.currentGroup.groupId).then(res => {
          that.list = res.approveFroms
        })
      },
      handleItem(item) {
        let approvers = []
        let executors = []
        if (Check.isRealArray(item.approveFromPersons)) {
          approvers = item.approveFromPersons.filter(v => {
            return v.type === 'to'
          })
          executors = item.approveFromPersons.filter(v => {
            return v.type === 'executor'
          })
        }
        this.setCreateObject({ form: item, approvers: approvers, executors: executors })
        this.routePush({ name: 'handlerEdit1001' })
      }
    }
  }
</script>
