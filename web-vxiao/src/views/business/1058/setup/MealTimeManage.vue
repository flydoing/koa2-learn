<template>
  <page title="餐次管理"
        hasSubmit
        @submit="commitMealTime">
    <div class="meal-times">
      <div v-for="(meal, i) in mealTimes"
           :key="i">
        <item v-if="meal.status!=='d'"
              :hasClick="false">
          <input type="text"
                 placeholder="餐次名称"
                 v-model="meal.name">
          <div slot="remark">
            <el-time-select placeholder="00:00"
                            v-model="meal.startTime"
                            :picker-options="{ start: '00:00', step: '00:05', end: '23:59' }"
                            prefix-icon="xxx"
                            :clearable="false">
            </el-time-select>
            至
            <el-time-select placeholder="00:00"
                            v-model="meal.endTime"
                            :picker-options="{ start: '00:00', step: '00:05', end: '23:59', minTime: meal.startTime }"
                            prefix-icon="xxx"
                            :clearable="false">
            </el-time-select>
          </div>
          <i slot="after"
             class="ico ico-delete"
             @click="deleteMealTimer(meal, i)"></i>
        </item>
        <el-dropdown trigger="click"
                     class="block-element">
          <Item label="取餐方式"
                :remark="getTypeText(meal)" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native.stop="$set(meal,'getMealType','1')">先点餐，后取餐</el-dropdown-item>
            <el-dropdown-item @click.native.stop="$set(meal,'getMealType','2')">现场取餐</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click"
                     class="block-element">
          <Item label="取餐次数"
                :remark="getLimitText(meal)" />
          <el-dropdown-menu slot="dropdown">
            <template v-for="i in ['0','1','2','3','4','5']">
              <el-dropdown-item @click.native.stop="$set(meal,'getMealLimit',i)"
                                :key="i">
                <template v-if="i==='0'">不限制</template>
                <template v-else>{{i}}次</template>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="category-title"></div>
      </div>
    </div>
    <item @click="addMealTimer"
          label="新增餐次"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [G],
    data() {
      return {
        mealTimes: [],
        initMealTime: {
          name: '',
          startTime: '00:00',
          endTime: '00:00',
          status: '1'
        }
      }
    },
    created() {
      this.initMealTime.groupId = this.currentGroup.groupId
      Api.loadMealTime(this.currentGroup.groupId).then(res => {
        this.mealTimes = res.mealTimes || []
      })
    },
    methods: {
      commitMealTime() {
        let flag = false
        let mealTimes = this.mealTimes.filter(meal => {
          if (Check.isNullString(meal.name)) {
            flag = true
          }
          return !Check.isNullString(meal.name)
        })

        if (flag) {
          this.$message({ message: '餐次名称不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(mealTimes)) {
          this.$message({ message: '请添加餐次', type: 'warning' })
          return false
        }

        Api.modifyMealTime({
          mealTimes: mealTimes
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        })
      },
      addMealTimer() {
        this.initMealTime = {
          name: '',
          startTime: '00:00',
          endTime: '00:00',
          status: '1',
          groupId: this.currentGroup.groupId
        }
        this.mealTimes.push(this.initMealTime)
      },
      deleteMealTimer(meal, index) {
        if (meal.id) {
          this.$set(meal, 'status', 'd')
        } else {
          this.mealTimes.splice(index, 1)
        }
      },
      getTypeText(meal = {}) {
        return meal.getMealType === '2' ? '现场取餐' : '先点餐，后取餐'
      },
      getLimitText(meal = {}) {
        return !meal.getMealLimit || meal.getMealLimit === '0' ? '不限制' : `${meal.getMealLimit}次`
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .meal-times {
    .vx-item-right {
      input {
        padding-right: 0;
      }
    }
    .el-date-editor {
      &.el-input {
        width: rem(60);
      }
    }

    .el-input--prefix {
      .el-input__inner {
        padding: 0;
        @include fc;
        text-align: center !important;
        min-width: rem(30);
        width: rem(60);
      }
    }
  }
</style>
