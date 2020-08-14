<template>
  <page :title="title" @submit="handleSubmit" hasSubmit :hasClose="false">
    <item :hasClick="false">
      <div slot="main">最大分值</div>
      <input slot="remark" placeholder="0~100" v-model="way.score" />
      <div slot="after">分</div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import Check from '@/utils/check'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      way: {
        name: '',
        score: ''
      }
    }
  },
  created() {
    this.fectchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getStudentAppraisal'
    }),
    title() {
      return this.appraisal.wayName || ''
    }
  },
  methods: {
    ...mapActions(['setStudentAppraisal']),
    fectchData() {
      this.way = { ...this.way, ...this.appraisal.way }
    },
    handleSubmit() {
      const that = this
      let project = JSON.parse(JSON.stringify(that.appraisal.project))
      let way = that.way
      if (Check.isNullString(way.score) || parseInt(way.score) < 0 || parseInt(way.score) > 100) {
        that.$message({ message: '请输入0至100的分值', type: 'warning' })
        return false
      }
      that.setStudentAppraisal({ project: { ...project, way: { ...way, name: `${way.name}（最高${way.score}分）` } }, way: null })
      that.routeBack()
    }
  }
}

</script>
