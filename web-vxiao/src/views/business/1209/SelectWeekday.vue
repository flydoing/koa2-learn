<template>
  <page title="选择周期"
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
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
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
        panomara: 'getPanomara'
      })
    },
    methods: {
      ...mapActions(['setPanomara']),
      fetchData() {
        const that = this

        let moment = that.panomara.moment
        let wMap = new Map()
        if (Check.isRealArray(moment.weekdays)) {
          moment.weekdays.map(v => {
            wMap.set(v.value, v)
          })
        } else if (Check.isRealArray(moment.periods)) {
          moment.periods.map(v => {
            wMap.set(v.timeValue, v)
          })
        }

        CategoryApi.getCategorysByType('113').then(res => {
          that.list = res.categorys.map(v => {
            return { ...v, selected: Check.isObject(wMap.get(v.value)) }
          })
        })
      },
      handleSubmit() {
        let weekdays = this.list.filter(v => {
          return v.selected
        })
        this.setPanomara({ moment: { ...this.panomara.moment, weekdays: weekdays } })
        this.routeBack()
      },
      handleSelect(item, index) {
        item.selected = !item.selected
      }
    }
  }
</script>
