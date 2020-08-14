<template>
  <div class="model-step">
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
          <template v-if="scope.row.type === 'add'">
            <i class="el-icon-plus plus-icon"
               @click="add(scope.$index)"></i>
            <span>新增</span>
          </template>
          <template v-else>
            <i class="ico ico-delete"
               v-if="scope.$index > 6"
               @click="remove(scope.row,scope.$index)" />
            <span>第{{scope.$index+1}}节</span>
          </template>

        </template>
      </vx-table-column>
      <vx-table-column label="开始时间">
        <template slot-scope="scope">
          <el-time-select v-if="scope.row.start!==undefined"
                          v-model="scope.row.start"
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
          <el-time-select v-if="scope.row.end!==undefined"
                          v-model="scope.row.end"
                          size="mini"
                          :clearable="false"
                          :picker-options="beginTimeOptions"
                          placeholder="结束时间"
                          @change="change(scope.row, scope.$index)">
          </el-time-select>
        </template>
      </vx-table-column>
    </vx-table>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import BasicApi from '@/views/business/basice/api'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        periods: [],
        times: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      timeCount() {
        return this.times.length
      },
      beginTimeOptions() {
        return { start: '06:00', step: '00:05', end: '23:59' }
      }
    },
    created() {
      let form = this.obj.form
      let data = form.timeData || {}
      if (Check.isRealArray(data.times) && Check.isRealArray(data.periods)) {
        this.times = JSON.parse(JSON.stringify(data.times))
        this.periods = JSON.parse(JSON.stringify(data.periods))
      } else {
        BasicApi.loadTeacherTimeInfo(this.currentGroup.parentId).then(res => {
          this.periods = (ps => {
            ps.forEach(p => {
              p.active = !this.checkNull(p.id)
            })
            return ps
          })(res.periods)
          this.times = res.times
          this.times.push({ type: 'add' })
          this.setCreateObject({
            form: {
              ...form,
              timeData: {
                ...form.timeData,
                times: this.times,
                periods: this.periods
              }
            }
          })
        })
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      change(d, index) {
        let form = this.obj.form
        if (!Check.isNullString(d.start) && !Check.isNullString(d.end)) {
          let date = DateUtils.format(new Date(), DateUtils.YMD)
          let sTime = new Date(`${date} ${d.start}`).getTime()
          let eTime = new Date(`${date} ${d.end}`).getTime()
          if (sTime > eTime) {
            d.end = DateUtils.format(new Date(sTime + 1000 * 60 * 45), DateUtils.HM)
          }
          BasicApi.modifyTeacherTime(this.currentGroup.parentId, { times: [d] }).then(res => {
            if (res.msg) {
              this.$message({ type: 'warning', message: res.msg })
            } else {
              this.times = res.times
              this.setCreateObject({
                form: {
                  ...form,
                  timeData: {
                    ...form.timeData,
                    times: this.times
                  }
                }
              })
              this.$message({ type: 'success', message: '操作成功' })
            }
          })
        }
      },
      periodClick(p, i) {
        const that = this
        let form = this.obj.form
        p.active = !p.active
        let d = {
          schoolId: this.currentGroup.parentId,
          dayName: p.dayName,
          dayIndex: p.dayIndex
        }
        if (!p.active) {
          d.status = 'd'
          d.id = p.id
        }
        // 修改每周上课天数
        BasicApi.modifyTeacherTimeDays({
          periods: [d]
        }).then(res => {
          res.periods.forEach(ps => {
            ps.active = p.active
            this.$set(that.periods, i, ps)
            this.setCreateObject({
              form: {
                ...form,
                timeData: {
                  ...form.timeData,
                  periods: this.periods
                }
              }
            })
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
      add(index) {
        this.times.splice(index, 1, {
          start: '',
          end: '',
          schoolId: this.currentGroup.parentId,
          type: '1'
        })
        this.times.push({ type: 'add' })
      },
      remove(r, i) {
        if (r.id) {
          this.$confirm('确认删除该记录?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            BasicApi.modifyTeacherTime(this.currentGroup.parentId, {
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
        } else {
          this.times.splice(i, 1)
        }
      }
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
