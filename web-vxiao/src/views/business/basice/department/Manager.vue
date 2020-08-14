<template>
  <Page title="部门管理"
        hasSubmit
        @submit="submit">
    <div class="pd">
      <Tabs theme="theme-1">
        <TabPane label="入职">
          <Item :hasClick="false"
                fullInput>
            <div>成员名称</div>
            <input slot="remark"
                   type="text"
                   placeholder="必填" />
          </Item>
          <Item :hasClick="false"
                fullInput>
            <div>手机号码</div>
            <input slot="remark"
                   type="text"
                   placeholder="必填" />
          </Item>
          <div class="category-title text">入职部门</div>
          <Item v-for="g in groups"
                :key="g.groupId">
            <div slot="before">
              <i class="ico ico-select" />
            </div>
            <div>{{g.name}}</div>
          </Item>
        </TabPane>
        <TabPane label="离职">
          <Item :hasClick="false"
                fullInput>
            <div slot="before"> <i class="ico ico-search"></i></div>
            <input placeholder="输入离职成员姓名"
                   v-model="userName" />
          </Item>
          <Item v-for="u in users"
                :key="u.userId">
            <div>{{u.name}}</div>
            <div slot="remark">{{u.mobile}}</div>
          </Item>
        </TabPane>
      </Tabs>
    </div>
  </Page>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import R from '@/views/group/mixin'
  import Api from '@/api/user'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R],
    components: { Tabs, TabPane },
    data() {
      return {
        userName: '',
        loading: '',
        users: [],
        groups: []
      }
    },
    created() {
      GroupApi.getSchoolGroupsByType(this.currentGroup.parentId, '1').then(res => {
        this.groups = res.groups || []
      })
    },
    methods: {
      add() {},
      submit() {},
      searchUser() {
        let that = this
        Api.getUserByKeyword(this.userName, this.groupId).then(res => {
          that.loading = ''
          that.users = res.users
        })
      }
    },
    watch: {
      userName() {
        this.loading = '加载中...'
        this.searchUser()
      }
    }
  }
</script>
