<template>
  <MenuPage class="mySelfWrapper">
    <template slot="left">
      <div class="mySelf">
        <img class="chinaMobile-avatar large"
             v-lazy="{src:url(USER.avatar,'thumb'),error:Image.ICO_AVATAR}" />
        <span v-html="USER.name"
              class="name"></span>
      </div>
      <label :class="{'active':index==='self'}"
             @click="handleItem('self')">我的信息</label>
      <label :class="{'active':index==='working'}"
             @click="handleItem('working')">当前状态</label>
      <div class="category-title"></div>
      <!-- <label :class="{'active':index==='orchard'}">成长果园</label> -->
      <label :class="{'active':index==='vcourse'}"
             @click="handleItem('vcourse')"> <img class="self-icon"
             src="/static/ico/chinaMobile/kebiao.png"
             alt="">课表</label>
      <label :class="{'active':index==='exercises'}"
             @click="handleItem('exercises')"><img class="self-icon"
             src="/static/ico/chinaMobile/cuotiben.png"
             alt="">错题本</label>
      <label :class="{'active':index==='vrecord'}"
             @click="handleItem('vrecord')"><img class="self-icon"
             src="/static/ico/chinaMobile/lubo.png"
             alt="">录播</label>
      <!-- <label :class="{'active':index==='wrong'}">错题</label> -->
      <!-- <div class="category-title"></div> -->
      <label :class="{'active':index===v.type}"
             @click="handleItem('terminals',v)"
             v-for="(v,i) in apps"
             :key="i">
        <span><img class="self-icon"
               :src="v.icon"
               alt="">{{v.name}}</span>
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
      <label @click="onQuit">退出登录</label>
    </template>
  </MenuPage>
</template>
<script>
  import Api from '../api'
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
        that.apps = res.apps.map(item => {
          switch (item.type) {
            case '1213':
              item['icon'] = '/static/ico/chinaMobile/yundong.png'
              break
            case '1240':
              item['icon'] = '/static/ico/chinaMobile/xiaofei.png'
              break
            case '1150':
              item['icon'] = '/static/ico/chinaMobile/tushu.png'
              break
            case '1250':
              item['icon'] = '/static/ico/chinaMobile/dingdan.png'
              break
          }
          return item
        })
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
      onQuit() {
        this.$http.get('/base/user/logout')
        this.offPage(false)
        setTimeout(() => {
          if (window.dataModule.indexOf('tianhe.html') > -1) {
            location.href = '/tianhe.html#/'
          } else if (window.dataModule.indexOf('chinamobile.html') > -1) {
            location.href = '/chinamobile.html#/'
          } else if (this.customizationLogin === 'loginDzbp') {
            localStorage.removeItem('customizationLogin')
            location.href = '/'
          } else {
            location.href = '/'
          }
        })
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
  .mySelf {
    padding: 0 20px;
    align-items: center;
    display: flex;
    width: 280px;
    height: 128px;
    background: url('/static/images/person-bg.png') no-repeat;
    .name {
      margin-left: 20px;
      color: #fff;
    }
  }
</style>
<style lang="scss">
  .mySelfWrapper {
    .vx-model-page {
      border-bottom-left-radius: 0px !important;
    }
    .self-icon {
      display: inline-block;
      margin-right: 20px;
      vertical-align: middle;
    }
  }
</style>
