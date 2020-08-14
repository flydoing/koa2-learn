<template>
  <Card :message="message">
    <div slot="titles"
         v-for="(link,i) in approve.links"
         :key="i"
         :link="link">
      <span>{{link.label}}</span>
      <span class="text-color"
            @click="handleLink(link)">{{link.name}}</span>
    </div>
    <div slot="contents"
         v-if="approve.remark"
         v-html="approve.remark"></div>
    <div slot="contents"
         v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </div>
    <el-dropdown slot="href"
                 v-if="approve.isApprover"
                 trigger="click"
                 @command="handleApprove">
      <div class="el-dropdown-link">
        <CardHref content="立即审批"></CardHref>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(op,i) in operates"
                          :key="i"
                          :op="op"
                          :command="op">{{op.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <CardHref v-else-if="approve.isExecutor"
              content="发货"
              @click="handleDelivery" />
    <CardHref v-else-if="showDelivery"
              content="确认收货"
              @click="handleConfirm" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import ApproveMixin from '@/views/business/1001/mixin'
  import Check from '@/utils/check'
  export default {
    mixins: [CardMixin, ApproveMixin],
    props: {
      message: { type: [Object] }
    },
    computed: {
      approve() {
        let _m = this.message
        let _this = this
        let approve = {
          isApprover: false,
          isExecutor: false,
          isCreator: false,
          approvers: [],
          executors: [],
          links: [],
          user: null,
          replys: [],
          remark: ''
        }

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson).delivery : null
          let links = []
          if (!Check.isNullObject(json)) {
            if (json.clientName) {
              links.push({
                id: json.clientId,
                label: '客户：',
                type: 'client',
                name: json.clientName
              })
            }
            if (json.agentName) {
              links.push({
                id: json.agentId,
                label: '代理商：',
                type: 'agent',
                name: json.agentName
              })
            }
            if (json.contractName) {
              links.push({
                id: json.contractId,
                label: '合同：',
                type: 'contract',
                name: json.contractName
              })
            }
          }
          approve.links = links

          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(u => {
              if (u.status === '1' && u.type === 'to') {
                if (u.userId === _this.userId) {
                  approve.isApprover = true
                }
                approve.approvers.push(u)
              }
              if (u.status === '1' && u.type === 'executor') {
                if (u.userId === _this.userId) {
                  approve.isExecutor = true
                }
                approve.executors.push(u)
              }
              if (u.type === 'creator' && u.userId === _this.userId && u.status === '1') {
                approve.isCreator = true
              }
              if (u.type === 'executor') {
                approve.user = u
              }
            })
          }

          let remark = ''
          if (Check.isRealArray(approve.approvers)) {
            let names = approve.approvers.map(u => {
              return u.name
            })
            remark = `待${names.join(' ')}审批；`
          }
          if (Check.isRealArray(approve.executors)) {
            let names = approve.executors.map(u => {
              return u.name
            })
            remark = `${remark}待${names.join(' ')}发货；`
          }
          approve.remark = remark

          let replys = []
          if (Check.isArray(_m.replys)) {
            _m.replys.map(r => {
              if (r.fromClientId === 'system') {
                let cnt = r.content.substring(r.content.indexOf('：') + 1)
                replys.push({
                  fromUserName: r.fromUserName,
                  content: cnt
                })
              }
            })
          }
          approve.replys = replys
        } catch (e) {}
        return approve
      },
      showDelivery() {
        let user = this.approve.user || {}
        return (this.approve.isCreator || this.isAdmin) && this.message.status === '8' && user.status === '8'
      }
    },
    methods: {
      handleConfirm() {
        this.$confirm('是否确认收货？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.modifyMessage({
            id: this.message.id,
            type: '1104',
            status: '12',
            toUsers: [
              {
                userId: this.userId,
                type: 'creator'
              }
            ]
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleDelivery() {
        this.routePush({
          name: 'delivery1104',
          query: {
            msgId: this.message.id
          }
        })
      },
      handleLink(data) {
        if (data.type === 'client') {
          this.routePush({
            path: '/vx/group/business/create/default',
            query: {
              appType: '1062',
              groupId: this.groupId,
              cid: data.id
            }
          })
        } else if (data.type === 'agent') {
          this.routePush({
            path: '/vx/group/business/1079/detail',
            query: {
              aid: data.id
            }
          })
        } else {
          this.routePush({
            path: '/vx/group/business/1065/detail',
            query: {
              msgId: data.id
            }
          })
        }
      }
    }
  }
</script>
