<template>
  <SelectUser title="任教老师"
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
        let cache = this.obj.electiveCache
        let schedule = this.obj.form.schedule
        Api.getTeachTeachers(this.currentGroup.parentId, schedule.grades[0].campusId, cache.subjectId).then(res => {
          if (res.teachers) {
            this.users = res.teachers || []
          }
        })
      },
      handleSubmit(ms) {
        if (!Check.isRealArray(ms)) {
          this.$message({ message: '请选择任教老师', type: 'warning' })
          return false
        }
        let form = this.obj.form
        let cache = this.obj.electiveCache
        Api.modifyElectiveInfo({
          subjects: [
            {
              scheduleId: form.schedule.id,
              serial: cache.serial,
              subjectId: cache.subjectId,
              subjectName: cache.subjectName,
              teachers: ms.map(v => {
                return {
                  userId: v.userId,
                  userName: v.name
                }
              })
            }
          ]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.setCreateObject({ electiveCache: res.subjects[0] })
          this.routeBack()
        })
      }
    }
  }
</script>
