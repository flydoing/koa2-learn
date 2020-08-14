<template>
  <page title="选择表单">
    <item v-for="(item,i) in list"
          @click="handleSelect(item, i)"
          :key="i"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}" />
      </div>
      <div v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        approve: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        let cache = that.approve.formType
        Api.getApproveForms(this.currentGroup.groupId).then(res => {
          that.list = res.approveFroms.map(v => {
            v.selected = cache && cache.id === v.id
            return v
          })
        })
      },
      handleSelect(item, index) {
        this.setCreateObject({ formType: item })
        this.routeBack()
      }
    }
  }
</script>
