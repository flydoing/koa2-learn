<template>
  <page title="评价科目及周期"
        @submit="handleSubmit"
        hasSubmit>
    <div class="evaluate-subject">
      <div class="category-title text">评价周期</div>
      <item class="es-time"
            :hasClick="false">
        <div slot="main">评价开始时间</div>
        <div slot="after">
          <el-date-picker v-model="startTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <item class="es-time"
            :hasClick="false">
        <div slot="main">评价结束时间</div>
        <div slot="after">
          <el-date-picker v-model="endTime"
                          prefix-icon="x"
                          :clearable="false"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"></el-date-picker>
        </div>
      </item>
      <div class="category-title text">评价科目</div>
      <item v-for="(item,i) in list"
            :key="i"
            :hasArrow="false"
            @click="handleSelect(item, i)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
        <div slot="main">{{item.name}}</div>
      </item>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  import DateUtils from '@/utils/date'
  import CategoryApi from '@/api/category'

  export default {
    mixins: [R],
    data() {
      return {
        setId: 0,
        list: [],
        startTime: '',
        endTime: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this

        Api.getSubjectSetting(this.currentGroup.parentId).then(res => {
          if (res.sets) {
            that.setId = res.sets.id || 0
            let sMap = new Map()
            if (Check.isRealArray(res.sets.courses)) {
              res.sets.courses.map(v => {
                sMap.set(parseInt(v.key), v)
              })
            }

            CategoryApi.getCategorys({
              type: '1',
              groupId: that.currentGroup.groupId
            }).then(r => {
              that.list = r.categorys.map(v => {
                sMap.get(v.id) ? (v.selected = true) : (v.selected = false)
                return v
              })
            })

            that.startTime = DateUtils.format(res.sets.startTime, DateUtils.YMD)
            that.endTime = DateUtils.format(res.sets.endTime, DateUtils.YMD)
          }
        })
      },
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.startTime)) {
          that.$message({ message: '评价开始时间不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(that.endTime)) {
          that.$message({ message: '评价结束时间不能为空', type: 'warning' })
          return false
        }
        if (new Date(that.startTime).getTime() > new Date(that.endTime).getTime()) {
          that.$message({ message: '评价开始时间不能大于结束时间', type: 'warning' })
          return false
        }

        let courses = this.list.filter(v => {
          return v.selected
        })
        if (courses.length < 1) {
          this.$message({ message: '请选择评价科目', type: 'warning' })
          return false
        }

        let postData = {
          startTime: DateUtils.format_0800(that.startTime),
          endTime: DateUtils.format_0800(that.endTime),
          courses: courses.map(v => {
            return { key: v.id, obj: v.name }
          }),
          schoolId: this.currentGroup.parentId
        }
        that.setId && (postData.id = that.setId)

        Api.commitSubjectSetting(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
      }
    }
  }
</script>
<style lang="scss">
  .evaluate-subject {
    .es-time input {
      min-width: initial !important;
    }
  }
</style>
