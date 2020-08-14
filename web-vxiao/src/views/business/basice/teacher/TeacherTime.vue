<!-- 老师信息 -->
<template>
  <Page title="教学时间">
    <label slot="btn"
           @click="add">新增</label>
    <div class="category-title text">每周上课天数</div>
    <div class="periods">
      <div class='period'
           v-for="(period,i) in periods"
           :key="period.dayIndex"
           @click="periodClick(period,i)">
        <i :class="prefixIco(period)"></i>
        <div>{{period.dayName}}</div>
      </div>
    </div>
    <div class="category-title text">每日上课{{timeCount}}节</div>
    <vx-table :data="times">
      <vx-table-column label="节次">
        <template slot-scope="scope">
          <span>第{{scope.$index+1}}节</span>
          <i class="ico ico-delete"
             v-if="scope.$index > 6"
             @click="remove(scope.row,scope.$index)" />
        </template>
      </vx-table-column>
      <vx-table-column label="开始时间">
        <template slot-scope="scope">
          <el-time-select v-model="scope.row.start"
                          size="mini"
                          :clearable="false"
                          :picker-options="beginTimeOptions"
                          placeholder="开始时间"
                          @change="change(scope.row, scope.$index)">
          </el-time-select>
        </template>
      </vx-table-column>
      <vx-table-column label="结束时间">
        <template slot-scope="scope">
          <el-time-select v-model="scope.row.end"
                          size="mini"
                          :clearable="false"
                          :picker-options="beginTimeOptions"
                          placeholder="结束时间"
                          @change="change(scope.row, scope.$index)">
          </el-time-select>
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  export default {
    data() {
      return {
        schoolId: '',
        periods: [],
        times: []
      }
    },
    computed: {
      timeCount() {
        return this.times.length
      },
      beginTimeOptions() {
        return { start: '06:00', step: '00:05', end: '23:59' }
      }
    },
    methods: {
      change(d, index) {
        if (!Check.isNullString(d.start) && !Check.isNullString(d.end)) {
          let date = DateUtils.format(new Date(), DateUtils.YMD)
          let sTime = new Date(`${date} ${d.start}`).getTime()
          let eTime = new Date(`${date} ${d.end}`).getTime()
          if (sTime > eTime) {
            d.end = DateUtils.format(new Date(sTime + 1000 * 60 * 45), DateUtils.HM)
          }
          Api.modifyTeacherTime(this.schoolId, { times: [d] }).then(res => {
            if (res.msg) {
              this.$message({ type: 'warning', message: res.msg })
            } else {
              this.times = res.times
              this.$message({ type: 'success', message: '操作成功' })
            }
          })
        }
      },
      periodClick(p, i) {
        const that = this
        p.active = !p.active
        let d = {
          schoolId: this.schoolId,
          dayName: p.dayName,
          dayIndex: p.dayIndex
        }
        if (!p.active) {
          d.status = 'd'
          d.id = p.id
        }
        // 修改每周上课天数
        Api.modifyTeacherTimeDays({
          periods: [d]
        }).then(res => {
          res.periods.forEach(ps => {
            ps.active = p.active
            this.$set(that.periods, i, ps)
          })
          that.$message({ type: 'success', message: '修改成功' })
        })
      },
      prefixIco(period) {
        return [
          `ico ico-select`,
          {
            [`active`]: period.active
          }
        ]
      },
      add() {
        this.times.push({
          start: '',
          end: '',
          schoolId: this.schoolId,
          type: '1'
        })
      },
      remove(r, i) {
        if (r.id) {
          this.$confirm('确认删除该记录?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            Api.modifyTeacherTime(this.schoolId, {
              times: [
                {
                  id: r.id,
                  status: 'd'
                }
              ]
            })
              .then(ren => {
                this.$messag({ type: 'success', message: '删除成功' })
                this.times.splice(i, 1)
              })
              .catch(res => {})
          })
        }
      }
    },
    created() {
      const that = this
      this.schoolId = this.routeQuery('schoolId') || this.routeQuery('extension')
      Api.loadTeacherTimeInfo(this.schoolId).then(res => {
        that.periods = (ps => {
          ps.forEach(p => {
            p.active = !that.checkNull(p.id)
          })
          return ps
        })(res.periods)
        this.times = res.times
      })
    }
  }
</script>
<style lang="scss">
  .periods {
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

  .el-input--mini .el-input__inner {
    width: rem(150);
    border: none;
    &:hover,
    &:active {
      background: none;
    }
  }
</style>
