<template>
  <Page title="添加">
    <Item :hasClick="false"
          fullInput
          class="search">
      <div slot="before"> <i class="ico ico-search"></i></div>
      <input @keyup.enter="onSearch"
             @blur="onSearch"
             placeholder="搜索编号"
             v-model="search" />
    </Item>
    <div class="category-title"></div>
    <item-list @click="onGroup"
               v-if="isMember || isTeacher">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:Image.ICO_GROUP}"
           alt='LOGO'>
      <span slot="title">创建群组</span>
      <span slot="main">通知、审批、会议...</span>
    </item-list>
    <template v-if="isTeacher">
      <item-list @click="onClass">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:Image.ICO_GROUP}"
             alt='LOGO'>
        <span slot="title">创建班级</span>
        <span slot="main">作业、评价、习题...</span>
      </item-list>
      <item-list @click="onCourse">
        <img slot="avatar"
             class="avatar"
             v-lazy="{src:Image.ICO_GROUP}"
             alt='LOGO'>
        <span slot="title">创建课程</span>
        <span slot="main">目录、资源...</span>
      </item-list>
    </template>
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return { search: '' }
    },
    computed: {
      ...mapGetters({
        userTypes: 'getUserTypes',
        groups: 'getGroupMenus'
      }),
      isMember() {
        return (
          this.userTypes.filter(type => {
            return type === '1'
          }).length > 0
        )
      },
      isTeacher() {
        return (
          this.userTypes.filter(type => {
            return type === '2'
          }).length > 0
        )
      }
    },
    created() {
      this.getStorage('_catch_search_group')
    },
    methods: {
      ...mapActions(['currentGroupId']),
      onSearch() {
        let exists = this.groups.filter(g => {
          return g.groupId === this.search
        })
        if (Check.isRealArray(exists)) {
          let g = exists[0]
          this.routePush({
            path: '/vx/group/about/Superior',
            query: {
              groupId: this.search
            }
          })
          this.currentGroupId(g.groupId)
        } else {
          if (!Check.isNullString(this.search)) {
            Api.getGroupDetail(this.search).then(res => {
              if (!res.group) {
                this.$message({ type: 'warning', message: '该群组不存在！' })
                return
              }
              this.setStorage('_catch_search_group', res.group)
              this.routePush({
                path: '/vx/group/add/search'
              })
            })
          }
        }
      },
      onClass() {
        this.routePush({
          path: '/vx/group/add/class'
        })
      },
      onGroup() {
        this.routePush({
          path: '/vx/group/add/default'
        })
      },
      onCourse() {
        this.routePush({
          path: '/vx/group/add/course'
        })
      }
    }
  }
</script>
