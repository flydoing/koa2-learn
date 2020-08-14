<template>
  <Page title="部门管理"
        hasSubmit
        @submit="submit">
    <div class="pd">
      <Tabs theme="theme-1"
            ref="_TAB">
        <TabPane label="入职"
                 name="R">
          <Item :hasClick="false"
                fullInput>
            <div>成员名称</div>
            <input slot="remark"
                   type="text"
                   placeholder="必填"
                   v-model="entry.name" />
          </Item>
          <Item :hasClick="false"
                fullInput>
            <div>手机号码</div>
            <input slot="remark"
                   type="text"
                   placeholder="必填"
                   v-model="entry.mobile" />
          </Item>
          <div class="category-title text"
               v-if="entryRelations.length > 0">入职部门</div>
          <Item v-for="(r,i) in entryRelations"
                :key="i"
                @click="selectDeparment(r)">
            <div slot="before">
              <i :class="prefixCls(r.groupId)"></i>
            </div>
            <div>{{r.name}}</div>
          </Item>
        </TabPane>
        <TabPane label="离职"
                 name="L">
          <Item :hasClick="false"
                fullInput
                noborder>
            <div slot="before"> <i class="ico ico-search"></i></div>
            <input placeholder="输入离职成员姓名"
                   v-model="userName" />
          </Item>
          <el-collapse accordion>
            <el-collapse-item class="ml-item"
                              v-for="(u,i) in users"
                              :key="i"
                              :item="u"
                              :name="i + 1">
              <template slot="title">
                <div class="manager-name">{{u.name}}</div>
              </template>
              <div class="manager-content">
                <div class="manager-title">{{u.name}}所在的部门</div>
                <div class="manager-block"
                     v-for="r in getRelations(u.id)"
                     :key="r.id"
                     @click="handleLeaveGroup(r)">
                  <span>{{r.groupName}}</span>
                  <span v-if="handOvers[r.groupId]">交接人：{{handOvers[r.groupId].name}}</span>
                  <span v-else></span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </TabPane>
      </Tabs>
    </div>
  </Page>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import R from '@/views/group/mixin'
  import GroupApi from '@/api/group'
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: { Tabs, TabPane },
    data() {
      return {
        entry: {
          name: '',
          mobile: ''
        },
        userName: '',
        users: [],
        relations: [],
        entryRelations: [],
        checkList: {},
        handOvers: {}
      }
    },
    computed: {},
    methods: {
      add() {},
      submit() {
        // 离职
        if (this.$refs._TAB.activeKey === 'L') {
          if (Check.isNullObject(this.handOvers)) {
            this.$message({ type: 'warning', message: '请选择所在部门的交接人' })
            return
          }
          this.users.forEach(u => {
            Api.modifyUserLeave({
              schoolId: this.currentGroup.parentId,
              fromUserId: u.id,
              relations: Object.values(this.handOvers)
            }).then(res => {
              this.$message({ type: 'success', message: '离职处理成功' })
            })
          })
        } else {
          let v = Object.values(this.checkList)
          if (Check.isNullString(this.entry.name) || Check.isNullString(this.entry.mobile)) {
            this.$message({ type: 'warning', message: '姓名和手机号码不能为空' })
            return
          }
          if (!Check.isRealArray(v)) {
            this.$message({ type: 'warning', message: '请选择需要入职的部门' })
            return
          }
          Api.modifyUserEntry({
            schoolId: this.currentGroup.parentId,
            user: this.entry,
            relations: v.map(g => {
              return { groupId: g.groupId }
            })
          }).then(res => {
            this.entry = { name: '', mobile: '' }
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          })
        }
      },
      selectDeparment(g) {
        this.checkList[g.groupId] ? this.$delete(this.checkList, g.groupId) : this.$set(this.checkList, g.groupId, g)
      },
      searchUser() {
        let that = this
        GroupApi.getUserByKeyword(this.userName, this.currentGroup.parentId).then(res => {
          that.loading = ''
          that.users = res.users
          this.relations = res.relations
        })
      },
      getRelations(userId) {
        return this.relations.filter(r => {
          return r.userId === userId
        })
      },
      handleLeaveGroup(g) {
        this.routePush({
          name: 'basiceHandover',
          query: {
            groupId: g.groupId,
            name: g.name
          }
        })
      },
      prefixCls(groupId) {
        return [
          `ico ico-select`,
          {
            [`active`]: !!this.checkList[groupId]
          }
        ]
      }
    },
    activated() {
      let u = this.getStorage('mgr_group_user')
      if (u) {
        this.$set(this.handOvers, u.groupId, u)
      }
      if (!Check.isRealArray(this.entryRelations)) {
        GroupApi.getSchoolGroupsByType(this.currentGroup.parentId, '1').then(res => {
          this.entryRelations = res.groups || []
        })
      }
    },
    watch: {
      userName() {
        this.searchUser()
      }
    }
  }
</script>
<style lang="scss">
  .manager {
    &-content {
      line-height: rem(35);
      background: nth($background, 2);
    }
    &-title {
      position: relative;
      padding-left: rem(25);
      @include before($left: 10, $top: 5) {
        width: rem(5);
        height: rem(25);
        background: nth($background, 1);
      }
    }
    &-block {
      padding: rem(0) rem(10);
      cursor: pointer;
      overflow: hidden;
      &:hover {
        background: nth($background, 1);
      }
      span:last-child {
        float: right;
      }
    }
  }
</style>
