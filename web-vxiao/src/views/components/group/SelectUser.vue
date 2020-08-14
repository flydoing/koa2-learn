<template>
  <Page :title="title"
        :hasSubmit="hasSubmit || multiselect"
        @submit="handleSubmit"
        :closePrompt="closePromp"
        ref="_page">
    <div slot="btn">
      <slot name="opBtns"></slot>
    </div>
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before"> <i class="ico ico-search"></i></div>
      <input placeholder="搜索"
             v-model="search" />
    </Item>
    <div slot="top"
         class="checked-list"
         v-if="multiselect">
      <div class="category-title text">已选</div>
      <scroller height="85px"
                :width="hw">
        <div class="list"
             v-if="Object.keys(checkList).length>0">
          <div class='user-block'
               v-for="(value,key) in checkList"
               :key="key">
            <i class="ico ico-delete"
               @click="handleRemove(key)"></i>
            <img class="avatar"
                 v-lazy="{src:url(value.avatar,'thumb'),error:Image.ICO_AVATAR}"
                 alt='头像'>
            <div class="name">{{value.name}}</div>
          </div>
        </div>
        <div class="empty"
             v-else>请选择用户</div>
      </scroller>
    </div>
    <item v-if="multiselect"
          @click="clickAll">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div>全选</div>
    </item>
    <template v-for="(v,k,i) in searchUsers">
      <div v-if="v.length > 0"
           :key="i"
           :id="'key_'+k">
        <div class="category-title text"
             :ref="k">{{k}}</div>
        <ItemList v-for="(u,j) in v"
                  :key="j"
                  @click="clickUser(u)">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':checkList[u.userId]}"></i>
          </div>
          <div slot="avatar">
            <img class="avatar"
                 v-lazy="{src:url(u.avatar,'thumb'),error:Image.ICO_USER}"
                 alt='头像'>
          </div>
          <span slot="title">{{u.name}}</span>
          <span slot="main">{{u.mobile}}</span>
          <span slot="remark"
                v-html="remarkTxt(u)"></span>
          <span slot="describe">{{u.subject}}</span>
        </ItemList>
      </div>
    </template>
    <Alphabet slot="other"
              :indexs="searchIndex"
              @click="scrollToIndex" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixinSearch'
  export default {
    mixins: [R],
    props: {
      title: String,
      users: {
        type: Array,
        default: () => {
          return []
        }
      },
      hasSubmit: {
        type: Boolean,
        default: false
      },
      closePromp: {
        type: Boolean,
        default: false
      },
      multiselect: {
        type: [String, Boolean],
        default: false
      },
      needValidate: {
        type: [String, Boolean],
        default: true
      },
      cache: {
        type: Array,
        default: () => {
          return []
        }
      },
      hw: {
        type: String,
        default: this.w
      },
      promptCallBack: { type: Function, default: () => {} }
    },
    created: function() {
      this.setCache()
    },
    data() {
      return {
        selectUsers: this.users,
        checkList: {}
      }
    },
    computed: {
      all() {
        return this.selectUsers.length > 0 && this.selectUsers.length === Object.keys(this.checkList).length
      }
    },
    methods: {
      remarkTxt(u) {
        let txt = ''
        this.$emit('remark', u, val => {
          txt = val
        })
        return txt
      },
      handleSubmit() {
        if (this.needValidate && Object.keys(this.checkList).length === 0) {
          this.$message({ type: 'warning', message: '还未选择任何用户' })
          return
        }
        this.$emit('submit', Object.values(this.checkList))
      },
      handleRemove(key) {
        this.$delete(this.checkList, key)
      },
      clickUser(user) {
        const that = this
        let key = user.userId
        if (that.multiselect) {
          this.checkList[key] ? this.$delete(this.checkList, key) : this.$set(this.checkList, key, user)
          return false
        } else {
          this.checkList = {}
          this.$set(this.checkList, key, user)
        }
        this.$emit('change', user, !!this.checkList[key])
      },
      clickAll() {
        if (this.all) {
          this.checkList = {}
        } else {
          this.selectUsers.forEach(user => {
            this.$set(this.checkList, user.userId, user)
          })
        }
      },
      setCache() {
        const that = this
        if (that.cache && that.cache.length > 0) {
          that.cache.forEach(c => {
            this.$set(this.checkList, c.userId, c)
          })
        }
        // that.cache.forEach(c => {
        //   this.$set(this.checkList, c.id || c.userId, c)
        // })
      }
    },
    beforeDestroy() {
      if (this.$route.path.indexOf('pages') > -1) {
        this.$emit('submit', Object.values(this.checkList))
      }
    },
    watch: {
      users(us) {
        this.selectUsers = us
      },
      selectUsers() {
        this.setCache()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .checked-list {
    border-bottom: $border;
    .list {
      @include flex;
      @include jc(flex-start);
      @include ai;
      height: rem(85);
      white-space: nowrap;
      padding-left: rem(10);
      .user-block {
        @include flex;
        @include jc;
        @include ai;
        flex-direction: column;
        width: rem(45);
        min-width: rem(45);
        margin: rem(0) nth($padding, 2);
        white-space: nowrap;
        position: relative;
        .ico-delete {
          position: absolute;
          right: rem(-5);
          top: rem(-5);
          border-radius: rem(18);
          background: #fff;
        }
        .name {
          @include fh;
          line-height: rem(25);
          font-size: rem(12);
          text-align: center;
        }
      }
    }
    .empty {
      line-height: rem(85);
      text-align: center;
    }
  }
</style>
