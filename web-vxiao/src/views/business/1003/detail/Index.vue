<template>
  <page title="详情">
    <Table1003 :tableData="tableDatas"></Table1003>
  </page>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from '../api.js'
  export default {
    mixins: [CardMixin],
    components: {
      Table1003: resolve => require(['@/components/table/Table'], resolve)
    },
    data() {
      return {
        tableDatas: {}
      }
    },
    created() {
      Api.getTableDetail(this.currentGroup.groupId, this.routeQuery('msgId')).then(res => {
        if (res && res.code === '1') {
          // this.tableDatas = res.
          this.ruleTableData(res.data)
        }
      })
    },
    methods: {
      ruleTableData(t) {
        // 展示只针对学生、家长，老师端展示所有内容
        // 表头
        let th = ['姓名']
        if ((t.showTotalScore) && ((!t.isTeacher && !t.level) || (t.isTeacher && t.showScore)) && (t.courses.length !==
            1)) {
          // 当打开展示总分选项 并且 非老师并且不展示等级或者老师并且展示分数 并且主科目有多个的时候 --显示总分表头
          th.push('总分')
        }
        if ((t.reportcard.rankSwitch === '1') || (t.isTeacher && t.showScore)) {
          // 打开 排名 或者 是老师身份并且有分数的时候 展示排名
          th.push('总分排名')
        }
        t.courses.forEach((c, i) => {
          // 当科目是主科目 并且 科目排名不打开或者老师并且展示分数 并且展示主科目排名 --显示主科目排名表头 否则 展示不展示主科目表头
          if ((c.remark) && ((!t.reportcard.rankSwitch === '1') || (t.isTeacher && t.showScore)) && (t.showMainRank)) {
            th.push(c.name, c.name + '排名')
          } else {
            th.push(c.name)
          }
        })
        let datas = [] // 表格内容
        t.summarys.forEach((row, r) => {
          let temObj = {}
          temObj.clickAble = false
          temObj.columns = []
          temObj.columns.push(row.name)
          // 当打开展示总分 并且 不是老师并且不打开展示等级或者是老师并且展示分数 显示分数，保留一位小数
          if (t.showTotalScore && ((!t.isTeacher && !t.level) || (t.isTeacher && t.showScore))) {
            temObj.columns.push(row.score.toFixed(1))
          }
          if ((t.reportcard.rankSwitch === '1') || (t.isTeacher && t.showScore)) {
            row.classRank && row.classRank > 0 ? temObj.columns.push(row.classRank) : temObj.columns.push('')
          }
          row.datas.forEach((childDatas, c) => {
            if (!t.isTeacher && t.level && childDatas.remark) {
              temObj.columns.push(childDatas.level)
            } else {
              if (childDatas.score >= 0) {
                temObj.columns.push(childDatas.score.toFixed(1))
              } else if (childDatas.level) {
                temObj.columns.push(childDatas.level)
              } else {
                temObj.columns.push(childDatas.notest)
              }
            }
            if ((childDatas.remark) && ((t.reportcard.rankSwitch === '1') || (t.isTeacher && t.showScore)) && (
                t.showMainRank)) {
              childDatas.rank ? temObj.columns.push(childDatas.rank) : temObj.columns.push('\\')
            }
          })
          datas.push(temObj)
        })
        this.$set(this.tableDatas, 'columns', th)
        this.$set(this.tableDatas, 'datas', datas)
      }
    }
  }

</script>
