<template>
  <Card :message="message">
    <div slot="titles" v-for="(link,i) in approve.links" :key="i" :link="link">
      <span>{{link.label}}</span>
      <span class="text-color" @click="link.handle">{{link.name}}</span>
    </div>
    <div slot="contents" v-if="approve.remark" v-html="approve.remark"></div>
    <div slot="contents" v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys" :key="i" :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </div>
    <CardHref v-if="button" :content="button.text" @click="button.handle" />
  </Card>
</template>
<script>
import CardMixin from '@/views/components/card/mixin'
import Check from '@/utils/check'
export default {
  mixins: [CardMixin],
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
              name: json.clientName,
              handle: this.clientHandle
            })
          }
          if (json.agentName) {
            links.push({
              id: json.agentId,
              label: '代理商：',
              type: 'agent',
              name: json.agentName,
              handle: this.agentHandle
            })
          }
          if (json.contractName) {
            links.push({
              id: json.contractId,
              label: '合同：',
              type: 'contract',
              name: json.contractName,
              handle: this.contractHandle
            })
          }
        }
        approve.links = links

        if (Check.isArray(_m.toUsers)) {
          _m.toUsers.map(function(u) {
            if (u.status === '1' && u.type === 'to') {
              if (u.userId === _this.$store.state.USERID) {
                approve.isApprover = true
              }
              approve.approvers.push(u)
            }
            if (u.status === '1' && u.type === 'executor') {
              if (u.userId === _this.$store.state.USERID) {
                approve.isExecutor = true
              }
              approve.executors.push(u)
            }
            if (u.type === 'creator' && u.userId === _this.$store.state.USERID && u.status === '1') {
              approve.isCreator = true
            }
            if (u.type === 'executor') {
              approve.user = u
            }
          })
        }

        let remark = ''
        if (Check.isArray(approve.approvers) && approve.approvers.length > 0) {
          remark = '待'.concat(approve.approvers.map(function(u) {
            return u.name
          }).join(' ')).concat('审批；')
        }
        if (Check.isArray(approve.executors) && approve.executors.length > 0) {
          var txt = (approve.executors.map(function(u) {
            return u.name
          }).join(' ')).concat('发货；')
          remark = remark ? remark.concat(txt) : '待'.concat(txt)
        }
        approve.remark = remark

        let replys = []
        if (Check.isArray(_m.replys)) {
          _m.replys.map(function(r) {
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
    button() {
      let approve = this.approve

      if (approve.isApprover) {
        return {
          text: '立即审批',
          handle: this.approveHandle
        }
      }
      if (approve.isExecutor) {
        return {
          text: '发货',
          handle: this.executeHandle
        }
      }
      if (approve.isCreator && approve.user.status === '8') {
        return {
          text: '确认收货',
          handle: this.confirmHandle
        }
      }
      return false
    }
  },
  methods: {
    approveHandle() {
      this.$message({ type: 'warning', message: '开发中...' })
    },
    executeHandle() {
      this.$message({ type: 'warning', message: '开发中...' })
    },
    confirmHandle() {
      this.$message({ type: 'warning', message: '开发中...' })
    },
    clientHandle() {
      this.$message({ type: 'warning', message: '开发中...' })
    },
    agentHandle() {
      this.$message({ type: 'warning', message: '开发中...' })
    },
    contractHandle() {
      this.$message({ type: 'warning', message: '开发中...' })
    }
  }
}

</script>
