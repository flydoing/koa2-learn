<template>
  <page title="菜式库"
        @scrollEnd="scrollEnd"
        hasSubmit
        @submit="selectFoods">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <item v-for="(food, f) in lists"
          :key="f"
          @click="handleFood(food)">
      <div slot="before"
           class="before">
        <i class="ico ico-select"
           :class="{'active': food.isSelect}"></i>
        <img v-lazy="{src:url(food.logo, 'thumb'), error: '//m.vxiao.cn/images/cooding_default.png'}"
             class="logo" />
      </div>
      <div>
        <p>{{food.name}}{{food.description ? '：'+food.description : ''}}</p>
        <p>{{food.price}}元</p>
      </div>
      <span slot="after"></span>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  import G from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    components: {
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        lists: [],
        currentPage: 1,
        hasNextPage: 0,
        keyword: '',
        isSearch: false
      }
    },
    computed: {
      ...mapGetters({
        cacheCooks: 'getCookCreate'
      })
    },
    created() {
      this.loadFoodLibrary()
    },
    methods: {
      ...mapActions(['saveCookCreate']),
      loadFoodLibrary(queryType) {
        Api.loadFoodLibrary(this.currentGroup.groupId, {
          currentPage: this.currentPage,
          name: this.keyword !== '' ? this.keyword : ''
        }).then(res => {
          if (res.hasNextPage > 0) {
            this.hasNextPage = res.hasNextPage
            this.currentPage = res.currentPage
          } else {
            this.hasNextPage = 0
          }
          // 回显 选中状态
          let rIndex = this.routeQuery('rIndex')
          let cIndex = this.routeQuery('cIndex')
          let index = this.routeQuery('index')
          if (Check.isRealArray(res.foods)) {
            res.foods.forEach(food => {
              this.cacheCooks.tables.datas[rIndex].cellData[cIndex - 1].canteenInfo[index].seleceFoods.forEach(f => {
                if (f.id === food.id) {
                  food.isSelect = true
                  food.maxCount = f.maxCount
                  food.limitCount = f.limitCount
                }
              })
            })
          }
          queryType === 'more' ? (this.lists = [...this.lists, ...res.foods]) : (this.lists = res.foods || [])
        })
      },
      scrollEnd() {
        this.hasNextPage > 0 && this.loadFoodLibrary('more')
      },
      selectFoods() {
        let selectedFoods = this.lists.filter(food => {
          return food.isSelect
        })
        let datas = JSON.parse(JSON.stringify(this.cacheCooks.tables.datas))
        let tempArr = datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo[this.routeQuery('index')].seleceFoods
        if (this.isSearch) {
          let allFoods = [...tempArr, ...selectedFoods]
          let newFoods = []
          let obj = {}
          allFoods.forEach((v, i) => {
            if (!obj[allFoods[i].id]) {
              newFoods.push(allFoods[i])
              obj[allFoods[i].id] = true
            }
          })
          datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo[this.routeQuery('index')].seleceFoods = newFoods
        } else {
          datas[this.routeQuery('rIndex')].cellData[this.routeQuery('cIndex') - 1].canteenInfo[this.routeQuery('index')].seleceFoods = [...selectedFoods]
        }
        this.saveCookCreate({
          tables: {
            ...this.cacheCooks.tables,
            datas: datas
          }
        })
        this.routeBack()
      },
      handleFood(food) {
        let isSelect = !food.isSelect
        this.$set(food, 'isSelect', isSelect)
      }
    },
    watch: {
      keyword(v) {
        this.currentPage = 1
        this.loadFoodLibrary()
        if (v !== '') {
          this.isSearch = true
        } else {
          this.isSearch = false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .before {
    @include flex;
    @include ai;
  }

  .logo {
    width: rem(100);
    height: rem(60);
    margin: rem(8);
    background-color: #ededed;
  }
</style>
