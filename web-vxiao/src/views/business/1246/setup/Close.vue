<template>
  <Page title="开关机时间"
        hasSubmit
        @submit="modify">
    <div class="category-title"></div>
    <Item :hasClick="false">
      <div>周期</div>
      <el-radio-group slot="remark"
                      v-model="vscreenSets.type">
        <el-radio label="1">单次</el-radio>
        <el-radio label="2">循环</el-radio>
      </el-radio-group>
    </Item>
    <div class="vx-periods"
         v-if="vscreenSets.type==='2'">
      <div class='period'
           v-for="(period,i) in periods"
           :key="i"
           @click="periodClick(period,i)">
        <i class="ico ico-select"
           :class="{'active':!!checkList[period.dayIndex]}"></i>
        <div>{{period.dayName}}</div>
      </div>
    </div>
    <div class="category-title"></div>
    <div class="vx-time-picker">
      <div>关机时间</div>
      <div v-if="vscreenSets.type==='2'">
        <el-time-picker v-model="sTime"
                        value-format="HH:mm"
                        placeholder="开始时间" />
      </div>
      <div v-else>
        <el-date-picker v-model="sDateTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="开始日期" />
      </div>
    </div>
    <div class="vx-time-picker">
      <div>开机时间</div>
      <div v-if="vscreenSets.type==='2'">
        <el-time-picker v-model="eTime"
                        value-format="HH:mm"
                        placeholder="结束时间" />
      </div>
      <div v-else>
        <el-date-picker v-model="eDateTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm"
                        placeholder="开始日期" />
      </div>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    data() {
      return {
        periods: [],
        vscreenSets: { startTime: '', endTime: '' },
        checkList: {},
        sTime: '',
        eTime: '',
        sDateTime: '',
        eDateTime: '',
        dateString: []
      }
    },
    computed: {},
    created() {
      this.periods = this.getStorage('_cache_periods') || []
      this.vscreenSets = {
        ...this.vscreenSets,
        ...(this.getStorage('_cache_sets') || {})
      }
      if (this.vscreenSets.type !== '2') {
        this.sDateTime = this.vscreenSets.startTime
        this.eDateTime = this.vscreenSets.endTime
      } else {
        this.sTime = this.vscreenSets.startTime
        this.eTime = this.vscreenSets.endTime
      }
      this.periods.forEach(p => {
        if (this.vscreenSets.powerOffDays && this.vscreenSets.powerOffDays.indexOf(p.dayIndex) > -1) {
          this.checkList[p.dayIndex] = p
        }
      })
    },
    methods: {
      periodClick(period, i) {
        if (this.checkList[period.dayIndex]) {
          this.$delete(this.checkList, period.dayIndex)
        } else {
          this.$set(this.checkList, period.dayIndex, period)
        }
        this.$set(this.vscreenSets, 'powerOffDays', Object.keys(this.checkList).join(','))
      },
      modify() {
        let type = this.vscreenSets.type
        if (type === '1') {
          if (Check.isNullString(this.sDateTime) || Check.isNullString(this.eDateTime)) {
            this.$message({ type: 'warning', message: '请选择开机、关机时间' })
            return false
          } else {
            this.$set(this.vscreenSets, 'startTime', this.sDateTime)
            this.$set(this.vscreenSets, 'endTime', this.eDateTime)
          }
        } else {
          if (Check.isNullString(this.sTime) || Check.isNullString(this.eTime)) {
            this.$message({ type: 'warning', message: '请选择开机、关机时间' })
            return false
          } else {
            this.$set(this.vscreenSets, 'startTime', this.sTime)
            this.$set(this.vscreenSets, 'endTime', this.eTime)
          }
        }

        let dayNames = []
        for (let key in this.checkList) {
          dayNames.push(this.checkList[key].dayName)
        }
        let txt = `${this.vscreenSets.startTime}将自动关机、${this.vscreenSets.endTime}将自动开机`
        if (this.vscreenSets.type === '2') {
          txt = `${dayNames.join('、')}${txt}`
        }
        this.$confirm(txt, '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          Api.modifyScreenSet({
            vscreenSets: this.vscreenSets
          })
            .then(res => {
              this.$message({ type: 'success', message: '修改成功' })
              this.routeBack()
            })
            .catch(res => { })
        })
      }
    }
  }
</script>
<style lang="scss">
  @import "~scss/_mixin";

  .vx-periods {
    @include ct;

    .period {
      @include ct;
      width: 14%;
      cursor: pointer;
      line-height: rem(40);

      &:hover {
        background: nth($background, 2);
      }

      div {
        margin-left: rem(8);
      }
    }
  }

  .vx-time-picker {
    padding: 0 rem(10);
    line-height: rem(45);
    border-bottom: $border;
    @include flex;
    @include jc(space-between); // input {
    //   border: 0 !important;
    // }
  }
</style>
