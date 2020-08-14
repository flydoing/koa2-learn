<template>
  <page title="选择科目">
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.obj"></div>
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
        appraisal: 'getSubjectAppraisal'
      })
    },
    methods: {
      ...mapActions(['setSubjectAppraisal']),
      fetchData() {
        const that = this

        let cache = that.appraisal.subject || {}
        Api.loadUserSubjects(this.currentGroup.groupId).then(res => {
          that.list = res.metaDatas.map(v => {
            v.selected = v.key === cache.key
            return v
          })
        })
      },
      handleSelect(item, index) {
        this.setSubjectAppraisal({ subject: item })
        this.routeBack()
      }
    }
  }
</script>
