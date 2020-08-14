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
    <el-dropdown v-if="approve.isDrawer && message.status === '1'"
                 trigger="click"
                 @command="handleDraw">
      <div class="el-dropdown-link">
        <CardHref content="处理结果"
                  @click="loadOperates"></CardHref>
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
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        operates: []
      }
    },
    components: {},
    computed: {
      approve() {
        let _m = this.message
        let _this = this
        let approve = {
          isDrawer: false,
          links: [],
          user: null,
          replys: [],
          remark: ''
        }

        try {
          let json = _m.msgJson ? JSON.parse(_m.msgJson).invoice || JSON.parse(_m.msgJson) : null
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

          if (Check.isRealArray(_m.toUsers)) {
            _m.toUsers.map(u => {
              if (u.status === '1' && u.type === 'to') {
                if (u.userId === _this.userId) {
                  approve.isDrawer = true
                }
                approve.user = u
              }
            })
          }

          if (_m.status === '1') {
            approve.remark = `待${approve.user.name}开票`
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
      loadOperates() {
        if (!Check.isRealArray(this.operates)) {
          CategoryApi.getCategorysByType('69').then(res => {
            this.operates = res.categorys || []
          })
        }
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
      },
      handleDraw(data) {
        let postData = {
          type: '1102',
          groupId: this.groupId,
          id: this.message.id,
          fromUserName: this.approve.user.name,
          msgJson: JSON.stringify({
            invoice: {
              openInvoiceId: data.id,
              openInvoiceName: data.name
            }
          })
        }
        this.modifyMessage(postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
