<template>
  <page :title="title">
    <template v-if="!unselected">
      <item :label="sTitle"
            :remark="sName"
            :hasClick="false"></item>
      <div class="category-title"></div>
    </template>
    <item v-for="(user,i) in students"
          :key="i"
          :hasClick="false"
          :label="itemTxt(user)"
          :remark="scoreTxt(user)">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        students: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      },
      type() {
        return this.routeQuery('type')
      },
      sTitle() {
        return this.type === '1' ? '科目' : '组合'
      },
      sName() {
        return this.routeQuery('name') || ''
      },
      unselected() {
        let value = this.routeQuery('unselected')
        return value === '1'
      }
    },
    methods: {
      itemTxt(user) {
        if (this.unselected) {
          return `${user.name}（${user.gname}）`
        }
        return `${user.rank}、${user.name}（${user.gname}）`
      },
      scoreTxt(user) {
        if (this.unselected) {
          return ''
        }
        return `${user.score}分`
      },
      fetchData() {
        let pid = this.routeQuery('pid')
        let sid = this.routeQuery('sid')
        if (this.unselected) {
          Api.getUnselectedStudents(pid).then(res => {
            this.students = res.datas || []
          })
        } else {
          Api.getSelectedStudents(pid, sid, this.type).then(res => {
            this.students = res.datas || []
          })
        }
      }
    }
  }
</script>
