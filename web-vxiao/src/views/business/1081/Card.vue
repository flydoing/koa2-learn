<template>
  <Card :message="message">
    <template v-for="(link,i) in approve.links">
      <div slot="titles"
           v-if="approve.links"
           :key="i"
           :item="link">
        {{link.label}}<span class="text-color"
              @click="handleLink(link)">{{link.name}}</span>
      </div>
    </template>
    <div slot="contents"
         v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </div>
    <CardHref v-if="approve.isApprover"
              content="确认回款"
              @click="handlePayback"></CardHref>
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
    components: {},
    computed: {
      approve() {
        let _m = this.message
        let that = this
        let approve = {
          isApprover: false,
          links: [],
          replys: []
        }

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson) : null
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
                type: 'agent',
                name: json.contractName
              })
            }
          }
          approve.links = links

          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(function(u) {
              if (u.status === '1' && u.type === 'to') {
                if (u.userId === that.userId) {
                  approve.isApprover = true
                }
              }
            })
          }

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
      }
    },
    methods: {
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
      },
      handlePayback() {
        this.routePush({
          name: 'payback1081',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
