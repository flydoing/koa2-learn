<template>
  <page title="评估对象">
    <label slot="btn"
           v-if="isTeacher || isAdmin"
           @click="handleExport">导出</label>
    <div class="student-list">
      <item v-for="(item,i) in objects"
            :key="i"
            :item="item"
            @click="handleObject(item)">
        <div slot="before">
          <img class="avatar"
               v-lazy="{src:toAvatar(item.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="remarkTxt(item)"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        objects: [],
        apslCase: null
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
        that.msgId = this.routeParam('msgId')
        that.apslId = this.routeQuery('apslId')
        that.remark = this.routeQuery('remark')
        that.uId = that.routeQuery('uId')

        if (that.remark === '1') {
          Api.loadSummaryObjectsData(that.msgId, that.uId || that.userId).then(res => {
            that.objects = res.targetList
          })
        } else {
          Api.loadObjectsData(that.msgId, that.uId || that.userId).then(res => {
            that.apslCase = res.appraisal
            that.objects = res.targetList
          })
        }
      },
      toAvatar(value) {
        return this.url(value)
      },
      remarkTxt(item) {
        if (this.remark === '1') {
          return `${item.joinCount || 0}人参评，总平均${item.avgScore || 0}分`
        }
        return Check.isRealArray(item.answers) ? '已评' : '未评'
      },
      handleObject(item) {
        let params = {
          name: 'apslDetail1178',
          params: {
            msgId: this.msgId
          },
          query: {}
        }
        if (this.uId) {
          params.query.uId = this.uId
        }
        if (this.remark === '1') {
          params.query.apslId = this.apslId
        }
        params.query.remark = this.remark
        this.setTeacherAppraisal({ apslCase: this.apslCase, user: item })
        this.routePush(params)
      },
      handleExport() {
        this.openBrowser(`/business/teacherappraisal/history/export/${this.apslId}`)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .student-list {
    img {
      margin: rem(5) 0;
    }
  }
</style>
