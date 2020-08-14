<template>
  <page :title="title"
        hasSubmit
        @submit="handleSubmie">
    <div v-for="(category, c) in categorys"
         :key="c"
         v-if="categorys.length>0">
      <div class="category-title">{{category.name}}</div>
      <div class="food-list">
        <item v-for="(food, i) in category.seleceFoods"
              v-if="category.seleceFoods.length>0"
              :key="i"
              :hasClick="false">
          <div slot="before">
            <img v-lazy="{src:url(food.logo, 'thumb'), error: '//m.vxiao.cn/images/cooding_default.png'}"
                 class="logo" />
          </div>
          <div>
            <p>{{food.name}}{{food.description ? '：'+food.description : ''}}</p>
            <p>{{food.price}}元</p>
            <div class="set-count"
                 v-if="isAllowPay">
              <p>最大份数：
                <span @click="setMaxCount(food)">{{food.maxCount || '无限制'}}</span>
                <!-- <input type="text" v-model="food.maxCount" placeholder="无限制"> -->
              </p>
              <p>每人限点：
                <span @click="setLimitCount(food)">{{food.limitCount || '无限制'}}</span>
                <!-- <input type="text" v-model="food.limitCount" placeholder="无限制"> -->
              </p>
            </div>
          </div>
          <div slot="after">
            <i class="ico ico-delete"
               @click="delectFood(c, i)"></i>
          </div>
        </item>
      </div>
      <item @click="addFoods(c)">
        <div>添加菜式</div>
      </item>
    </div>
  </page>
</template>
<script>
import Api from './api'
import G from '@/views/group/mixin'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [G],
  data() {
    return {
      categorys: [],
      isAllowPay: false,
      title: ''
    }
  },
  computed: {
    ...mapGetters({
      cacheCooks: 'getCookCreate'
    })
  },
  created() {
    this.title = `${this.cacheCooks.tables.columns[this.routeQuery('cIndex')]}`
    let ishasCache = this.cacheCooks.tables.datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo.some(canteen => {
      return Check.isRealArray(canteen.seleceFoods)
    })
    if (ishasCache) {
      // this.categorys = [...this.cacheCooks.tables.datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo]
      this.categorys = JSON.parse(
        JSON.stringify(this.cacheCooks.tables.datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo)
      )
      this.isAllowPay = this.cacheCooks.isAllowPay
    } else {
      Api.getCanteenlList(this.currentGroup.parentId).then(res => {
        this.categorys = res.categorys
        this.isAllowPay = res.isAllowPay
        this.saveCookCreate({
          isAllowPay: this.isAllowPay
        })
        this.categorys.forEach(c => {
          c.seleceFoods = []
        })
      })
    }
  },
  methods: {
    ...mapActions(['saveCookCreate']),
    addFoods(c) {
      let datas = JSON.parse(JSON.stringify(this.cacheCooks.tables.datas))
      datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo = [...this.categorys]
      this.saveCookCreate({
        tables: {
          ...this.cacheCooks.tables,
          datas: datas
        }
      })
      this.routePush({
        name: 'selectFood1058',
        query: {
          index: c,
          rIndex: Number(this.routeQuery('rIndex')),
          cIndex: Number(this.routeQuery('cIndex'))
        }
      })
    },
    handleSubmie() {
      let isNoTEmpty = this.categorys.some(category => {
        return Check.isRealArray(category.seleceFoods)
      })
      if (!isNoTEmpty) {
        this.$message({
          type: 'warning',
          message: '请添加菜品'
        })
        return false
      }
      let rows = JSON.parse(JSON.stringify(this.cacheCooks.tables.datas))
      let foodText = ''
      let foods = []
      this.categorys.forEach(c => {
        c.seleceFoods.forEach(selectFood => {
          foodText = `${foodText}${selectFood.name}<br>`
          foods.push({
            categoryId: c.id,
            parentId: selectFood.id,
            totalCount: selectFood.maxCount !== '无限制' ? selectFood.maxCount : void 0,
            limitPerPerson: selectFood.limitCount !== '无限制' ? selectFood.limitCount : void 0,
            placeId: c.parentId
          })
        })
        rows[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].foods = foods
        rows[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo = [...this.categorys]
        rows[this.routeQuery('rIndex')].columns[this.routeQuery('cIndex')] = foodText
      })
      this.saveCookCreate({
        tables: {
          ...this.cacheCooks.tables,
          datas: rows
        }
      })
      this.routeBack()
    },
    delectFood(canteenIndex, foodIndex) {
      let categorys = JSON.parse(JSON.stringify(this.categorys))
      categorys[canteenIndex].seleceFoods.splice(foodIndex, 1)
      this.categorys = [...categorys]
    },
    setMaxCount(food) {
      this.setModel('请输入最大份数', food, 'maxCount')
    },
    setLimitCount(food) {
      this.setModel('每人限点', food, 'limitCount')
    },
    setModel(title, food, key) {
      const that = this
      that
        .$prompt(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '无限制'
          // inputPattern: /\d/,
          // inputErrorMessage: '只能输入数字'
        })
        .then(({ value }) => {
          that.$set(food, key, value)
        })
        .catch(() => {
          that.$set(food, key, '无限制')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~scss/mixin';
.logo {
  width: rem(100);
  height: rem(60);
  margin: rem(8);
  background-color: #ededed;
}

.set-count {
  @include flex;
  p {
    margin-right: rem(20);
    span {
      cursor: pointer;
    }
    input {
      width: rem(60) !important;
      padding-left: 0;
    }
  }
}
</style>
