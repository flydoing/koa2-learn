<template>
  <page title="推送年级">
    <item v-for="(grade, g) in grades"
          :key="g"
          @click="gradeItemHandle(grade)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active': grade.isSelect}"></i>
      </div>
      <div slot="main">{{grade.name}}</div>
      <span slot="after"></span>
    </item>
    <div class="list-button"
         @click="commitSelectHandle">
      <div class="button">确定</div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        grades: []
      }
    },
    created() {
      const that = this
      Api.getPushGrade(that.routeQuery('groupId')).then(res => {
        if (res && res.code === '1') {
          that.grades = res.grades
          that.grades.forEach(g => {
            that.$set(g, 'isSelect', 0)
            that.chantPush.cacheGrade.forEach(c => {
              c === g.name && that.$set(g, 'isSelect', 1)
            })
          })
        }
      })
    },
    methods: {
      commitSelectHandle() {
        let gardeValues = []
        this.gradeShow = false
        this.grades.forEach(g => {
          g.isSelect && gardeValues.push(g.value)
        })
        Api.singleSetPushBtn({
          appType: this.routeQuery('appType'),
          coursePush: {
            courseId: this.routeQuery('courseId'),
            grades: gardeValues.join(','),
            groupId: this.routeQuery('groupId'),
            id: this.routeQuery('id'),
            ispush: 1
          }
        }).then(res => {
          this.routeBack()
          this.$message({
            type: 'success',
            message: '设置成功！'
          })
        })
      },
      gradeItemHandle(grade) {
        grade.isSelect ? this.$set(grade, 'isSelect', 0) : this.$set(grade, 'isSelect', 1)
      }
    },
    computed: {
      ...mapGetters({
        chantPush: 'getChantPush'
      })
    }
  }
</script>
