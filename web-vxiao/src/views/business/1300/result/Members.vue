<template>
  <Page title="报名结果"
        @scrollEnd="scrollEnd">
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
    <Item :hasClick="false"
          slot="top" class="search">
      <div slot="before">
        <i class="ico ico-search"></i></div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <ItemList v-for="(u, i) in users"
              :key="i"
              @click="handleMember(u)">
      <div slot="avatar">
        <img class="avatar"
             v-lazy="{src:url(u.avatar),error:Image.ICO_USER}"
             alt='头像'>
      </div>
      <span slot="title">{{u.name}}</span>
    </ItemList>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'

  export default {
    mixins: [R],
    props: {},
    components: {},
    data() {
      return {
        users: [],
        menus: [
          {
            name: '得分倒序',
            value: '2'
          },
          {
            name: '得分正序',
            value: '1'
          }
        ],
        menu: null,
        page: 1,
        hasNextPage: 1,
        keyword: ''
      }
    },
    created() {
      this.menu = this.menus[0]
      this.fetchData()
    },
    computed: {
      auditType() {
        return this.routeQuery('type')
      },
      msgId() {
        return this.routeQuery('msgId')
      }
    },
    methods: {
      initData() {
        this.page = 1
        this.users = []
        this.hasNextPage = 1
      },
      fetchData() {
        Api.getMembers(this.msgId, this.auditType, this.menu.value, this.page, this.keyword).then(res => {
          this.page = res.currentPage
          this.hasNextPage = res.hasNextPage
          this.users = [...this.users, ...(res.participants || [])]
        })
      },
      handleMenu(item) {
        this.initData()
        this.fetchData()
      },
      handleMember(user) {
        this.routePush({
          path: '/vx/group/business/1300/detail',
          query: {
            msgId: this.msgId,
            type: this.auditType,
            personNo: user.personNo
          }
        })
      },
      scrollEnd() {
        if (this.hasNextPage > 0) {
          this.fetchData()
        }
      }
    },
    watch: {
      keyword(v) {
        this.initData()
        this.fetchData()
      }
    }
  }
</script>
