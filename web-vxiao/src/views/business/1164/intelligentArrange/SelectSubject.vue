<template>
  <page title="选择科目"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      fetchData() {
        const that = this
        let sMap = new Map()
        let grade = that.arrange.grade || {}
        if (Check.isRealArray(grade.subjects)) {
          grade.subjects.map(v => {
            sMap.set(v.id, v)
          })
        }

        Api.getSubjects(this.groupId).then(res => {
          that.list = res.categorys.filter(v => {
            v.selected = false
            return Check.isNullObject(sMap.get(v.id))
          })
        })
      },
      handleSubmit() {
        let grade = this.arrange.grade
        let subs = grade.subjects || []
        let subjects = this.list.filter(v => {
          return v.selected
        })

        if (!Check.isRealArray(subjects)) {
          this.$message({ message: '请选择科目', type: 'warning' })
          return false
        }

        this.setArrangeExam({ grade: { ...grade, subjects: [...subs, ...subjects] } })
        this.routeBack()
      },
      handleSelect(item, i) {
        item.selected = !item.selected
      }
    }
  }
</script>
