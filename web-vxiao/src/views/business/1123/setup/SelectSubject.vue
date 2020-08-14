<template>
  <page title="适应科目"
        hasSubmit
        @submit="handleSubmit">
    <item v-for="(item, i) in list"
          :key="i"
          @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active': item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
      <div slot="remark"
           v-html="remarkTxt(item)"
           @click.stop="handleCategory(item)"></div>
    </item>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    computed: {
      ...mapGetters({
        exam: 'getExam'
      })
    },
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setExam', 'deleteExamProp']),
      remarkTxt(item) {
        return item.parentName ? item.parentName : '未定义'
      },
      fetchData() {
        let setting = this.exam.setting
        if (setting) {
          let sMap = new Map()
          let subs = this.exam.subjects || setting.subjects || []
          if (Check.isRealArray(subs)) {
            subs.map((v) => {
              sMap.set(v.id, v)
            })
          }
          this.deleteExamProp('subjects')

          if (this.exam.unselected) {
            subs = [...subs, ...this.exam.unselected]
          }

          Api.getSubjects(
            this.groupId,
            subs
              .map((v) => {
                return v.id
              })
              .join(',')
          ).then((res) => {
            this.list = res.categorys.map((v) => {
              v.selected = Check.isObject(sMap.get(v.id))
              return v
            })
          })
        }
        this.deleteExamProp('subject')
      },
      handleSubmit() {
        let subjects = this.list.filter((v) => {
          return v.selected
        })
        this.setExam({ setting: { ...this.exam.setting, subjects: subjects } })
        this.routeBack()
      },
      handleSelect(item) {
        item.selected = !item.selected
      },
      handleCategory(item, i) {
        let subjects = this.list.filter((v) => {
          return v.selected
        })
        this.setExam({ subjects: subjects, subject: item })
        this.routePush({ name: 'selectCategory1123' })
      }
    }
  }
</script>
