<template>
  <Page title="新建报废"
        @scrollEnd="scrollEnd"
        :showTips="books.length === 0"
        hasSubmit
        @submit="handleSubmit">
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
    <item @click="handleAll"
          :hasArrow="false"
          v-if="books.length>0">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>

    </item>
    <div class="category-title"
         v-if="books.length>0"></div>
    <item v-for="(item, i) in books"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main">
        <div>{{item.name}}（{{item.author}} {{item.bookConcern}}）</div>
        <div class="code-text">识别码：{{item.targetCode}}</div>
      </div>
      <div slot="remark">{{item.extension}}</div>

    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import Api from './api'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        keyword: '',
        books: [],
        page: 1,
        hasChange: false
      }
    },
    computed: {
      all() {
        const that = this
        if (Check.isRealArray(that.books)) {
          let selected = that.books.filter(v => {
            return v.selected
          })
          return selected.length === that.books.length
        }
        return false
      }
    },
    methods: {
      loadBooks() {
        const that = this
        Api.getBooks(that.keyword, that.page).then(res => {
          if (res.attaches) {
            if (that.page === 1) {
              that.books = res.attaches.map(v => {
                v.selected = false
                return v
              })
            } else {
              that.books.push(
                ...res.attaches.map(v => {
                  v.selected = false
                  return v
                })
              )
            }
          }
        })
      },
      scrollEnd() {
        this.page += 1
        this.loadBooks()
      },
      handleSelect(item, i) {
        item.selected = !item.selected
      },
      handleAll() {
        let all = this.all
        this.books = this.books.map(v => {
          v.selected = !all
          return v
        })
      },
      handleSubmit() {
        const that = this
        let bs = this.books.filter(v => {
          return v.selected
        })
        if (!Check.isRealArray(bs)) {
          this.$message({ message: '请选择需报废的图书', type: 'warning' })
          return false
        }
        let postData = that.constructionMessage({
          type: '115007',
          groupId: that.groupId,
          msgJson: JSON.stringify(
            bs.map(v => {
              return {
                targetCode: v.targetCode
              }
            })
          )
        })
        this.$confirm('报废后不可恢复！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.addMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            this.routeBack(-2)
          })
        })
      }
    },
    watch: {
      keyword(v) {
        this.page = 1
        this.loadBooks()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .code-text {
    font-size: rem(12);
    color: #999;
  }
</style>
