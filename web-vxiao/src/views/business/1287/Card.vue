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
    <template v-if="approve.isApprover">
      <CardHref content="立即审批"
                @click="handleResult" />
    </template>
    <template v-else-if="approve.isExecutor && m.status==='4'">
      <CardHref slot="href"
                content="立即执行"
                @click="handleExecute" />
    </template>
  </Card>
</template>
<script>
  import ApproveMixin from '@/views/business/1001/mixin'
  import CardMixin from '@/views/components/card/mixin'
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
          approvers: [],
          executors: [],
          links: [],
          user: null,
          replys: [],
          remark: ''
        }

        try {
          let json = JSON.parse(_m.msgJson || '{}')
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
              if (u.type === 'executor') {
                approve.user = u
              }
            })
          }
          if (_m.remark) {
            approve.remark = _m.remark
          } else {
            let remark = ''
            if (Check.isRealArray(approve.approvers)) {
              let apvs = approve.approvers.map(u => {
                return u.name
              })
              remark = `待${apvs.join(' ')}审批；`
            }
            if (Check.isRealArray(approve.executors)) {
              let exts = approve.executors.map(u => {
                return u.name
              })
              remark = `${remark}待${exts.join(' ')}执行；`
            }
            approve.remark = remark
          }

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
      }
    },
    methods: {
      handleExecute() {
        this.routePush({
          name: 'execute1287',
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
