<template>
  <Page title="亮屏时间设置"
        hasSubmit
        @submit="onSubmit">
    <template v-if="!vscreenSets.allDayClose || vscreenSets.allDayClose === '0'">
      <div class="category-title text">未设置时间将根据教学时间亮屏</div>
      <div class="vx-periods">
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
        <div>亮屏时间</div>
        <div>
          <el-time-select align="right"
                          placeholder="起始时间"
                          v-model="vscreenSets.brightStartTime"
                          :picker-options="startOptions" />
          <el-time-select align="right"
                          placeholder="结束时间"
                          v-model="vscreenSets.brightEndTime"
                          :picker-options="endOptions" />
        </div>
      </div>
      <div class="category-title"></div>
      <Item @click="eidtSwitch('closeInClass')">
        <div>上课时间休眠</div>
        <div slot="after">
          <i-switch :value.sync="vscreenSets.closeInClass"
                    trueValue='1'
                    falseValue="0" />
        </div>
      </Item>
    </template>
    <Item @click="eidtSwitch('allDayClose')">
      <div>全天黑屏</div>
      <div slot="after">
        <i-switch :value.sync="vscreenSets.allDayClose"
                  trueValue='1'
                  falseValue="0" />
      </div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        periods: [],
        vscreenSets: {},
        checkList: {}
      }
    },
    computed: {
      startOptions() {
        return { start: '00:00', step: '00:05', end: '23:55' }
      },
      endOptions() {
        return { ...this.startOptions, ...{ minTime: this.vscreenSets.brightStartTime } }
      }
    },
    created() {
      this.periods = this.getStorage('_cache_periods')
      this.vscreenSets = this.getStorage('_cache_sets')
      this.periods.forEach(p => {
        if (this.vscreenSets.brightDays && this.vscreenSets.brightDays.indexOf(p.dayIndex) > -1) {
          this.checkList[p.dayIndex] = p
        }
      })
    },
    methods: {
      onSubmit() {
        if (Check.isNullString(this.vscreenSets.brightDays)) {
          this.$message({ type: 'warning', message: '亮屏周期不能为空' })
          return
        }
        if (Check.isNullString(this.vscreenSets.brightStartTime) || Check.isNullString(this.vscreenSets.brightEndTime)) {
          this.$message({ type: 'warning', message: '亮屏时间不能问空' })
          return
        }
        Api.modifyScreenSet({
          vscreenSets: this.vscreenSets
        })
          .then(res => {
            this.$message({ type: 'success', message: '修改成功' })
          })
          .catch(res => {})
      },
      periodClick(period, i) {
        if (this.checkList[period.dayIndex]) {
          this.$delete(this.checkList, period.dayIndex)
        } else {
          this.$set(this.checkList, period.dayIndex, period)
        }
        this.$set(this.vscreenSets, 'brightDays', Object.keys(this.checkList).join(','))
      },
      eidtSwitch(type) {
        this.$set(this.vscreenSets, type, this.vscreenSets[type] === '0' ? '1' : '0')
      }
    }
  }
</script>
<style lang="scss">
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
    line-height: rem(45);
    padding-left: rem(10);
    @include flex;
    @include jc(space-between);

    input {
      border: 0 !important;
    }
  }
</style>
