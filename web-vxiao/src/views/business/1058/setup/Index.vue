<template>
  <Setup appType="'1058'">
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1058'))"
              slot="others">
      <!-- <item @click="canteenManageHandle">
        <div>食堂管理</div>
      </item> -->
      <item @click="mealTimeManageHandle">
        <div>餐次管理</div>
      </item>
      <item @click="foodLibraryHandle">
        <div>菜品库</div>
      </item>
      <!-- <item @click="consumptionHandle">
        <div>消费情况</div>
      </item> -->
      <item @click="orderSwitchHandle">
        <div>点餐</div>
        <div slot="remark">
          <i-switch :value="metas[0].obj==='true'"
                    @click="orderSwitchHandle"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item v-if="metas[0].obj==='true'"
            @click="paySwitchHandle">
        <div>付费</div>
        <div slot="remark">
          <i-switch :value="paymetas[0].obj==='true'"
                    @click="paySwitchHandle"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <div class="cookbook-setup"
           v-if="paymetas[0].obj==='true'&&metas[0].obj==='true'">
        <item :hasClick="false">
          <div>点餐截止时间</div>
          <div slot="remark">
            <span>前一天</span>
            <el-time-select v-model="timerMetas[0].obj"
                            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:59'
            }"
                            placeholder="选择时间"
                            :clearable="false"
                            prefix-icon="xxx"
                            @change="selectLimitTimer(timerMetas[0].obj)">
            </el-time-select>
          </div>
        </item>
        <el-dropdown trigger="click"
                     @command="countLimit">
          <item class="el-dropdown-link">
            <div>每餐限点菜式数量</div>
            <div slot="remark">{{limitMetas[0].obj}}</div>
          </item>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="limit"
                              v-for="(limit, l) in checkLimits"
                              :key="l">{{limit}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        metas: [
          {
            obj: 'false'
          }
        ],
        paymetas: [
          {
            obj: 'false'
          }
        ],
        limitMetas: [
          {
            obj: '1'
          }
        ],
        timerMetas: [
          {
            obj: '23:59'
          }
        ],
        checkLimits: ['无限制', '1', '2', '3', '4', '5']
      }
    },
    created() {
      Api.getAllowOrder(this.currentGroup.parentId).then(res => {
        // 点餐开关
        if (res.metaDatas.length > 0) {
          res.metaDatas.forEach(meta => {
            if (meta.metaType === 'm_is_allow_ordering') {
              this.metas.splice(0, 1, meta)
            }
            if (meta.metaType === 'm_cookbook_is_allow_pay') {
              this.paymetas.splice(0, 1, meta)
            }
            if (meta.metaType === 'm_cookbook_pay_time_limit') {
              this.timerMetas.splice(0, 1, meta)
            }
            if (meta.metaType === 'm_cookbook_pay_limit') {
              this.limitMetas.splice(0, 1, meta)
            }
          })
        } else {
          this.metas = [
            {
              obj: 'false'
            }
          ]
          this.paymetas = [
            {
              obj: 'false'
            }
          ]
        }
      })
    },
    methods: {
      canteenManageHandle() {
        this.routePush({
          name: 'canteenManage1058'
        })
      },
      mealTimeManageHandle() {
        this.routePush({
          name: 'mealTimeManage1058'
        })
      },
      foodLibraryHandle() {
        this.routePush({
          name: 'foodLibrary1058'
        })
      },
      consumptionHandle() {
        this.routePush({
          name: 'consumption1058'
        })
      },
      orderSwitchHandle() {
        this.switchHandle(this.metas[0], 'm_is_allow_ordering')
        this.paymetas[0].obj = false
      },
      paySwitchHandle() {
        this.switchHandle(this.paymetas[0], 'm_cookbook_is_allow_pay')
      },
      countLimit(limit) {
        Api.setAllowOrder({
          metaData: {
            id: this.limitMetas[0].id || void 0,
            obj: limit,
            userId: this.currentGroup.parentId,
            metaType: 'm_cookbook_pay_limit'
          }
        }).then(res => {
          this.limitMetas[0].obj = limit
          this.$message({
            type: 'success',
            message: '成功'
          })
        })
      },
      switchHandle(mate, metaType) {
        let strBol = mate.obj === 'true' ? 'false' : 'true'
        this.$set(mate, 'obj', strBol)
        Api.setAllowOrder({
          metaData: {
            id: mate.id || void 0,
            obj: strBol,
            userId: this.currentGroup.parentId,
            metaType: metaType
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
        })
      },
      selectLimitTimer(timer) {
        Api.setAllowOrder({
          metaData: {
            id: this.timerMetas[0].id || void 0,
            obj: timer,
            userId: this.currentGroup.parentId,
            metaType: 'm_cookbook_pay_time_limit'
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .cookbook-setup {
    .el-dropdown {
      display: block;
    }
    .el-input__inner {
      min-width: rem(40);
      padding: 0;
      text-align: center !important;
    }
    .el-date-editor {
      &.el-input {
        width: rem(57);
      }
    }
  }
</style>
