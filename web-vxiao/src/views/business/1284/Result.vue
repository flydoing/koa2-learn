<template>
  <page :title="title"
        listenBack
        @back="handleBack"
        hasSubmit
        @submit="handleSubmit">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handlePeriod">
      <div class="el-dropdown-link">
        <item label="时段"
              :remark="periodTxt">
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(item,i) in periods"
                          :key="i"
                          :command="item">{{item.value}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="category-title"></div>
    <template v-if="form.users.length>0">
      <item v-for="(user,i) in form.users"
            :remark="remarkTxt(user)"
            :key="i"
            @click="handleUser(user)"
            :label="user.name">
        <div slot="before">
          <img class="avatar small"
               v-lazy="{src:url(user.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
      </item>
    </template>
    <template v-else>
      <CardTips text="暂无内容" />
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  // import CategoryApi from '@/api/category'
  import Api from './api'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'

  export default {
    mixins: [R, MixinMessage],
    components: {
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    data() {
      return {
        categories: [],
        form: {
          users: [],
          period: null
        },
        periods: []
      }
    },
    mounted() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      },
      ...mapGetters({
        attendance: 'getAttendance'
      }),
      periodTxt() {
        return this.form.period ? this.form.period.value : ''
      }
    },
    methods: {
      ...mapActions(['setAttendance', 'deleteAttendanceProp']),
      remarkTxt(user) {
        return user.data ? user.data.data : ''
      },
      fetchData() {
        // CategoryApi.getCategorysByType('150').then(res => {
        //   this.categories = res.categorys.filter(v => {
        //     return v.value === '1' || v.value === '4'
        //   })
        // })
        const that = this
        if (that.attendance.form) {
          that.form = { ...that.attendance.form }
          let user = that.attendance.user
          if (Check.isObject(user)) {
            let state = this.attendance.state
            let us = that.form.users.map(v => {
              if (v.userId === user.userId && state) {
                return { ...user, type: user.data.type, data: state }
              }
              return v
            })
            that.form.users = us
            that.deleteAttendanceProp('state')
            that.deleteAttendanceProp('user')
          }
          that.deleteAttendanceProp('form')
        }
        Api.getAttendancePeriods(this.groupId).then(res => {
          this.periods = res.datas || []
          if (!this.form.period) {
            this.form.period = res.datas[0]
            this.loadStudentData()
          }
        })
      },
      loadStudentData() {
        let dormitory = this.attendance.dormitory
        Api.getStudents(dormitory.id, this.form.period.type).then(res => {
          if (res.relations) {
            this.form.users = res.relations.map(v => {
              if (v.data) {
                v.data = { ...v.data, name: v.name }
              } else {
                v.data = { userId: v.userId, type: '1', name: v.name, data: '已出勤' }
              }
              return v
            })
          }
        })
      },
      handlePeriod(item) {
        this.form.period = item
        this.loadStudentData()
      },
      handleUser(user) {
        this.setAttendance({ form: this.form, user: user })
        this.routePush({ name: 'selectType1237' })
      },
      handleSubmit() {
        const that = this
        let dormitory = this.attendance.dormitory
        let users = []
        that.form.users.map(v => {
          users.push(
            JSON.stringify({
              ...v.data,
              groupId: v.groupId,
              placeId: dormitory.id
            })
          )
        })

        let postData = that.constructionMessage({
          type: '128401',
          groupId: that.groupId,
          msgJson: JSON.stringify({
            periodType: that.form.period.type,
            periodValue: that.form.period.value
          }),
          table: { data: users },
          msgType: '3'
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
