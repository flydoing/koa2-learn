<template>
  <page title="诵读推送">
    <item-list v-for="(group, g) in courseGroups"
               :key="g"
               @click="groupItemHandle(group)">
      <img slot="avatar"
           class="group-avatar"
           v-lazy="{src:url(group.logo),error:Image.IMG_COURSE_LOGO}"
           alt='群主封面'>
      <span slot="title">{{group.name}}</span>
      <span slot="main">{{group.description}}</span>
    </item-list>
    <div class="list-button">
      <div class="button"
           @click="addCourseHandle">添加课程</div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        courseGroups: []
      }
    },
    created() {
      if (this.routeQuery('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('token')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      this.routeQuery('isSchool') &&
        Api.getSelectedCourse(this.routeQuery('groupId'), this.routeQuery('appType')).then(res => {
          if (res && res.code === '1') {
            this.courseGroups = res.groups
          }
        })
      !this.routeQuery('isSchool') &&
        Api.getClassSelectedCourse(this.routeQuery('groupId'), this.routeQuery('appType')).then(res => {
          if (res && res.code === '1') {
            this.courseGroups = res.groups
          }
        })
    },
    methods: {
      addCourseHandle() {
        this.routePush({
          name: 'chantAddCourse',
          query: {
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType'),
            token: this.routeQuery('token'),
            clientId: this.routeQuery('clientId'),
            isSchool: this.routeQuery('isSchool')
          }
        })
      },
      groupItemHandle(g) {
        this.routePush({
          name: 'chantSelectedCourseResult',
          query: {
            groupId: this.routeQuery('groupId'),
            courseId: g.id,
            appType: this.routeQuery('appType'),
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
