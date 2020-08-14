<template>
  <Popover :title="title"
           @submit="handleSubmit"
           :hasBack="hasBack"
           @back="handleBack"
           :ht="400"
           ref="_page">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before"><i class="ico ico-search"></i></div>
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
      <template v-if="v.length>0 && isShow">
        <div :key="i"
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
            <span slot="remark"></span>
            <span slot="describe">{{u.subject}}</span>
          </ItemList>
        </div>
      </template>
    </template>
    <Alphabet slot="other"
              :indexs="searchIndex"
              @click="scrollToIndex" />
  </Popover>
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
      multiselect: {
        type: [String, Boolean],
        default: true
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
      hasBack: { type: Boolean, default: false }
    },
    created: function() {
      this.setCache()
    },
    data() {
      return {
        selectUsers: this.users,
        checkList: {},
        isShow: false
      }
    },
    computed: {
      all() {
        return this.selectUsers.length > 0 && this.selectUsers.length === Object.keys(this.checkList).length
      }
    },
    methods: {
      handleSubmit() {
        if (this.needValidate && Object.keys(this.checkList).length === 0) {
          this.$message({ type: 'warning', message: '还未选择任何用户' })
          return
        }
        this.$emit('submit', Object.values(this.checkList))
      },
      handleBack() {
        this.$emit('back')
      },
      clickUser(user) {
        const that = this
        if (that.multiselect) {
          this.checkList[user.userId] ? this.$delete(this.checkList, user.userId) : this.$set(this.checkList, user.userId, user)
        } else {
          this.checkList = {}
          this.$set(this.checkList, user.userId, user)
        }
        this.$emit('change', user, !!this.checkList[user.userId])
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
        that.cache.forEach(c => {
          this.$set(this.checkList, c.userId, c)
        })
      },
      prefixCls(userId) {
        return this.checkList[userId] ? 'selected' : ''
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
      .user-block {
        @include flex;
        @include jc;
        @include ai;
        flex-direction: column;
        width: rem(45);
        min-width: rem(45);
        margin: rem(0) nth($padding, 2);
        white-space: nowrap;
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
