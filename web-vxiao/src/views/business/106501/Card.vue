<template>
  <Card :message="message">
    <span slot="name"
          class="text-color">合同</span>
    <div slot="titles">合同名称：{{approve.name}}</div>
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
         if="approve.remark"
         v-html="approve.remark"></div>
    <div slot="contents"
         v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </div>
    <el-dropdown v-if="approve.isApprover"
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
                          :command="op">{{op.name}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div if="approve.label"
         v-html="approve.label"></div>
    <CardHref content="查看详情"
              @click="handleDetail"></CardHref>
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
    data() {
      return {
        operates: [
          {
            name: '同意并批准',
            type: '1',
            selected: false
          },
          {
            name: '同意并转他人批准',
            type: '2',
            selected: false
          },
          {
            name: '不同意',
            type: '3',
            selected: false
          }
        ]
      }
    },
    components: {},
    computed: {
      approve() {
        let _m = this.message
        let that = this
        let approve = {
          isApprover: false,
          links: [],
          user: null,
          replys: [],
          remark: '',
          label: '',
          name: ''
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
            if (json.agentName) {
              links.push({
                id: json.agentId,
                label: '代理商：',
                type: 'agent',
                name: json.agentName
              })
            }
            if (json.waitApprove) {
              approve.remark = json.waitApprove
            }
            if (json.lastModify) {
              approve.label = json.lastModify
            }
            approve.name = json.name
          }
          approve.links = links

          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(function(u) {
              if (u.status === '1' && u.type === 'executor') {
                if (u.userId === that.userId) {
                  approve.user = u
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
            path: '/vx/group/business/1079/detail',
            query: {
              aid: data.id
            }
          })
        }
      },
      handleDetail() {
        this.routePush({
          path: '/vx/group/business/1065/detail',
          query: {
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
