<template>
  <AppPage :title="app.name"
           ref="_page"
           :showTips="books.length===0"
           :loading="loading">
    <label slot="btn"
           @click="band">绑定</label>
    <AppCommon :app="curApp" />
    <div class="category-title"
         v-if="books.length > 0"></div>
    <Item v-for="(book,i) in books"
          :key="i"
          @click="handle(book)">
      <div>{{book.name}}</div>
      <div slot="remark">{{book.totalnum}}本、{{book.normal==='0'?'正常':'异常'}}</div>
    </Item>
  </AppPage>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        books: [],
        loading: false
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.loading = true
        Api.getBookVScreens(this.currentGroup.parentId)
          .then(res => {
            this.books = res.vscreens || []
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      handle(book) {
        this.routePush({
          path: '/vx/group/business/1150/setup/detail',
          query: {
            id: book.vscreenId
          }
        })
      },
      band() {
        this.routePush({
          path: '/vx/group/business/1150/setup/add',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      }
    },
    watch: {
      currentApp(v) {
        this.fetchData()
      },
      $route(to, from) {
        if (to.path === '/vx/') {
          this.fetchData()
        }
      }
    }
  }
</script>
