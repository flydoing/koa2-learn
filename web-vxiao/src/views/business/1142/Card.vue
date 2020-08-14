<template>
  <Card :message="message">
    <div slot="contents"
         v-if="approve.replys">
      <div v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </div>
    <el-dropdown v-if="approve.isApprover && m.status === '3'"
                 trigger="click"
                 @command="handleApprove">
      <div class="el-dropdown-link">
        <CardHref content="立即处理"></CardHref>
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
            name: '同意拜访',
            type: '1'
          },
          {
            name: '拒绝拜访',
            type: '3'
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
          replys: []
        }

        try {
          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.forEach(u => {
              if (u.status === '1' && u.type === 'to') {
                if (u.userId === that.userId) {
                  approve.isApprover = true
                }
              }
            })
          }

          let replys = []
          if (Check.isArray(_m.replys)) {
            _m.replys.forEach(r => {
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
    methods: {}
  }
</script>
