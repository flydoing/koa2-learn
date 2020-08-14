<template>
  <page title="课程搜索">
    <item-list v-for="(group, g) in groupList" :key="g" @click="groupItemHandle(group)">
      <img slot="avatar" class="group-avatar" v-lazy="{src:url(group.logo),error:Image.IMG_COURSE_LOGO}" alt='群封面'>
      <span slot="title">{{group.name}}</span>
      <span slot="main">{{group.description}}</span>
    </item-list>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        groupList: []
      }
    },
    created() {
      Api.getSearchResult(this.routeQuery('reqParam')).then(res => {
        if (res.code === '1') {
          this.groupList = res.groups
        }
      })
    },
    methods: {
      groupItemHandle(g) {
        this.routePush({
          name: 'chantCourseDetail',
          query: {
            logo: g.logo,
            courseGroupId: g.groupId,
            groupId: this.routeQuery('groupId'),
            courseId: g.id,
            appType: this.routeQuery('appType'),
            token: this.routeQuery('token'),
            clientId: this.routeQuery('clientId'),
            isSchool: this.routeQuery('isSchool')
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  @import '~scss/mixin';
  .group-avatar {
    padding: rem(5) 0;
    width: rem(100);
    height: rem(60);
  }

</style>
