<template>
  <Page title="商品管理">
    <el-dropdown slot="btn"
                 trigger="click"
                 @command="handleMenu">
      <i class="ico ico-more" />
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(m, i) in menus"
                          :key="i"
                          :command="m">{{m.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <template slot="top">
      <Item :hasClick="false">
        <div slot="before">
          <i class="ico ico-search"></i></div>
        <input placeholder="搜索"
               v-model="form.keyword" />
        <span slot="after"></span>
      </Item>
      <div class="search-toolbar">
        <el-row>
          <el-col :span="8">
            <div class="st-column">
              <el-popover placement="bottom"
                          popper-class="toolbar-popover"
                          trigger="hover">
                <div class="condition-list">
                  <div v-for="(item, i) in form.states"
                       :key="i"
                       class="cl-item"
                       :class="{'active': item.selected}"
                       v-html="item.name"
                       @click="handleState(item)"></div>
                </div>
                <div class="st-condition"
                     slot="reference">
                  <span>状态：{{stateTxt}}</span><i class="ico ico-down"></i>
                </div>
              </el-popover>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="st-column">
              <el-popover placement="bottom"
                          popper-class="toolbar-popover"
                          trigger="hover">
                <div class="condition-list">
                  <div v-for="(item, i) in form.types"
                       :key="i"
                       class="cl-item"
                       :class="{'active': item.selected}"
                       v-html="item.name"
                       @click="handleType(item)"></div>
                </div>
                <div class="st-condition"
                     slot="reference">
                  <span>一级分类：{{typeTxt}}</span><i class="ico ico-down"></i>
                </div>
              </el-popover>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="st-column last">
              <el-popover placement="bottom"
                          popper-class="toolbar-popover"
                          trigger="hover">
                <div class="condition-list">
                  <div v-for="(item, i) in form.categories"
                       :key="i"
                       class="cl-item"
                       :class="{'active': item.selected}"
                       v-html="item.name"
                       @click="handleCategory(item)"></div>
                </div>
                <div class="st-condition"
                     slot="reference">
                  <span>二级分类：{{categoryTxt}}</span><i class="ico ico-down"></i>
                </div>
              </el-popover>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
    <div class="goods-manage">
      <vx-table v-if="form.goods.length>0"
                :data="form.goods"
                :height="maxHeight"
                stripe
                @row-click="handleGoods">
        <template v-if="form.goods.length > 0">
          <vx-table-column label="商品编码"
                           fixed
                           width="180">
            <template slot-scope="scope">
              <div class="check-layer"
                   @click.stop="handleSelect(scope.row, scope.row.$index)"></div>
              <div class="check-item">
                <i class="ico ico-select"
                   :class="{'active': scope.row.type === 'all' ? allSelect : scope.row.selected}"></i>
                <label>{{scope.row.type !== 'all' ? scope.row.goodsCode : '全选'}}</label>
              </div>
            </template>
          </vx-table-column>
          <vx-table-column label="缩略图"
                           width="100"
                           fixed>
            <template slot-scope="scope"
                      v-if="scope.row.type !== 'all'">
              <img class="avatar big"
                   v-lazy="{src:url(scope.row.icon),error:Image.ICO_AVATAR}">
            </template>
          </vx-table-column>
          <vx-table-column label="状态"
                           width="100">
            <template slot-scope="scope"
                      v-if="scope.row.type !== 'all'">
              {{scope.row.status === '1' ? '已上架' : '已下架'}}
            </template>
          </vx-table-column>
          <vx-table-column label="名称"
                           width="150"
                           prop="name" />
          <vx-table-column label="类别"
                           width="120"
                           prop="goodsTypeName" />
          <vx-table-column label="预算科目"
                           prop="budgetTypeName"
                           width="120" />
          <vx-table-column label="供应商（内部）"
                           prop="innerProviderName"
                           width="120" />
          <vx-table-column label="供应商（外部）"
                           prop="outsideProviderName"
                           width="120" />
          <vx-table-column label="税率"
                           width="100">
            <template slot-scope="scope"
                      v-if="scope.row.type !== 'all'">
              {{scope.row.taxRate * 100}}%
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
    <div slot="bottom"
         class="btm-operate">
      <div class="button"
           @click="handlePrev"
           :class="{'disabled': form.page === 1}">上一页</div>
      <div class="button"
           @click="handleNext"
           :class="{'disabled': form.hasNextPage < 1}">下一页</div>
      <div>当前第{{form.page}}页，每页{{form.pageSize}}条记录，共{{pageCount}}页，{{form.totalSize}}个商品。</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    data() {
      return {
        all: {
          name: '所有',
          value: 0,
          id: 0,
          selected: true
        },
        maxHeight: 0,
        menus: [
          {
            name: '批量上架',
            value: '1'
          },
          {
            name: '批量下架',
            value: '-1'
          }
          // {
          //   name: '导出',
          //   value: '2'
          // }
        ],
        form: {
          page: 1,
          hasNextPage: 0,
          pageSize: 20,
          totalSize: 0,
          keyword: '',
          goods: [],
          states: [
            {
              name: '所有',
              value: 0,
              selected: true
            },
            {
              name: '已上架',
              value: 1,
              selected: false
            },
            {
              name: '已下架',
              value: -1,
              selected: false
            }
          ],
          types: [
            {
              name: '所有',
              id: 0,
              selected: true
            }
          ],
          categories: [
            {
              name: '所有',
              id: 0,
              selected: true
            }
          ]
        }
      }
    },
    computed: {
      stateTxt() {
        let state = this.form.states.filter(v => {
          return v.selected
        })[0]
        return (state || {}).name || '所有'
      },
      pageCount() {
        let form = this.form
        if (form.totalSize % form.pageSize !== 0) {
          return parseInt(form.totalSize / form.pageSize) + 1
        }
        return form.totalSize / form.pageSize
      },
      allSelect() {
        let goods = this.form.goods
        let gs = goods.filter(v => {
          return v.selected && v.type !== 'all'
        })
        return goods.length > 1 && goods.length - 1 === gs.length
      },
      typeTxt() {
        let tp = this.form.types.filter(v => {
          return v.selected
        })[0]
        return (tp || {}).name || '所有'
      },
      categoryTxt() {
        let cates = this.form.categories.filter(v => {
          return v.selected
        })
        if (cates.length > 1) {
          let names = cates.map(v => {
            return v.name
          })
          return names.join('、')
        } else if (cates.length > 0) {
          return cates[0].name
        }
        return '所有'
      }
    },
    created() {
      Api.getGoodsTypes().then(res => {
        if (res.mallGoodsTypes) {
          let items = res.mallGoodsTypes.map(v => {
            v.selected = false
            return v
          })
          this.form.types = [{ ...this.all }, ...items]
        }
      })
    },
    activated() {
      this.loadGoods()
    },
    methods: {
      initData() {
        this.form = {
          ...this.form,
          goods: [],
          pageSize: 20,
          page: 1,
          hasNextPage: 0,
          totalSize: 0
        }
      },
      loadGoods(page) {
        let form = this.form
        let state = form.states.filter(v => {
          return v.selected && v.value !== 0
        })[0]
        let typeIds = []
        let type = form.types.filter(v => {
          return v.selected && v.id !== 0
        })[0]
        let cates = form.types.filter(v => {
          return v.selected && v.id !== 0
        })
        if (cates.length > 0) {
          typeIds = cates.map(v => {
            return v.id
          })
        } else if (type) {
          typeIds = [type.id]
        }
        Api.getGoodsList(this.schoolId, form.keyword, typeIds.join(','), (state || {}).value, page || form.page).then(res => {
          let goods = []
          if (res.mallGoodsList) {
            goods = res.mallGoodsList.map(v => {
              v.selected = false
              return v
            })
          }
          this.form = {
            ...this.form,
            goods: [{ type: 'all', selected: false }, ...goods],
            pageSize: res.pageSize,
            page: res.currentPage,
            hasNextPage: res.hasNextPage,
            totalSize: res.count
          }
        })
      },
      handleState(item) {
        this.form.states = this.form.states.map(v => {
          v.selected = v.value === item.value
          return v
        })
        this.loadGoods()
      },
      changeCondition(item, property) {
        if (item.id === 0) {
          this.form[property] = this.form[property].map(v => {
            v.selected = v.id === item.id
            return v
          })
        } else {
          this.form[property] = this.form[property].map(v => {
            if (v.id === 0) {
              v.selected = false
            } else if (v.id === item.id) {
              v.selected = !item.selected
            }
            return v
          })
          let actives = this.form[property].filter(v => {
            return v.selected && item.id !== 0
          })
          if (actives.length < 1) {
            this.form[property] = this.form[property].map(v => {
              v.selected = v.id === 0
              return v
            })
          }
        }
      },
      handleType(item) {
        if (item.id !== 0) {
          let items = item.children.map(v => {
            v.selected = false
            return v
          })
          this.form.categories = [{ ...this.all }, ...items]
        } else {
          this.form.categories = [{ ...this.all }]
        }
        this.form.types = this.form.types.map(v => {
          v.selected = v.id === item.id
          return v
        })
        this.loadGoods()
      },
      handleCategory(item) {
        this.changeCondition(item, 'categories')
        this.loadGoods()
      },
      handleSelect(item, index) {
        if (item.type === 'all') {
          let allSelect = this.allSelect
          this.form.goods = this.form.goods.map(v => {
            v.selected = !allSelect
            return v
          })
        } else {
          item.selected = !item.selected
          this.$set(this.form.goods, index, item)
        }
      },
      handleMenu(item) {
        if (item.value !== '2') {
          let goods = this.form.goods.filter(v => {
            return v.selected && v.type !== 'all'
          })
          if (goods.length < 1) {
            this.$message({ type: 'warning', message: '请选择商品' })
            return false
          }
          this.$confirm(`确认${item.value === '-1' ? '下架' : '上架'}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Api.modifyGoodsStatus({
              goodsIdList: goods.map(v => {
                return v.id
              }),
              goodsStatus: item.value
            }).then(res => {
              this.$message({ type: 'success', message: '操作成功' })
              this.loadGoods()
            })
          })
        } else {
        }
      },
      handleGoods(item, i) {
        if (item.type !== 'all') {
          this.routePush({
            name: 'goodsDetail10041',
            query: {
              gid: item.id
            }
          })
        }
      },
      handlePrev() {
        if (this.form.page === 1) {
          return false
        }
        this.loadGoods(this.form.page - 1)
      },
      handleNext() {
        if (this.form.hasNextPage < 1) {
          return false
        }
        this.loadGoods(this.form.page + 1)
      }
    },
    watch: {
      'form.keyword'(v) {
        this.initData()
        this.loadGoods()
      }
    }
  }
</script>
<style lang="scss">
  .el-popover.toolbar-popover {
    padding: 0 !important;
    min-width: rem(50) !important;
    max-width: rem(400) !important;
  }
  .search-toolbar {
    border-bottom: rem(1) solid #ebedeb;
    .st-column {
      text-align: center;
      .st-condition {
        padding: rem(15) rem(20);
        position: relative;
        overflow: hidden;
        cursor: pointer;
        span {
          vertical-align: middle;
          display: inline-block;
          margin-right: rem(5);
          max-width: rem(175);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .ico {
          vertical-align: middle;
        }
        &:after {
          content: ' ';
          border-right: rem(1) solid #ededed;
          height: rem(20);
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: rem(-10);
        }
      }
      &.last {
        .st-condition {
          &:after {
            border: 0;
          }
        }
      }
    }
  }
  .condition-list {
    @extend %clearfix;
    padding: rem(7) rem(2) rem(12) rem(12);
    .cl-item {
      cursor: pointer;
      padding: rem(5) rem(10);
      border: rem(1) solid #ebebeb;
      border-radius: rem(2);
      margin-right: rem(10);
      margin-top: rem(5);
      float: left;
      &.active {
        background: nth($background, 3);
        color: #fff;
      }
    }
  }
  .goods-manage {
    .check-layer {
      cursor: pointer;
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
    }
    .check-item {
      .ico {
        vertical-align: middle;
        margin-right: rem(10);
      }
      label {
        vertical-align: middle;
      }
    }
  }
  .btm-operate {
    @extend %clearfix;
    padding: rem(8) 0;
    & > div {
      float: left;
      line-height: rem(30);
      margin-left: rem(10);
    }
  }
</style>
