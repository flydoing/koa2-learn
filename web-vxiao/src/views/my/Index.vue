<template>
  <MenuPage>
    <template slot="left">
      <label :class="{'active':index==='self'}"
             @click="handleItem('self')">我的信息</label>
      <label :class="{'active':index==='working'}"
             @click="handleItem('working')">当前状态</label>
      <div class="category-title"></div>
      <!-- <label :class="{'active':index==='orchard'}">成长果园</label> -->
      <label :class="{'active':index==='vcourse'}"
             @click="handleItem('vcourse')">课表</label>
      <label :class="{'active':index==='exercises'}"
             @click="handleItem('exercises')">错题本</label>
      <label :class="{'active':index==='vrecord'}"
             @click="handleItem('vrecord')">录播</label>
      <!-- <label :class="{'active':index==='wrong'}">错题</label> -->
      <div class="category-title"></div>
      <label :class="{'active':index===v.type}"
             @click="handleItem('terminals',v)"
             v-for="(v,i) in apps"
             :key="i">
        <span>{{v.name}}</span>
        <span>{{v.count}}</span>
      </label>
      <div class="category-title"></div>
      <label v-if="self.type==='2'"
             @click="handelTeacherInfo">教师发展档案</label>
      <label v-for="(u,i) in self.relations"
             :key="i">
        <span>学生成长</span>
        <span>{{u.name}}</span>
      </label>
    </template>
  </MenuPage>
</template>
<script>
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        self: 'getUserDetail'
      })
    },
    data() {
      return {
        index: 'self',
        apps: []
      }
    },
    created() {
      let that = this
      this.getUserDetail()
      Api.loadApps().then(res => {
        that.apps = res.apps
      })
    },
    methods: {
      ...mapActions(['getUserDetail']),
      handleQuit() {
        this.offPage(false)
        setTimeout(() => {
          this.routeReplace({ path: '/login' })
        })
      },
      handelTeacherInfo() {
        this.routePush({ name: 'index1179' })
      },
      handleItem(t, app) {
        if (t === 'terminals') {
          this.index = app.type
          if (app.type === '1250') {
            this.routeReplace({
              path: '/vx/user/shop'
            })
          } else if (app.type === '1150') {
            this.routeReplace({
              path: `/vx/user/app/books`,
              query: {
                userId: this.USER.id
              }
            })
          } else {
            this.routeReplace({
              path: `/vx/user/app/users/${app.type}`,
              query: app
            })
          }
        } else if (t === 'vrecord') {
          this.index = 'vrecord'
          this.routeReplace({
            path: '/vx/user/vrecord',
            query: app
          })
        } else if (t === 'exercises') {
          this.index = 'exercises'
          this.routeReplace({
            path: '/vx/user/exercises'
          })
        } else {
          this.index = t
          this.routeReplace({
            path: `/vx/user/${t}`
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  label {
    display: block;
    line-height: rem(40);
    cursor: pointer;
    padding: rem(0) rem(20);
    width: 100%;
    position: relative;

    &:hover {
      color: #fff;
      @include bc;
    }

    &.active {
      color: #fff;
      @include bc;
      &:after {
        content: '';
        position: absolute;
        top: 0;
        height: 100%;
        right: rem(0);
        width: rem(3);
        @include bc;
      }
    }
    span:nth-child(2n) {
      float: right;
    }
  }
</style>
