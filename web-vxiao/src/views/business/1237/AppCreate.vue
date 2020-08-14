<template>
  <page title="新建考勤"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="attendance-create">
      <Tabs @click="handleType"
            :showBtns="form.types.length > 1"
            :value="typeValue">
        <TabPane v-for="(item,i) in form.types"
                 :key="i"
                 :label="item.name"
                 :name="i"
                 :currentData="item"></TabPane>
      </Tabs>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handlePeriod">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">时段</div>
            <div slot="remark"
                 v-html="periodTxt"></div>
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
      <Relate :items="form.users"
              :plus="false"
              :reduce="false"
              :size="'large'"
              @edit="handleUser">
        <template slot="icon"
                  slot-scope="scope">
          <i class="ico-text"
             :data-text="getText(scope.data)"
             :class="getIconType(scope.data)" />
        </template>
      </Relate>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Tabs,
      TabPane,
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    data() {
      return {
        form: {
          users: [],
          period: null,
          types: [
            {
              name: '常规考勤',
              value: '1',
              selected: true,
              index: 0
            },
            {
              name: '扫码考勤',
              value: '2',
              selected: false,
              index: 1
            }
          ]
        },
        periods: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        getSchool: 'getSchoolBySchoolId',
        attendance: 'getAttendance'
      }),
      typeValue() {
        let type = this.form.types.filter(v => {
          return v.selected
        })[0]
        return type ? type.index : 0
      },
      periodTxt() {
        return this.form.period ? this.form.period.value : ''
      }
    },
    methods: {
      ...mapActions(['setAttendance', 'deleteAttendanceProp']),
      fetchData() {
        const that = this

        if (that.attendance.form) {
          that.form = { ...that.attendance.form }
          let user = that.attendance.user
          if (Check.isObject(user)) {
            let state = this.attendance.state
            let us = that.form.users.map(v => {
              if (v.id === user.id && state) {
                return { ...user, type: user.data.type, data: state }
              }
              return v
            })
            that.form.users = us
            that.deleteAttendanceProp('state')
            that.deleteAttendanceProp('user')
          }
        }
        Api.getAttendancePeriods(that.currentGroup.groupId).then(res => {
          that.periods = res.datas
          if (!that.form.period) {
            that.form.period = res.datas[0]
            that.loadStudents(res.datas[0].type)
          }
        })
      },
      getText(u) {
        if (u.data.type === '1') {
          return '勤'
        } else if (u.data.type === '2' || u.data.type === '7') {
          return '病'
        } else if (u.data.type === '3') {
          return '事'
        } else if (u.data.type === '4') {
          return '缺'
        } else if (u.data.type === '6') {
          return '迟'
        }
        return '其'
      },
      getIconType(u) {
        if (u.data.type === '1') {
          return 'icon-01'
        } else if (u.data.type === '2' || u.data.type === '4' || u.data.type === '7') {
          return 'icon-02'
        } else if (u.data.type === '3') {
          return 'icon-03'
        } else if (u.data.type === '6') {
          return 'icon-04'
        }
        return ''
      },
      loadStudents(type) {
        Api.getStudentList(this.currentGroup.groupId, type).then(res => {
          this.form.users = res.relations.map(v => {
            if (v.data) {
              v.data = { ...v.data, name: v.name }
            } else {
              v.data = { userId: v.userId, type: '6', name: v.name, data: '迟到' }
            }
            v.avatar = this.url(v.avatar)
            return v
          })
        })
      },
      handleType(item) {
        this.form.types = this.form.types.map(v => {
          v.selected = v.id === item.sourceData.id
          return v
        })
      },
      handlePeriod(item) {
        this.form.period = item
        this.loadStudents(item.type)
      },
      handleUser(u, i) {
        this.setAttendance({ form: this.form, user: u })
        this.routePush({ name: 'selectType1237' })
      },
      handleSubmit() {
        const that = this

        let users = []
        that.form.users.map(v => {
          users.push(
            JSON.stringify({
              ...v.data,
              groupId: that.currentGroup.groupId
            })
          )
        })

        let postData = that.constructionMessage({
          type: '123701',
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify({
            periodType: that.form.period.type,
            periodValue: that.form.period.value
          }),
          table: { data: users },
          msgType: '2'
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.deleteAttendanceProp('form')
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.deleteAttendanceProp('form')
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .attendance-create {
    .vx-relate {
      padding: rem(10) 0 !important;
      &-block {
        margin: 0 rem(5.7) !important;
      }
    }
  }

  .ico-text {
    position: absolute;
    bottom: rem(25) !important;
    right: 0 !important;
    @include icon;
    text-align: center;
    border-radius: 50%;
    line-height: rem(25);
    color: nth($font-color, 4);
    font-size: rem(12);
    background: nth($background-font, 5);
    font-style: normal;
    &:after {
      content: attr(data-text);
    }
    &.icon-01 {
      @include bc;
    }
    &.icon-02 {
      background: nth($background-font, 3);
    }
    &.icon-03 {
      background: nth($background-font, 4);
    }
    &.icon-04 {
      background: nth($background-font, 2);
    }
  }
</style>
