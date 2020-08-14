<template>
  <page title="选择评估范围"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.id"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
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
        appraisal: 'getStudentAppraisal'
      })
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fetchData() {
        const that = this

        let caches = that.appraisal.ranges
        let rMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            rMap.set(v.id, v)
          })
        }

        Api.loadRangeList(this.currentGroup.groupId).then(res => {
          for (let g in res.ranges) {
            that.list.push({
              id: g,
              groupIds: res.ranges[g],
              selected: Check.isObject(rMap.get(g))
            })
          }
        })
      },
      handleSubmit() {
        let rs = this.list.filter(r => {
          return r.selected
        })
        this.setStudentAppraisal({ ranges: rs })
        this.routeBack()
      },
      handleSelect(item, index) {
        item.selected = !item.selected
      }
    }
  }
</script>
