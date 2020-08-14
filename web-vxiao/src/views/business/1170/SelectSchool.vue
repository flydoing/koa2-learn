<template>
  <page title="添加学校"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.active}"></i>
      </div>
      <div slot="main"
           v-html="item.schoolName"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
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
        appraisal: 'getSuperviseAppraisal'
      })
    },
    methods: {
      ...mapActions(['setSuperviseAppraisal']),
      fetchData() {
        const that = this

        let caches = that.appraisal.grouping.schools
        let sMap = new Map()
        if (Check.isRealArray(caches)) {
          caches.map(v => {
            sMap.set(v.schoolId, v)
          })
        }

        if (Check.isRealArray(that.appraisal.schools)) {
          that.list = that.appraisal.schools.filter(v => {
            v.active = false
            return !sMap.get(v.schoolId)
          })
        }
      },
      handleSubmit() {
        let grouping = this.appraisal.grouping
        let s = this.list.filter(r => {
          return r.active
        })
        if (s.length < 1) {
          this.$message({ message: '请选择学校', type: 'warning' })
          return false
        }
        this.setSuperviseAppraisal({ grouping: { ...grouping, schools: [...grouping.schools, ...s] } })
        this.routeBack()
      },
      handleSelect(item, index) {
        this.list = this.list.map(v => {
          v.schoolId === item.schoolId && (v.active = !item.active)
          return v
        })
      }
    }
  }
</script>
