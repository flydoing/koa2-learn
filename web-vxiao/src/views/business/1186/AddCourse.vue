<template>
  <page title="诵读推送">
    <item-list v-for="(group, g) in courseGroups" :key="g" @click="showCourseDetail(group)">
      <img slot="avatar" class="group-avatar" v-lazy="{src:url(group.logo)}" alt='群封面'>
      <span slot="title">{{group.name}}</span>
      <span slot="main">{{group.description}}</span>
    </item-list>
    <div class="list-button" v-if="isSchool">
      <div class="button" @click="searchOhterCourse">其他课程</div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        courseGroups: [],
        isSchool: this.routeQuery('isSchool')
      }
    },
    created() {
      if (this.routeQuery('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('token')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      this.routeQuery('isSchool') && Api.addCourse(this.routeQuery('groupId'), this.routeQuery('appType')).then(res => {
        if (res && res.code === '1') {
          this.courseGroups = res.groups
        }
      }) 
      !this.routeQuery('isSchool') && Api.addClassCourse(this.routeQuery('groupId'), this.routeQuery('appType')).then(
        res => {
          if (res && res.code === '1') {
            this.courseGroups = res.groups
          }
        })
    },
    methods: {
      showCourseDetail(g) {
        this.routeQuery('isSchool') && this.routePush({
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
        !this.routeQuery('isSchool') && this.routePush({
          name: 'chantSelectedCourseResult',
          query: {
            groupId: this.routeQuery('groupId'),
            courseId: g.id,
            appType: this.routeQuery('appType'),
            isSchool: this.routeQuery('isSchool')
          }
        })
      },
      searchOhterCourse() {
        this.routePush({
          name: 'chantSearchCourse',
          query: {
            groupId: this.routeQuery('groupId'),
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
