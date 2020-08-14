<template>
  <page title="订单详情"
        @submit="handleSubmit"
        :hasSubmit="allowOrder"
        :wth="708">
    <div class="cookbook-order-detail"
         :style="setHeight">
      <div class="timer-list"
           slot="left">
        <scroller :height="sh-50">
          <template v-if="timers.length>0">
            <div class="timer-item"
                 v-for="(item, t) in timers"
                 :key="t"
                 :class="{'active': item.active}"
                 @click="timerItemClick(item, t)">
              <div class="timer-item-date">{{ruleDate(item.weekDate)}}</div>
              <div class="timer-item-name">{{item.name}}</div>
              <span class="food-count"
                    v-if="item.mealCount&&item.mealCount>0">{{item.mealCount}}</span>
            </div>
          </template>
        </scroller>
        <div class="cookbooks-sum">
          <div>合计：￥ {{sum.toFixed(1)}}</div>
        </div>
      </div>
      <div class="food-menu-list"
           slot="right">
        <scroller :height="sh">
          <template v-for="(item,i) in list">
            <div v-if="item.type=='31'"
                 :item="item"
                 :key="i"
                 class="category-title text"
                 v-html="item.name"
                 style="background:#fff;"></div>
            <div v-else
                 class="menu-item"
                 :item="item"
                 :key="i">
              <item :hasClick="false"
                    :noborder="true">
                <img slot="before"
                     class="menu-img"
                     v-lazy="{src:toLogo(item)}"
                     alt='LOGO' />
                <div slot="main"
                     style="max-width: 335px;color:#9F9F9F;font-size:12px;">
                  <p style="color:#525252;font-size:14px">{{item.name}}</p>
                  <p v-if="item.description">{{item.description}}</p>
                  <span>剩余：{{JSON.parse(item.remark).restCount>=0 ? JSON.parse(item.remark).restCount : '无限制'}}</span>
                  <span>限点：{{JSON.parse(item.remark).limitPerPerson >= 0 ? JSON.parse(item.remark).limitPerPerson : '无限制'}}</span>
                  <span>已点：{{item.count}}</span>
                  <br>
                  <span v-if="item.value === '0.0' ? false : true"
                        style="color:#F74C31;">￥<span style="font-size:17px;">{{item.value}}</span></span>
                  <span v-if="item.extension">（所有人共点{{item.extension}}份）</span>
                </div>
                <div slot="remark"
                     v-if="timers[clickIndex].isAllowOrder">
                  <div v-if="JSON.parse(item.remark).totalCount>=0&&JSON.parse(item.remark).restCount<=0">已售磬</div>
                  <div v-else-if="item.status&&item.status==8">已取餐</div>
                  <div v-else>
                    <!-- <div class="reduce-btn" @click="handleReduce(item)"></div> -->
                    <i class="ico ico-ziyuan1"
                       @click="handleReduce(item)"
                       style="font-size: 17px;color: #2dbd60;margin:0"
                       v-if="item.localCount>0" />
                    <div class="meal-count">{{item.localCount}}</div>
                    <!-- <div class="add-btn" @click="handleAdd(item)"></div> -->
                    <i class="ico ico-ziyuan"
                       @click="handleAdd(item)"
                       style="font-size: 17px;color: #2dbd60;margin:0" />
                  </div>
                </div>
                <!-- <div slot="remark" class="text-color text" v-else-if="!timers[clickIndex].isAllowOrder && item.count">{{item.count}}份</div> -->
              </item>
            </div>
          </template>
        </scroller>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import DateUtil from '@/utils/date'

  export default {
    mixins: [R],
    components: {},
    props: {},
    computed: {},
    data() {
      return {
        title: this.routeQuery('title'),
        list: [],
        timers: [],
        allowOrder: false,
        clickIndex: 0,
        sh: '',
        sum: 0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        // let menuId = that.routeParam('menuId')
        Api.loadFoodMenuDetailV2(that.routeQuery('msgId'), that.routeQuery('userId')).then(res => {
          that.allowOrder = res.isAllowOrder === 1
          that.timers = res.cookbooks
          that.$set(that.timers[0], 'active', true)
          that.loadFoods(res.cookbooks[0].id).then(res => {
            that.$set(that.timers[0], 'list', that.list)
            that.$set(that.timers[0], 'isAllowOrder', res.isAllowOrder)
          })
        })
      },
      toLogo(item) {
        return item.logo ? this.url(item.logo) : '//m.vxiao.cn/images/cooding_default.png'
      },
      handleAdd(item) {
        // 若设置了限点份数，则需要判断是否已超过限点个数，
        // 若没设置限点份数并且设置了最大份数，则判断已点的数量是否大于最大数量
        // 若限点份数和最大份数都无限制，则不需要判断
        if (JSON.parse(item.remark).limitPerPerson >= 0 && Number(JSON.parse(item.remark).limitPerPerson) - (Number(item.count) + Number(item.localCount)) <= 0) {
          this.$message({
            type: 'warning',
            message: '已经超过超过每人限点份数'
          })
          return false
        }
        if (JSON.parse(item.remark).limitPerPerson < 0 && JSON.parse(item.remark).totalCount >= 0 && item.count + Number(item.localCount) > JSON.parse(item.remark).totalCount) {
          this.$message({
            type: 'warning',
            message: '已经超过超过该菜式的最大份数'
          })
          return false
        }
        item.localCount++
        let old = this.timers[this.clickIndex].mealCount || 0
        this.$set(this.timers[this.clickIndex], 'mealCount', old + 1)
        this.sum += Number(item.value)
      },
      handleReduce(item) {
        if (item.localCount < 1) {
          return false
        }
        item.localCount--
        let old = this.timers[this.clickIndex].mealCount || 0
        this.$set(this.timers[this.clickIndex], 'mealCount', old - 1)
        this.sum -= Number(item.value)
      },
      handleSubmit() {
        const that = this
        let meals = []
        that.timers.forEach(v => {
          if (v.hasOwnProperty('list')) {
            let arr = v.list.filter(l => {
              return l.type === '32' && l.localCount > 0
            })
            meals = [...meals, ...arr]
          }
        })

        if (!Check.isRealArray(meals)) {
          that.$message({
            message: '请添加菜品数量',
            type: 'warning'
          })
          return false
        }

        Api.commitUserMeals({
          schoolId: that.currentGroup.parentId,
          userId: this.routeQuery('userId'),
          orders: meals.map(m => {
            return {
              count: m.localCount + m.count,
              foodId: m.id
            }
          })
        }).then(res => {
          if (res.code === '1') {
            that.$message({
              message: res.msg,
              type: 'success'
            })
            that.routeBack()
          }
        })
      },
      ruleDate(d) {
        return DateUtil.format(new Date(d), DateUtil.MD)
      },
      loadFoods(menuId) {
        return new Promise((resolve, reject) => {
          Api.loadFoodMenuDetailList(menuId, this.currentGroup.groupId, this.routeQuery('userId')).then(res => {
            this.list = res.categorys.map(c => {
              c.count = c.count || 0
              c.localCount = 0
              return c
            })
            resolve(res)
            // that.allowOrder = res.isAllowOrder === 1
            // that.showSubmit = that.list.some(l => {
            //   // 剩余无限制、和 存在有剩余的菜式就展示提交按钮
            //   return (l.remark && JSON.parse(l.remark).restCount > 0) || (l.remark && JSON.parse(l.remark).totalCount < 0)
            // })
          })
        })
      },
      timerItemClick(item, t) {
        const that = this
        that.clickIndex = t
        that.timers.forEach(t => {
          that.$set(t, 'active', false)
        })
        that.$set(item, 'active', true)
        if (!item.list) {
          that.loadFoods(item.id).then(res => {
            that.$set(item, 'list', that.list)
            that.$set(item, 'isAllowOrder', res.isAllowOrder)
          })
        } else {
          that.list = item.list
        }
      },
      setHeight(h) {
        return `height:${h}px`
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.sh = this.innerHeight - 125 - 40
        this.setHeight(this.sh)
      })
    }
  }
</script>
<style lang="scss" scoped>
  .cookbook-order-detail {
    @include flex;
    .timer-list {
      background: #f8f8f8;
      width: rem(150);
      .timer-item {
        position: relative;
        padding: rem(5) 0;
        text-align: center;
        cursor: pointer;
        color: #909090;
        &:hover,
        &.active {
          background: #fff;
          color: #333;
        }
        &-date {
          margin-bottom: rem(5);
        }
        .food-count {
          position: absolute;
          min-width: rem(18);
          height: rem(18);
          border-radius: 100%;
          text-align: center;
          line-height: rem(18);
          background: #f74c31;
          color: #fff;
          top: rem(4);
          right: rem(16);
          font-size: rem(12);
          font-weight: normal;
        }
      }
      .cookbooks-sum {
        background: #f8f8f8;
        width: 100%;
        height: rem(50);
        line-height: rem(50);
        font-size: rem(16);
        color: #2dbe60;
        text-align: center;
      }
    }
    .food-menu-list {
      width: rem(558);
      .menu-item {
        margin-bottom: rem(10);
      }
      .menu-img {
        width: rem(70);
        height: rem(70);
        margin-left: rem(8);
        border-radius: rem(4);
      }
      .add-btn {
        display: inline-block;
        vertical-align: middle;
        width: rem(25);
        height: rem(25);
        background: url(~images/ico/ico_add_01.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .reduce-btn {
        display: inline-block;
        vertical-align: middle;
        width: rem(25);
        height: rem(25);
        background: url(~images/ico/ico_reduce_01.png) no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .meal-count {
        display: inline-block;
        width: rem(40);
        color: #2dbd60;
        text-align: center;
        font-size: rem(14);
      }
    }
  }
</style>
