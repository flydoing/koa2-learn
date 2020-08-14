<template>
  <SelectUser title="主讲老师" :multiselect="false" :users="users" hasSubmit @submit="handleSelect" :cache="cache" />
</template>
<script>
  import G from '@/views/group/mixin'
  import Api from './api'
  import {
    mapActions,
    mapGetters
  } from 'vuex'
  export default {
    mixins: [G],
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    computed: {
      ...mapGetters({
        cacheMain: 'getPublicCourseCreateMain'
      })
    },
    data() {
      return {
        users: [],
        cache: []
      }
    },
    created() {
      if (this.cacheMain.teacher.name !== '') {
        this.cache = [this.cacheMain.teacher]
      }
      Api.getTeacherList(this.currentGroup.groupId).then(res => {
        this.users = [...res.relations]
      })
    },
    methods: {
      ...mapActions(['savePublicCourseCreateMain']),
      handleSelect(users) {
        this.savePublicCourseCreateMain({
          teacher: users[0]
        })
        this.routeBack()
      }
    }
  }

</script>
