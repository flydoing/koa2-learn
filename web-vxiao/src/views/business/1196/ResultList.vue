<template>
  <page title="评估结果"
        @submit="handleSubmit"
        hasSubmit>
    <div class="template-setting">
      <item v-for="(item, i) in list"
            :key="i"
            :item="item"
            @click="handleItem(item)">
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="scoreTxt(item)"></div>
      </item>
      <item @click="handleAdd"
            :hasArrow="false">
        <div slot="before">
          <i class='ico ico-plus' />
        </div>
        <div slot="main">新标准</div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
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
        appraisal: 'getStudentAppraisal'
      })
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fetchData() {
        const that = this
        let results = this.appraisal.results
        if (Check.isRealArray(results)) {
          that.list = that.sortData(results)
        }
      },
      scoreTxt(item) {
        return item.type !== '0' ? `${item.score}以上` : `${item.score}以下`
      },
      // 比较分数高低
      compareScore(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      // 数据排序
      sortData(datas) {
        // 最低值
        let lowest = datas.filter(v => {
          return v.type !== '1'
        })[0]
        let dts = datas.filter(v => {
          return v.type !== '0'
        })
        // 数据排序
        dts.sort(this.compareScore('score')).reverse()
        dts.push(lowest)
        return dts
      },
      handleAdd() {
        this.setStudentAppraisal({ result: null })
        this.routePush({ name: 'resultEdit1196' })
      },
      handleItem(item) {
        this.setStudentAppraisal({ result: item })
        this.routePush({ name: 'resultEdit1196' })
      },
      handleSubmit() {
        let rs = this.list
        if (this.appraisal.isTemplate) {
          this.setStudentAppraisal({
            template: { ...this.appraisal.template, results: rs, resultTxt: rs.length ? `${rs.length}级` : '' },
            results: []
          })
        } else {
          this.setStudentAppraisal({
            project: { ...this.appraisal.project, results: rs, resultTxt: rs.length ? `${rs.length}级` : '' },
            results: []
          })
        }
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .template-setting {
    .remark-txt {
      color: #999;
      font-size: rem(13);
    }
  }
</style>
