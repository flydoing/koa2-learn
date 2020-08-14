<template>
  <Page title="广播时间"
        hasSubmit
        @submit="handleSubmit">
    <item v-for="(item, i) in weekdays"
          :key="i"
          :label="item.name"
          @click="handleWeekday(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
    <div class="category-title"></div>
    <item :hasClick="false"
          label="开始时间">
      <div slot="after">
        <el-time-picker v-model="start"
                        prefix-icon="x"
                        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                        placeholder="选择时间"
                        format="HH:mm"
                        value-format="HH:mm"
                        :clearable="false"></el-time-picker>
      </div>
    </item>
    <item :hasClick="false"
          label="结束时间">
      <div slot="after">
        <el-time-picker v-model="end"
                        prefix-icon="x"
                        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                        placeholder="选择时间"
                        format="HH:mm"
                        value-format="HH:mm"
                        :clearable="false"></el-time-picker>
      </div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        weekdays: [
          { name: '周一', value: '1', selected: false },
          { name: '周二', value: '2', selected: false },
          { name: '周三', value: '3', selected: false },
          { name: '周四', value: '4', selected: false },
          { name: '周五', value: '5', selected: false },
          { name: '周六', value: '6', selected: false },
          { name: '周日', value: '7', selected: false }
        ],
        start: '',
        end: ''
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      if (this.obj.time) {
        let time = this.obj.time
        this.start = time.start
        this.end = time.end
        this.weekdays = this.weekdays.map(v => {
          return { ...v, selected: time.days.indexOf(v.value) !== -1 }
        })
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      // 比较数据大小
      compareData(property) {
        return (a, b) => {
          var v1 = a[property]
          var v2 = b[property]
          return parseInt(v1) - parseInt(v2)
        }
      },
      getDescription(weekdays) {
        let txt = ''
        if (weekdays.length > 1) {
          let flag = true
          let wDays = weekdays.sort(this.compareData('value'))
          // 判断是否连续周期（如：周一至周五）
          wDays.forEach((v, i) => {
            if (wDays[i + 1] && wDays[i].sort + 1 !== wDays[i + 1].sort) {
              flag = false
            }
          })
          if (flag) {
            txt = `${wDays[0].name}至${wDays[wDays.length - 1].name}`
          } else {
            let wds = wDays.map(v => {
              return v.name
            })
            txt = wds.join('、')
          }
        } else {
          txt = weekdays[0].name
        }
        return `${txt}，${this.start}~${this.end}`
      },
      handleWeekday(item) {
        item.selected = !item.selected
      },
      handleSubmit() {
        let weekdays = this.weekdays.filter(v => {
          return v.selected
        })
        if (!Check.isRealArray(weekdays)) {
          this.$message({ message: '请选择周期', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.start)) {
          this.$message({ message: '开始时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.end)) {
          this.$message({ message: '结束时间不能为空', type: 'warning' })
          return false
        }
        this.setCreateObject({
          time: {
            days: JSON.stringify(
              weekdays.map(v => {
                return v.value
              })
            ),
            start: this.start,
            end: this.end,
            description: this.getDescription(weekdays)
          }
        })
        this.routeBack()
      }
    }
  }
</script>
