<template>
  <page title="选拔详情">
    <div class="selection-detail">
      <item @click="handleModifyTime">
        <div slot="main">选拔时间</div>
        <div slot="remark"
             v-html="timeTxt"></div>
      </item>
      <div class="category-title"></div>
      <item v-for="(item,i) in detail.courses"
            :key="i"
            @click="handleCourse(item)">
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark">{{item.joined}}/{{item.upperLimit}}已选</div>
      </item>
      <div v-if="isWeb"
           class="button button-common"
           @click="handleExport">导出</div>
      <div class="button button-common"
           :class="{'disabled': hasGenerate}"
           @click="handleGenerate">一键生成课程空间</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        detail: {},
        hasGenerate: false
      }
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      }),
      timeTxt() {
        if (!Check.isNullString(this.detail.startTime) && !Check.isNullString(this.detail.endTime)) {
          let sTime = DateUtils.format(this.detail.startTime, DateUtils.MDHM)
          let eTime = DateUtils.format(this.detail.endTime, DateUtils.MDHM)
          return `${sTime} 至 ${eTime}`
        }
        return ''
      },
      isWeb() {
        if (/android/i.test(navigator.userAgent)) {
          return false
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          return false
        }
        return true
      }
    },
    created() {
      let pId = this.routeQuery('pId')
      Api.getSelectionDetail(pId).then(res => {
        this.detail = res.publish
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      handleModifyTime() {
        this.routePush({
          name: 'modifyTime1096',
          query: { pId: this.detail.id }
        })
      },
      handleCourse(item) {
        let query = {}
        let uId = this.routeQuery('userId')
        let sId = this.routeQuery('schoolId')
        if (uId && sId) {
          query = { userId: uId, schoolId: sId }
        }
        this.setSelection({ course: item, publish: this.detail })
        this.routePush({ name: 'enrollInfo1096', query: query })
      },
      handleExport() {
        this.openBrowser(`/business/optioncourse/export/publish?publishId=${this.detail.id}`)
      },
      handleGenerate() {
        this.hasGenerate = true
      }
    }
  }
</script>
