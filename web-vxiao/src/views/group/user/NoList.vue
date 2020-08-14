<template>
  <Page title="学生列表"
        ref="_page">
    <Item :hasClick="false"
          slot="top"
          class="full-input search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input slot="main"
             placeholder="搜索"
             v-model="search" />
      <span slot="after"></span>
    </Item>
    <ItemList v-for="u in searchUsers"
              :key="u.id"
              @click="onUser(u)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(u.avatar),error:Image.ICO_USER}"
           alt='头像'>
      <span slot="title">{{u.name}}</span>
      <span slot="main">{{u | filterType}}</span>
      <span slot="remark"></span>
      <span slot="describe">{{u.subject}}</span>
      <template slot="after">&nbsp;</template>
    </ItemList>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import ArrayUtils from '@/utils/array'
  export default {
    mixins: [R],
    computed: {
      selectUsers() {
        return ArrayUtils.sort(this.getGroupUsers(this.groupId, '4') || [], 'studentNo').reverse()
      },
      searchUsers() {
        let search = this.search.toLowerCase()
        let arr = this.selectUsers
        if (!arr) {
          return []
        }
        if (search) {
          return this.selectUsers.filter(user => {
            return user.name.toLowerCase().indexOf(search) > -1 || user.pinyin.toLowerCase().indexOf(search) > -1
          })
        }
        return arr
      }
    },
    methods: {
      onUser(user) {
        this.routePush({
          name: 'userDetail',
          params: { userId: user.userId },
          query: {
            title: user.name
          }
        })
      }
    },
    filters: {
      filterType(u) {
        return u.studentNo || ''
      }
    }
  }
</script>
