<template>
  <page title="评价结果">
    <item v-if="grades.length>0" v-for="(grade, g) in grades" :key="g" @click="itemEdit(g)">
      <div>{{grade.obj}}</div>
      <div slot="remark">{{grade.key}}{{(gradeText(grade))}}</div>
    </item>
    <item @click="addGrade">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div>新标准</div>
    </item>
  </page>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        grades: []
      }
    },
    created() {
      let gradeArr = this.template.metaDatas
      if (Check.isRealArray(gradeArr)) {
        this.grades = [...gradeArr]
        this.grades = this.grades.sort(this.sortFn('key'))
      }
    },
    methods: {
      gradeText(s) {
        return Number(s.extension) ? '分以上' : '分以下'
      },
      addGrade() {
        this.routePush({
          name: 'ResultCreateAndEdit1192'
        })
      },
      itemEdit(g) {
        this.routePush({
          name: 'ResultCreateAndEdit1192',
          query: {
            index: g,
            isEdit: true
          }
        })
      },
      sortFn(key) {
        return (a, b) => {
          let v1 = Number(a[key])
          let v2 = Number(b[key])
          if (v1 < v2) {
            return 1
          } else {
            return -1
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        template: 'getPublicCourseTemplate'
      })
    }
  }

</script>
