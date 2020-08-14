<template>
  <SelectUser title="选择成员"
              :users="users"
              :cache="cache"
              :needValidate="false"
              :multiselect="true"
              @submit="handleSubmit"></SelectUser>
</template>
<script>
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    props: {},
    components: {
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    data() {
      return {
        users: [],
        multiple: true,
        cache: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        let mMap = new Map()
        if (Check.isRealArray(this.obj.members)) {
          this.obj.members.map(v => {
            mMap.set(v.userId, v)
          })
        }
        GroupApi.getSchoolTeachers(this.currentGroup.parentId).then(res => {
          if (res.relations) {
            this.users = res.relations.filter(v => {
              return Check.isNullObject(mMap.get(v.userId))
            })
          }
        })
      },
      handleSubmit(ms) {
        this.setCreateObject({ users: ms })
        this.routeBack()
      }
    }
  }
</script>
