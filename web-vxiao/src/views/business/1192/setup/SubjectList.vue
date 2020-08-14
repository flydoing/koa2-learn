<template>
  <page title="评价科目" hasSubmit @submit="selectedSubject">
    <item v-if="subjects.length>0" v-for="(subject, i) in subjects" :key="i" @click="itemClick(subject)">
      <div slot="before">
        <i :class="prefixType(subject)"></i>
      </div>
      <div>{{subject.name}}</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        subjects: []
      }
    },
    created() {
      let cache = this.template.extension
      const that = this
      Api.getAddData(this.currentGroup.groupId, 1).then(res => {
        res.categorys ? this.subjects = [...res.categorys] : this.subjects = []
        cache.forEach(c => {
          this.subjects.forEach(s => {
            if (c.id === s.id) {
              that.$set(s, 'isSelect', true)
            }
          })
        })
      }).catch(res => {})
    },
    methods: {
      ...mapActions(['saveTemplate']),
      prefixType(s) {
        return [
          'ico',
          `ico-select`,
          {
            [`active`]: s.isSelect
          }
        ]
      },
      itemClick(subject) {
        let isSelect = !subject.isSelect
        this.$set(subject, 'isSelect', isSelect)
      },
      selectedSubject() {
        let subjectArr = this.subjects.filter((s) => {
          return s.isSelect
        })
        this.saveTemplate({
          ...this.template,
          extension: [...subjectArr]
        })
        this.routeBack()
      }
    },
    computed: {
      ...mapGetters({
        template: 'getPublicCourseTemplate'
      })
    }
  }

</script>
