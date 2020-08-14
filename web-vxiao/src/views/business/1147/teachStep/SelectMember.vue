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
  import Api from '../api'
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
        let cell = this.obj.teachCache
        Api.getTeachTeachers(this.currentGroup.parentId, cell.campusId, cell.courseId).then(res => {
          if (res.teachers) {
            this.users = res.teachers.filter(v => {
              return Check.isNullObject(mMap.get(v.userId))
            })
          }
        })
      },
      handleSubmit(ms) {
        let cell = this.obj.teachCache
        Api.modifyTeachInfo({
          cell: {
            courseId: cell.courseId,
            groupId: cell.groupId,
            relations: ms.map(v => {
              return {
                userId: v.userId,
                name: v.name,
                status: '1'
              }
            })
          }
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.setCreateObject({ users: ms })
          this.routeBack()
        })
      }
    }
  }
</script>
