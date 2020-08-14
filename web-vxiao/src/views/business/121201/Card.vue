<template>
  <Card :message="message"
        :parentType="1212">
    <div slot='contents'
         v-if="m.extensionType && m.status !== '4'"
         v-html="m.extensionType"></div>
    <template slot='contents'
              v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </template>

    <el-dropdown v-if="(approve.isApprover || isAppAdmin('1212')) && m.status !== '4'"
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
    computed: {
      approve() {
        let _m = this.message
        let that = this
        let approve = {
          isApprover: false,
          approvers: [],
          replys: []
        }

        if (Check.isRealArray(_m.toUsers)) {
          _m.toUsers.map(function(u) {
            if (u.status === '1' && u.type === 'to') {
              approve.approvers.push(u)
              if (u.userId === that.userId) {
                approve.isApprover = true
              }
            }
          })
        }

        let replys = []
        if (Check.isRealArray(_m.replys)) {
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
        return approve
      }
    },
    methods: {}
  }
</script>
