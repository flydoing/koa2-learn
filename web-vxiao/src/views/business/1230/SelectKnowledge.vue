<template>
  <page title="选择适用范围">
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
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

        let cache = that.appraisal.knowledge || {}
        let subject = that.appraisal.subject

        Api.loadSubjectKnowledges(this.currentGroup.groupId, subject.key).then(res => {
          that.list = res.categorys.map(v => {
            v.selected = v.id === cache.id
            return v
          })
        })
      },
      handleSelect(item, index) {
        this.setSubjectAppraisal({ knowledge: item })
        this.routeBack()
      }
    }
  }
</script>
