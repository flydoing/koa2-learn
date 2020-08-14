<template>
  <page title="评估范围" @submit="handleSubmit" hasSubmit>
    <div v-for="(item, i) in ranges" :key="i">
      <div class="category-title text" v-html="item.name"></div>
      <item @click="handleAppraiser(item)">
        <div slot="main">评估人</div>
        <div slot="remark" v-html="appraiserTxt(item)"></div>
      </item>
      <item @click="handleAppraised(item)">
        <div slot="main">被评估人</div>
        <div slot="remark" v-html="appraisedTxt(item)"></div>
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
      ranges: [{
        appraisers: [],
        appraiseds: [],
        name: '群组',
        value: '1',
        total: 0
      }, {
        appraisers: [],
        appraiseds: [],
        name: '班级',
        value: '2',
        total: 0
      }]
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters({
      appraisal: 'getTeacherAppraisal'
    })
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
    fetchData() {
      const that = this
      if (Check.isRealArray(that.appraisal.ranges)) {
        that.ranges = [...that.appraisal.ranges]
      }

      let total = that.appraisal.total
      if (that.appraisal.objects) {
        that.ranges[0] = { ...that.ranges[0], appraisers: that.appraisal.objects, total: total }
      }

      if (that.appraisal.classes) {
        that.ranges[1] = { ...that.ranges[1], appraisers: that.appraisal.classes }
      }

      if (that.appraisal.roles) {
        let range = that.appraisal.range
        that.ranges = that.ranges.map(v => {
          if (v.value === range.value) {
            return { ...v, appraiseds: that.appraisal.roles }
          }
          return v
        })
      }
    },
    appraiserTxt(item) {
      if (item.value === '1') {
        return item.total ? `${item.total}人` : ''
      }
      return item.appraisers.length > 0 ? `${item.appraisers.length}个班` : ''
    },
    appraisedTxt(item) {
      return item.appraiseds ? item.appraiseds.map(v => { return v.name }).join('、') : ''
    },
    handleSubmit() {
      const that = this
      let gAppraisers = []
      let cAppraisers = []
      let gRoles = []
      let cRoles = []
      that.ranges.map(v => {
        if (v.value === '1') {
          gAppraisers = v.appraisers
          gRoles = v.appraiseds
        } else {
          cAppraisers = v.appraisers
          cRoles = v.appraiseds
        }
      })
      if (gAppraisers.length < 1 && cAppraisers.length < 1) {
        that.$message({ message: '请选择评估范围', type: 'warning' })
        return false
      }

      if (gAppraisers.length < 1 && gRoles.length > 0) {
        that.$message({ message: '请选择群组评估人', type: 'warning' })
        return false
      }

      if (gAppraisers.length > 0 && gRoles.length < 1) {
        that.$message({ message: '请选择群组被评估人', type: 'warning' })
        return false
      }

      if (cAppraisers.length < 1 && cRoles.length > 0) {
        that.$message({ message: '请选择班级评估人', type: 'warning' })
        return false
      }

      if (cAppraisers.length > 0 && cRoles.length < 1) {
        that.$message({ message: '请选择班级被评估人', type: 'warning' })
        return false
      }

      that.setTeacherAppraisal({ ranges: that.ranges })
      that.routeBack()
    },
    handleAppraiser(item) {
      if (item.value === '2') {
        this.setTeacherAppraisal({ ranges: this.ranges, classes: item.appraisers })
        this.routePush({ name: 'selectClass1178' })
      } else {
        this.setTeacherAppraisal({ ranges: this.ranges, objects: item.appraisers })
        this.routePush({ name: 'selectGroup1178' })
      }
    },
    handleAppraised(item) {
      this.setTeacherAppraisal({ ranges: this.ranges, range: item, roles: item.appraiseds })
      this.routePush({ name: 'selectRole1178' })
    }
  }
}

</script>
