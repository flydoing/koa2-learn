<template>
  <page title="选择我的课程">
    <item v-if="courseGroups.length>0"
          v-for="(group, g) in courseGroups"
          :key="g"
          @click="courseItemClick(group)">
      <div slot="before">
        <img class="logo"
             v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO'>
      </div>
      <div>{{group.name}}</div>
    </item>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  import Group from '@/constant/group'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        courseGroups: []
      }
    },
    computed: {
      ...mapGetters({
        groups: 'getGroups'
      })
    },
    created() {
      this.courseGroups = this.groups.filter(group => {
        return group.type === Group.COURSE
      })
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
      courseItemClick(group) {
        this.saveClassRoomCreate({
          selectedGroup: group
        })
        this.routeReplace({
          name: 'classRoomCatalogues1269',
          query: {
            range: this.routeQuery('range'),
            groupId: group.groupId,
            groupName: group.name,
            appName: this.routeQuery('appName'),
            type: this.routeQuery('type'),
            msgType: this.routeQuery('msgType')
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .logo {
    padding: rem(10) 0;
    width: rem(120);
    height: rem(80);
  }
</style>
