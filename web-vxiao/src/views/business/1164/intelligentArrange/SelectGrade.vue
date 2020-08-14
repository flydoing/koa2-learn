<template>
  <page title="新增考试年级"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <item v-for="(item, i) in list"
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
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      fetchData() {
        const that = this
        let campus = that.arrange.campus || {}
        if (Check.isRealArray(campus.datas)) {
          that.list = campus.datas.filter(v => {
            if (v.selected === undefined) {
              v.selected = false
            }
            return !v.selected
          })
        }
      },
      handleSubmit() {
        let gMap = new Map()
        let gs = this.list.filter(v => {
          if (v.selected) {
            gMap.set(v.id, v)
          }
          return v.selected
        })

        if (!Check.isRealArray(gs)) {
          this.$message({ message: '请选择年级', type: 'warning' })
          return false
        }

        let campus = this.arrange.campus
        let grades = campus.datas.filter(v => {
          return Check.isNullObject(gMap.get(v.id))
        })
        this.setArrangeExam({ campus: { ...campus, datas: [...grades, ...gs] } })
        this.routeBack()
      },
      handleSelect(item, i) {
        item.selected = !item.selected
        this.$set(this.list, i, item)
      }
    }
  }
</script>
