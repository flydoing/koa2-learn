<template>
  <Page v-if="'new'===viewType"
        title="编辑储物格">
    <item :hasClick='false'>
      <div slot="main">储物格</div>
      <div slot="remark"
           class="ellipsis">{{user.boxName}}、{{user.boxnum}}</div>
    </item>
    <item :hasClick="true"
          @click="clickClass">
      <div slot="main">班级</div>
      <div slot="remark"
           class="ellipsis">{{user.gname}}</div>
    </item>
    <item :hasClick="true"
          @click="clickUser">
      <div slot="main">姓名</div>
      <div slot="remark"
           class="ellipsis">{{user.uname}}</div>
    </item>
    <div class="list-button">
      <el-button type="primary"
                 icon="el-icon-upload"
                 size="medium"
                 @click="clickSubmit()">提交</el-button>
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="clickRemove()"
                 v-if="isEdit">移除</el-button>
    </div>
  </Page>
  <Page v-else-if="'group'===viewType"
        title="群组选择">
    <SelectGroup @change="selectGroup"
                 :groups="groups"
                 :cache="cacheGroup" />
  </Page>
  <SelectUser v-else-if="'user'===viewType"
              @change="selectUser"
              title="选择成员"
              :users="users"
              :multiselect="false"
              @remark="remarkTxt"
              :cache="cacheUser" />
</template>
<script>
  import Api from '../api'
  import GroupApi from '@/api/group'
  import UserEnum from '@/constant/user'
  import Check from '@/utils/check'
  export default {
    components: {
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve),
      SelectUser: resolve => require(['@/views/components/group/SelectUser'], resolve)
    },
    created() {
      this.user = this.$route.query
    },
    data() {
      return {
        viewType: 'new',
        user: {},
        groups: [],
        cacheGroup: [], // 当前选择的群
        users: [],
        cacheUser: [] // 当前选择的用户
      }
    },
    computed: {
      isEdit() {
        return !Check.isNull(this.user.userId)
      }
    },
    methods: {
      clickClass() {
        this.viewType = 'group'
        if (!Check.isRealArray(this.groups)) {
          GroupApi.getSchoolAllGroups(this.user.schoolId).then(res => {
            if (Check.isRealArray(res.classes)) {
              this.groups = [...res.classes, ...res.groups]
            }
          })
        }
      },
      remarkTxt(u, cback) {
        let gender = u.sex === '1' ? '男' : '女'
        if (u.height) {
          cback(`${gender}，${u.height}CM`)
        } else {
          cback(gender)
        }
      },
      clickUser() {
        if (Check.isNull(this.user.groupId)) {
          this.$message({ message: '请先选择班级', type: 'warning' })
          return null
        }
        this.viewType = 'user'
        if (!Check.isRealArray(this.users)) {
          GroupApi.getGroupUsers(this.user.groupId).then(res => {
            this.users = res.relations.filter(u => {
              return u.userType === UserEnum.STUDENT.key
            })
          })
        }
      },
      clickSubmit() {
        const that = this
        const loading = that.$loading({
          text: '提交中',
          background: 'rgba(255, 255, 255, .3)'
        })
        Api.saveOrUpdateBox({
          allots: [
            {
              ...that.user,
              ...{ status: '1' }
            }
          ]
        })
          .then(res => {
            loading.close()
            if (Check.isRealArray(res.allots)) {
              that.$message({ message: that.isEdit ? '修改成功' : '添加成功', type: 'success' })
              that.routeBack()
            }
          })
          .catch(res => loading.close())
      },
      clickRemove() {
        const that = this
        this.$confirm('确定移除绑定？', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              Api.saveOrUpdateBox({
                allots: [
                  {
                    ...that.user,
                    ...{ status: 'd' }
                  }
                ]
              }).then(res => {
                done()
                instance.confirmButtonLoading = false
                if (Check.isRealArray(res.allots)) {
                  that.$message({ message: '移除成功', type: 'success' })
                }
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
      },
      selectGroup(g) {
        this.viewType = 'new'
        this.$set(this.user, 'groupId', g.groupId)
        this.$set(this.user, 'gname', g.name)
        this.cacheGroup = g
      },
      selectUser(u) {
        this.viewType = 'new'
        this.$set(this.user, 'userId', u.userId)
        this.$set(this.user, 'uname', u.name)
        this.cacheUser = u
      }
    },
    mounted() {}
  }
</script>
<style lang="scss"></style>
