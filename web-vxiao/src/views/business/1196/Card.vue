<template>
  <Card :message="message">
    <div slot="href"
         class="text-color">
      <template v-if="users.length>0 && isClass">
        <el-dropdown trigger="click"
                     @command="handleAppraise">
          <div class="el-dropdown-link">
            <span class="text-color">开始评估</span>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(u,i) in users"
                              :key="i"
                              :u="u"
                              :command="u">{{u.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else-if="isClass">
        <span @click="handleAppraise">开始评估</span>
      </template>
      <template v-if="isSchool || (isClass && (isTeacher || isParent))">
        <template v-if="!isSchool">&nbsp;|&nbsp;</template>
        <span @click="handleDetail">查看详情</span>
      </template>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        users: [],
        button: null
      }
    },
    computed: {
      isEnd() {
        return this.message.readed === 2
      },
      joinIn() {
        return this.message.readed === 1
      }
    },
    created() {
      const that = this
      if (!that.isSchool) {
        Api.loadChildrenData(that.message.id).then(res => {
          that.users = res.relations.map(r => {
            let label = r.userType === '3' ? '我是家长' : `我是${r.name}`
            if (r.remark) {
              label = r.remark !== '1' ? `${label}（待评）` : `${label}（已评）`
            }
            r.label = label
            return r
          })
        })
      }
    },
    methods: {
      handleAppraise(user) {
        let q = { joinIn: this.message.readed }
        user && (q.uId = user.userId)
        this.routePushModel({
          name: 'apslObjects1196',
          params: {
            msgId: this.message.id
          },
          query: q
        })
      },
      handleDetail() {
        let m = this.message
        this.routePushModel({
          path: `/vx/group/business/report/message/detail/1`,
          query: {
            appType: m.type,
            appName: m.businessName,
            fromUserId: this.userId,
            msgId: m.id,
            groupId: m.groupId,
            noTempletReport: 1
          }
        })
      }
    }
  }
</script>
