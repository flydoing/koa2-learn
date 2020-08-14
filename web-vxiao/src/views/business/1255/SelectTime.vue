<template>
  <page title="设置时间"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">每天</div>
    </item>
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
    <div class="category-title"></div>
    <item :hasClick="false">
      <div slot="main">打卡周期</div>
      <input slot="remark"
             class="align-right"
             placeholder="7~90"
             v-model="dayCount"
             @blur='checkDayCount' />
      <div slot="after">天</div>
    </item>
    <item class="remind-time"
          :hasClick="false">
      <div slot="main">提醒时间</div>
      <div slot="after">
        <el-time-picker v-model="timeValue"
                        prefix-icon="x"
                        :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                        placeholder="选择时间"
                        format="HH:mm"
                        value-format="HH:mm"
                        :clearable="false"></el-time-picker>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        dayCount: '',
        timeValue: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        punchClock: 'getPunchClock'
      }),
      all() {
        let ws = this.list.filter(v => {
          return v.selected
        })
        return ws.length === this.list.length
      }
    },
    methods: {
      ...mapActions(['setPunchClock']),
      fetchData() {
        let wMap = new Map()
        let time = this.punchClock.time
        if (Check.isObject(time)) {
          time.periods.map(v => {
            wMap.set(v.id, v)
          })
          this.dayCount = time.dayCount
          this.timeValue = time.value || ''
        }

        CategoryApi.getCategorys({ type: '198' }).then(res => {
          this.list = res.categorys.map(v => {
            v.selected = Check.isObject(wMap.get(v.id))
            return v
          })
        })
      },
      handleAll() {
        let all = this.all
        this.list = this.list.map(v => {
          v.selected = !all
          return v
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.list, index, item)
      },
      checkDayCount() {
        if (parseInt(this.dayCount) > 90 || parseInt(this.dayCount) < 7) {
          this.$message({ message: '周期天数不能超出天数范围（7~90）', type: 'warning' })
          this.dayCount = ''
        }
      },
      handleSubmit() {
        let ws = this.list.filter(v => {
          return v.selected
        })
        if (!Check.isRealArray(ws)) {
          this.$message({ message: '请选择周期', type: 'warning' })
          return false
        }
        if (Check.isNullString(this.dayCount)) {
          this.$message({ message: '周期天数不能为空', type: 'warning' })
          return false
        }

        let time = {
          periods: ws,
          dayCount: this.dayCount
        }
        if (!Check.isNullString(this.timeValue)) {
          time.value = this.timeValue
        }
        this.setPunchClock({ time: time })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
  .vx-item {
    .el-input input {
      padding-right: 0;
    }
  }

  .remind-time input {
    min-width: initial !important;
  }
</style>
