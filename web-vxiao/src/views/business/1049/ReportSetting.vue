<template>
  <page title="报表设置">
    <div class="rating-report-setting">
      <item>
        <div slot="main">班牌全校汇总用符号表示排名</div>
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch"></i-switch>
        </div>
      </item>
      <div class="category-title text">报表生成时间（仅限按周评比）</div>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleWeekDay">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">生成日期</div>
            <div slot="remark"
                 v-html="dayTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in weekdays"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item class="r-time"
            :hasClick="false">
        <div slot="main">生成时间</div>
        <div slot="after">
          <el-time-picker v-model="time"
                          prefix-icon="x"
                          :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                          placeholder="选择时间"
                          format="HH:mm"
                          value-format="HH:mm"
                          @change="handleTime"
                          :clearable="false"></el-time-picker>
        </div>
      </item>
      <item v-if="day && time"
            :hasClick="false">
        <div slot="main"
             v-html="description"></div>
        <div slot="after"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        weekdays: [
          {
            name: '周一',
            value: '2'
          },
          {
            name: '周二',
            value: '3'
          },
          {
            name: '周三',
            value: '4'
          },
          {
            name: '周四',
            value: '5'
          },
          {
            name: '周五',
            value: '6'
          },
          {
            name: '周六',
            value: '7'
          },
          {
            name: '周日',
            value: '1'
          }
        ],
        day: null,
        time: ''
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      showSymbolMeta() {
        return this.filterMeta('m_rating_result_show_symbol')
      },
      isSwitched() {
        return this.showSymbolMeta ? this.showSymbolMeta.obj === '1' : false
      },
      timeMeta() {
        return this.filterMeta('m_rating_time_set')
      },
      dayTxt() {
        return this.day ? this.day.name : ''
      },
      description() {
        let txt = ''
        if (this.day && this.time) {
          switch (this.day.value) {
            case '2':
              txt = `逢周一${this.time}生成上周二至本周一的报表`
              break
            case '3':
              txt = `逢周二${this.time}生成上周三至本周日的报表`
              break
            case '4':
              txt = `逢周三${this.time}生成上周四至本周三的报表`
              break
            case '5':
              txt = `逢周四${this.time}生成上周五至本周四的报表`
              break
            case '6':
              txt = `逢周五${this.time}生成上周六至本周五的报表`
              break
            case '7':
              txt = `逢周六${this.time}生成上周日至本周六的报表`
              break
            case '1':
              txt = `逢周日${this.time}生成本周一至本周日的报表`
              break
          }
        }
        return txt
      }
    },
    created() {
      let wMap = new Map()
      this.weekdays.map(w => {
        wMap.set(w.value, w)
      })

      if (this.timeMeta && this.timeMeta.id) {
        this.day = wMap.get(this.timeMeta.key)
        this.time = this.timeMeta.obj
      } else {
        this.day = this.weekdays[0]
        this.time = '17:30'
      }
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      filterMeta(type) {
        let that = this
        const metas = this.metaDatas.filter(m => {
          return m.metaType === type && m.extension === that.currentGroup.groupId
        })
        if (!Check.isRealArray(metas)) {
          return { metaType: type }
        }
        return metas[0]
      },
      handleSwitch() {
        let meta = this.showSymbolMeta
        if (meta.id) {
          meta.obj = meta.obj === '1' ? '0' : '1'
        } else {
          meta = {
            ...meta,
            obj: '1',
            extension: this.currentGroup.groupId
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      commtTimeMeta() {
        let meta = this.timeMeta
        if (meta.id) {
          meta.obj = this.time
          meta.key = this.day.value
        } else {
          meta = {
            ...meta,
            obj: this.time,
            key: this.day.value,
            extension: this.currentGroup.groupId
          }
        }
        this.modifyMetaData(meta).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleWeekDay(item) {
        this.day = item
        this.commtTimeMeta()
      },
      handleTime(time) {
        this.time = time
        this.commtTimeMeta()
      }
    },
    watch: {}
  }
</script>
<style lang="scss">
  .rating-report-setting {
    .vx-item {
      .el-input input {
        padding-right: 0;
      }
    }

    .r-time input {
      min-width: initial !important;
    }
  }
</style>
