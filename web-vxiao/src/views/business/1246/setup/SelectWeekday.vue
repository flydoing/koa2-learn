<template>
  <Popover title="置顶周期"
           @submit="handleSubmit">
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.dayName"></div>
    </item>
  </Popover>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    props: {
      periods: {
        type: Array,
        default: () => {
          return []
        }
      },
      item: {
        type: Object,
        default: () => {
          return {}
        }
      },
      index: {
        type: Number,
        default: () => {
          return 0
        }
      }
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        let item = this.item
        let values = item.periods || ''
        if (Check.isNullString(values) && Check.isRealArray(item.days)) {
          values = item.days
            .map(v => {
              return v
            })
            .join(',')
        }

        this.list = this.periods.map(v => {
          v.selected = values.indexOf(v.dayIndex) !== -1
          return v
        })
      },
      handleSubmit() {
        let ps = this.list.filter(v => {
          return v.selected
        })
        let periods = ps
          .map(v => {
            return v.dayIndex
          })
          .join(',')
        this.$emit('submit', { ...this.item, periods: periods }, this.index)
      },
      handleSelect(item, index) {
        this.list = this.list.map(v => {
          if (v.dayIndex === item.dayIndex) {
            v.selected = !item.selected
          }
          return v
        })
      }
    }
  }
</script>
