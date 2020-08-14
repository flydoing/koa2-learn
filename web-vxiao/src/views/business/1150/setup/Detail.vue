<template>
  <Page title="设备详情">
    <label slot="btn"
           @click="unbind">解除绑定</label>
    <Item :hasClick="false">
      <div>设备名称</div>
      <div slot="remark">{{b.name}}</div>
    </Item>
    <Item :hasClick="false">
      <div>设备序列号</div>
      <div slot="remark">{{b.vscreenId}}</div>
    </Item>
    <template v-if="books.length>0">
      <div class="category-title"></div>
      <Item v-for="book in books"
            :key="book.is"
            :hasClick="false">
        <div>&lt;&lt;{{book.name}}&gt;&gt; {{book.author}}</div>
        <div slot="remark">{{book.bookConcern}}</div>
      </Item>
    </template>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return { b: {}, books: [] }
    },
    created() {
      Api.getBookVScreenDetail(this.routeQuery('id')).then(res => {
        this.b = res.bookVScreen || {}
        this.books = res.books || []
      })
    },
    methods: {
      unbind() {
        this.$confirm('确定解除绑定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.unband({
            bookVScreen: {
              name: this.b.name,
              schoolId: this.b.schoolId,
              vscreenId: this.b.vscreenId,
              status: 'd'
            }
          }).then(res => {
            this.$message({ message: '解绑成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
