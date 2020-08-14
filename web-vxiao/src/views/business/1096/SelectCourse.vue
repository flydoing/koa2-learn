<template>
  <page title="上课地点" @submit="handleSubmit" hasSubmit>
    <item v-for="(item,i) in list" :key="i" @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':item.selected}"></i>
      </div>
      <div slot="main" v-html="item.name"></div>
      <div slot="remark" v-html="item.teachers[0].userName"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
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
        selection: 'getSelection'
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      fetchData() {
        const that = this
        let cMap = new Map()
        if (Check.isRealArray(this.selection.courseList)) {
          this.selection.courseList.map(v => { cMap.set(v.id, v) })
        }
        Api.getCourses(this.currentGroup.parentId, this.selection.version).then(res => {
          if (Check.isRealArray(res.courses)) {
            that.list = res.courses.filter(v => {
              v.selected = false
              return !Check.isObject(cMap.get(v.id))
            })
          }
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.list, index, item)
      },
      handleSubmit() {
        let courses = this.list.filter(v => { return v.selected })
        if (!Check.isRealArray(courses)) {
          this.$message({ type: 'warning', message: '请选择必选课程' })
          return false
        }
        if (courses.length >= this.selection.courseCount) {
          this.$message({ type: 'warning', message: '必选课程数量必须小于选课数量' })
          return false
        }
        this.setSelection({ courses: courses })
        this.routeBack()
      }
    }
  }

</script>
