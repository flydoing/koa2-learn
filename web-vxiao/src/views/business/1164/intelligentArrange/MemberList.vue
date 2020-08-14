<template>
  <page title="监考人员"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <Relate :items="us"
            @plus="handleAdd"
            @delete="handleRemove" />
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      us() {
        return this.users.map(v => {
          return { ...v, avatar: this.url(v.avatar) }
        })
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      fetchData() {
        if (this.arrange.members) {
          this.users = [...this.arrange.members]
          this.deleteArrangeExamProp('members')
        } else if (this.arrange.place) {
          this.users = JSON.parse(JSON.stringify(this.arrange.place.users || []))
        }
        this.deleteArrangeExamProp('filters')
      },
      handleAdd() {
        // 过滤已安排的监考人员
        let filters = []
        let invigilate = this.arrange.invigilate
        let place = this.arrange.place || {}
        if (invigilate) {
          invigilate.places.map(v => {
            if (Check.isRealArray(v.users) && v.examPlaceId !== place.examPlaceId) {
              filters.push(...v.users)
            }
          })
        }
        this.setArrangeExam({ filters: [...filters, ...this.users], members: this.users })
        this.routePush({ name: 'selectGroup1164' })
      },
      handleRemove(user, i) {
        this.users.splice(i, 1)
      },
      handleSubmit() {
        if (!Check.isRealArray(this.users)) {
          this.$message({ message: '监考成员不能为空', type: 'warning' })
          return false
        }
        this.setArrangeExam({ place: { ...this.arrange.place, users: this.users } })
        this.routeBack()
      }
    }
  }
</script>
