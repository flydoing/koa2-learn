<template>
  <Card :message="message">
    <template v-if="message.remark!='2' && users.length>0">
      <el-dropdown trigger="click" @command="handleAppraise">
        <div class="el-dropdown-link">
          <CardHref :content="buttonText"></CardHref>
        </div>
        <el-dropdown-menu class="drop-menu" slot="dropdown">
          <el-dropdown-item class="menu-item" v-for="(u,i) in users" :key="i" :command="u">{{u.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-else>
      <CardHref v-if="message.remark!='2'" :content="buttonText" @click="handleAppraise" />
    </template>
  </Card>
</template>
<script>
import CardMixin from '@/views/components/card/mixin'
import { mapGetters, mapActions } from 'vuex'
import Api from './api'
export default {
  mixins: [CardMixin],
  props: {
    message: { type: [Object] }
  },
  components: {},
  data() {
    return {
      users: [],
      button: null
    }
  },
  computed: {
    ...mapGetters({
      appraisal: 'getTeacherAppraisal'
    }),
    m() {
      let _m = this.converMessage(this.message)
      _m.title = `${this.message.businessName}：${this.message.title}`
      return _m
    },
    buttonText() {
      let _m = this.message
      return _m.remark === '1' ? '查看结果' : '开始评估'
    }
  },
  created() {
    if (this.USER.type === '3') {
      Api.getChildrenAuth(this.message.id).then(res => {
        this.users = res.childs
      })
    }
  },
  methods: {
    ...mapActions(['setTeacherAppraisal']),
    handleAppraise(user) {
      this.setTeacherAppraisal({ message: this.message })
      let obj = {
        name: 'apslObjects1178',
        params: { msgId: this.message.id },
        query: { 
          remark: this.message.remark, 
          apslId: this.message.extension
        }
      }
      user && (obj.query.uId = user.id)
      this.routePushModel(obj)
    },
    handleDetail() {
      let m = this.message
      this.routePushModel({
        path: `/vx/group/business/report/message/detail/1`,
        query: {
          appType: m.type,
          appName: m.businessName,
          fromUserId: this.userId,
          categoryId: m.extension,
          groupId: m.groupId,
          noTempletReport: 1
        }
      })
    }
  }
}

</script>
