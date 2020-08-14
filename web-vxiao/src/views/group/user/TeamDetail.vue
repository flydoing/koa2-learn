<template>
  <Page :title="team.name">
    <Avatar @success="handleLogo">
      <Item>
        <div>头像</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(team.logo,'thumb'),error:Image.ICO_GROUP}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item @click="handleName">
      <div>小组名称</div>
      <div slot="remark"
           class="ellipsis">{{team.name}}</div>
    </Item>
    <el-popover placement="bottom-end"
                width="300"
                trigger="click"
                v-model="showMember">
      <Scroller :height="500">
        <item v-for="(u,i) in members"
              :key="i"
              @click="handleMember(u)">
          <div slot="before">
            <img class="avatar"
                 v-lazy="{src:url(u.avatar),error:Image.ICO_USER}"
                 alt='头像' />
          </div>
          <div slot="main"
               v-html="u.name"></div>
        </item>
      </Scroller>
      <Item slot="reference">
        <div>小组长</div>
        <div slot="remark"
             v-if="master"
             class="ellipsis"
             v-html="master.name"></div>
      </Item>
    </el-popover>
    <Relate :items="users"
            :plus="isAdmin"
            :reduce="isAdmin"
            @plus="handleAdd"
            @delete="handleRemove" />
  </Page>
</template>
<script>
import Api from '@/api/group'
import R from '@/views/group/mixin'
import Check from '@/utils/check'
export default {
  mixins: [R],
  components: {
    Avatar: resolve => require(['@/views/components/Avatar'], resolve),
    Relate: resolve => require(['@/views/components/relate/Index'], resolve)
  },
  data() {
    return {
      relations: [],
      team: {
        name: '',
        logo: ''
      },
      showMember: false
    }
  },
  computed: {
    members() {
      return this.relations.filter(r => {
        return r.type !== '1'
      })
    },
    master() {
      if (Check.isRealArray(this.relations)) {
        return this.relations.filter(r => {
          return r.type === '1'
        })[0]
      }
      return null
    },
    users() {
      const that = this
      let users = []
      if (Check.isRealArray(that.relations)) {
        that.relations.some(u => {
          users.push(Object.assign({}, u, { avatar: that.url(u.avatar) }))
        })
      }
      return users
    }
  },
  created() {
    this.team = this.$route.query
    Api.getGroupUsers(this.routeQuery('groupId')).then(res => {
      this.relations = res.relations

      let users = this.getStorage('_cache_user_select')
      if (Check.isRealArray(users)) {
        users = users.map(v => {
          return {
            userId: v.userId,
            groupId: this.team.groupId,
            status: '1'
          }
        })
        this.commitData(users, data => {
          if (data.relations) {
            this.relations.push(...data.relations)
          }
        })
      }
    })
  },
  methods: {
    commitData(postData, callback) {
      Api.addGroupRelation({
        relations: postData
      }).then(res => {
        callback && callback(res)
        this.$message({ message: '操作成功', type: 'success' })
      })
    },
    handleLogo(file) {
      this.$set(this.team, 'logo', file.id)
      Api.addGroup({
        groups: [this.team]
      })
    },
    handleName() {
      let that = this
      that
        .$prompt(' ', '修改小组名', {
          inputPlaceholder: that.team.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          Api.addGroup({
            groups: [{ ...that.team, ...{ name: value } }]
          }).then(res => {
            that.$set(that.team, 'name', value)
          })
        })
        .catch(() => {})
    },
    handleMember(u, i) {
      let us = [{ ...u, type: '1' }]
      if (this.master) {
        us.push({ ...this.master, type: '2' })
      }
      this.commitData(us, data => {
        let uMap = new Map()
        us.map(v => {
          uMap.set(v.userId, v)
        })
        this.relations = this.relations.map(v => {
          return uMap.get(v.userId) || v
        })
        this.showMember = false
      })
    },
    handleAdd() {
      this.setStorage('_cache_user_select', this.relations)
      this.routePush({
        path: '/vx/group/user/select',
        query: {
          userType: '1_2_4'
        }
      })
    },
    handleRemove(u, i) {
      if (u.type === '1') {
        this.$message({ message: '不能删除小组长', type: 'warning' })
        return false
      }
      this.commitData(
        [
          {
            id: u.id,
            status: 'd',
            groupId: this.team.groupId
          }
        ],
        () => {
          this.relations.splice(i, 1)
        }
      )
    },
    handleAdmin() {}
  }
}
</script>
