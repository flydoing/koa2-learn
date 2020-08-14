<template>
  <page title="选择适用范围"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(range,i) in list"
          :key="i"
          @click="handleSelect(range, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':range.active}"></i>
      </div>
      <div slot="main">{{range.name}}</div>
      <div slot="after"></div>
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
        evaluate: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this

        let caches = that.evaluate.medal.ranges
        let rMap = new Map()
        Check.isRealArray(caches) &&
          caches.map(function(r) {
            rMap.set(r.grade, r)
          })

        Api.loadRangeData(this.currentGroup.groupId).then((res) => {
          that.list = res.useRanges.map((r) => {
            if (rMap.get(r.grade)) {
              r.active = true
            } else {
              r.active = false
            }
            return r
          })
        })
      },
      handleSubmit() {
        let rs = this.list.filter((r) => {
          return r.active
        })
        if (rs.length < 1) {
          this.$message({ message: '请选择适用范围', type: 'warning' })
          return false
        }
        this.setCreateObject({
          medal: {
            ...this.evaluate.medal,
            ranges: rs,
            rangeTxt: rs
              .map((r) => {
                return r.name
              })
              .join('、')
          }
        })
        this.routeBack()
      },
      handleSelect(range, index) {
        range.active = !range.active
      }
    }
  }
</script>
