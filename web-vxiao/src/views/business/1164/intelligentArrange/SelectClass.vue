<template>
  <page :title="title"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全选</div>
    </item>
    <div class="category-title"
         v-if="list.length>0"></div>
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
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      all() {
        const that = this
        if (Check.isRealArray(that.list)) {
          let selected = that.list.filter(v => {
            return v.selected
          })
          return selected.length === that.list.length
        }
        return false
      }
    },
    methods: {
      ...mapActions(['setArrangeExam']),
      fetchData() {
        const that = this
        let grade = that.arrange.grade || {}
        if (Check.isRealArray(grade.classes)) {
          that.list = JSON.parse(JSON.stringify(grade.classes))
        }
      },
      handleSubmit() {
        let grade = this.arrange.grade
        let classes = this.list.filter(v => {
          return v.selected
        })

        if (!Check.isRealArray(classes)) {
          this.$message({ message: '请选择考试班级', type: 'warning' })
          return false
        }

        this.setArrangeExam({ grade: { ...grade, classes: this.list } })
        this.routeBack()
      },
      handleSelect(item, i) {
        item.selected = !item.selected
      },
      handleAll() {
        let all = this.all
        this.list = this.list.map(v => {
          v.selected = all
          return v
        })
      }
    }
  }
</script>
