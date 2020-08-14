<template>
  <page title="处理人设置">
    <div class="expense-handler">
      <item @click="handleApprove">
        <div slot="main">审批人</div>
        <div slot="remark"
             v-if="i<5">
          <img class="avatar"
               v-for="(item,i) in approvers"
               :key="i"
               v-lazy="{src:item.avatar,error:Image.ICO_USER}"
               alt='头像' />
        </div>
      </item>
      <item @click="handleExecute"
            v-if="i<5">
        <div slot="main">批准人</div>
        <div slot="remark">
          <img class="avatar"
               v-for="(item,i) in executors"
               :key="i"
               v-lazy="{src:item.avatar,error:Image.ICO_USER}"
               alt='头像' />
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        approvers: [],
        executors: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        expense: 'getExpense'
      })
    },
    methods: {
      ...mapActions(['setExpense']),
      fetchData() {
        const that = this
        let groupId = that.currentGroup.groupId
        Api.getExpenseHandlers(groupId).then(res => {
          if (res.metaDatas) {
            let approvers = []
            let executors = []
            res.metaDatas.map(v => {
              let users = that.groupUsers.filter(u => {
                return v.userId === u.userId
              })
              if (v.metaType === 'm_wiped_approve_person') {
                users[0] && approvers.push({ ...users[0], id: v.id })
              } else {
                users[0] && executors.push({ ...users[0], id: v.id })
              }
            })
            that.approvers = approvers.map(v => {
              return { ...v, avatar: that.url(v.avatar) }
            })
            that.executors = executors.map(v => {
              return { ...v, avatar: that.url(v.avatar) }
            })
          }
        })
      },
      handleApprove() {
        this.setExpense({ users: this.approvers, isApprover: true })
        this.routePush({ name: 'handlerEdit1109' })
      },
      handleExecute(item) {
        this.setExpense({ users: this.executors, isApprover: false })
        this.routePush({ name: 'handlerEdit1109' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .expense-handler {
    .vx-item img {
      margin: rem(5) 0 rem(5) rem(5);
      display: inline-block;
      vertical-align: middle;
    }
  }
</style>
