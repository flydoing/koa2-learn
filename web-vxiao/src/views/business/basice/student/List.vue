<!-- 学生列表 -->
<template>
  <Page title="学生信息"
        :loading="loading">
    <vx-table :data="students"
              :height="maxHeight"
              stripe
              @row-click="onRowClick">
      <vx-table-column label="学生姓名"
                       prop="name"
                       fixed
                       width="120" />
      <vx-table-column label="入学年份"
                       width="100">
        <template slot-scope="scope">
          {{scope.row.group ? scope.row.group.name : ''}}
        </template>
      </vx-table-column>
      <vx-table-column label="学段"
                       width="100">
        <template slot-scope="scope">
          {{scope.row.group ? scope.row.group.gradeType : ''}}
        </template>
      </vx-table-column>
      <vx-table-column label="校区"
                       width="100">
        <template slot-scope="scope">
          {{scope.row.group ? scope.row.group.campus : ''}}
        </template>
      </vx-table-column>
      <vx-table-column label="班级名称"
                       prop="groupName"
                       width="120" />
      <vx-table-column label="手机号码"
                       prop="mobile"
                       width="120" />
      <vx-table-column label="人脸信息"
                       width="150">
        <template slot-scope="scope">
          <img class="avatar big"
               v-lazy="{src:url(scope.row.face || scope.row.avatar),error:Image.ICO_AVATAR}">
        </template>
      </vx-table-column>
      <vx-table-column label="身份证号码"
                       prop="idCard"
                       width="150" />
      <vx-table-column label="学号"
                       prop="studentNo"
                       width="150" />
      <vx-table-column label="学籍号"
                       prop="studentCode"
                       width="120" />
      <vx-table-column label="性别"
                       width="50">
        <template slot-scope="scope">
          {{scope.row.sex === "1" ? "女" : "男"}}
        </template>
      </vx-table-column>
      <vx-table-column label="生日"
                       prop="name">
        <template slot-scope="scope">
          {{dateFormat(scope.row.birthDay)}}
        </template>
      </vx-table-column>
      <vx-table-column label="名族"
                       width="50"
                       prop="national" />
      <vx-table-column label="是否住校">
        <template slot-scope="scope">
          {{scope.row.isStay === 1 ? "住宿" : "不住宿"}}
        </template>
      </vx-table-column>
      <vx-table-column label="是否开通帐号"
                       width="120">
        <template slot-scope="scope">
          {{scope.row.openAccount === "1" ? "开通" : "未开通" }}
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
  import DateUtils from '@/utils/date'
  import Api from '../api'
  import Cammand from '@/constant/cammand'
  import Check from '@/utils/check'
  export default {
    created() {
      // 禁用iOS滚动条
      this.$web.postJsAction({
        type: Cammand.ACTION_SCROLL_ENABLE,
        content: 0
      })
    },
    computed: {},
    data() {
      return {
        maxHeight: 100,
        loading: true,
        students: []
      }
    },
    methods: {
      onRowClick(t, i) {
        if (!t.group) {
          t.group = {}
        }
        this.setStorage('_cache_student', t)
        this.routePush({
          name: 'basiceStudentDetail'
        })
      },
      dateFormat(birthDay) {
        return DateUtils.format(birthDay, DateUtils.YMD)
      }
    },
    watch: {},
    activated() {
      let gradeId = this.routeQuery('gradeId')
      let keyword = this.routeQuery('keyword')
      if (gradeId) {
        Api.loadStudentByGid(this.routeQuery('schoolId'), gradeId)
          .then(res => {
            if (Check.isRealArray(res.relations)) {
              this.students = res.relations.map(v => {
                v.group = res.group
                return v
              })
            } else {
              this.students = []
            }
            this.loading = false
          })
          .catch(res => {
            this.students = []
            this.loading = false
          })
      } else if (keyword) {
        Api.loadStudentByGid(this.routeQuery('schoolId'), null, keyword)
          .then(res => {
            this.students = res.relations || []
            this.loading = false
          })
          .catch(res => {
            this.students = []
            this.loading = false
          })
      }
    }
  }
</script>
