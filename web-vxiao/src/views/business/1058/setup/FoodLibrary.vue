<template>
  <page title="菜品库"
        @scrollEnd="scrollEnd">
    <div slot="btn">
      <label @click="importHandle">导入模板</label>
    </div>
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
    <div class="food-librarys">
      <item v-if="lists.length>0"
            v-for="(food, i) in lists"
            :key="i"
            @click="editFood(food)">
        <div slot="before">
          <img v-lazy="{src:url(food.logo, 'thumb'), error: '//m.vxiao.cn/images/cooding_default.png'}"
               class="logo" />
        </div>
        <div>
          <p>{{food.name}}{{food.description ? '：'+food.description : ''}}</p>
          <p>{{food.price}}元</p>
        </div>
      </item>
      <CardTips text="暂无菜品"
                v-else />
    </div>
    <div slot="bottom">
      <item @click="addFood">
        <div slot="before">
          <i class="ico ico-plus"></i>
        </div>
        <div>添加菜式</div>
      </item>
      <!-- <div class="list-botton" style="margin-top: 10px;padding-bottom: 10px;">
        <div class="button button-common" style="margin: 0 auto;" @click="importHandle">导入模板</div>
      </div> -->
    </div>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  export default {
    components: {
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    mixins: [G],
    data() {
      return {
        lists: [],
        currentPage: 1,
        hasNextPage: 0,
        keyword: ''
      }
    },
    created() {
      this.loadFoodLibrary()
    },
    methods: {
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
          queryType === 'more' ? (this.lists = [...this.lists, ...res.foods]) : (this.lists = res.foods || [])
        })
      },
      scrollEnd() {
        this.hasNextPage > 0 && this.loadFoodLibrary('more')
      },
      addFood() {
        this.routePush({
          name: 'modifyFood1058'
        })
      },
      editFood(food) {
        this.routePush({
          name: 'modifyFood1058',
          query: {
            foodName: food.name,
            price: `${food.price}`,
            description: food.description,
            logo: food.logo || '',
            foodId: food.id
          }
        })
      },
      importHandle() {
        let that = this
        that.$import({
          title: '导入模板',
          uploadURI: this.uploadURL,
          templateUrl: '/business/cookbook/food/import/template',
          callback: (res, file) => {
            if (res && res.code === '1') {
              Api.importTemplate({
                groupId: this.currentGroup.groupId,
                fileId: res.file.id
              }).then(res => {
                this.currentPage = 1
                this.loadFoodLibrary()
              })
            }
          }
        })
      }
    },
    watch: {
      keyword(v) {
        this.currentPage = 1
        this.loadFoodLibrary()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .food-librarys {
    .logo {
      width: rem(100);
      height: rem(60);
      margin: rem(8);
      background-color: #ededed;
    }
  }
</style>
