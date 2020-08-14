<template>
  <Card :message="message">
    <CardContent :content="m.content">
      <div slot="other"
           v-if="approve.remark"
           v-html="approve.remark"></div>
      <template v-for="(reply,i) in approve.replys">
        <div slot="other"
             v-if="approve.replys"
             :key="i"
             :reply="reply">
          <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
        </div>
      </template>

    </CardContent>
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
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import ApproveMixin from '@/views/business/1001/mixin'
  export default {
    mixins: [CardMixin, ApproveMixin],
    props: {
      message: { type: [Object] }
    },
    components: {},
    computed: {
      m() {
        let _m = this.converMessage(this.message)
        _m.title = `${this.message.businessName}：${this.message.title}`
        return _m
      },
      approve() {
        return this.toApprove(this.message)
      }
    }
  }
</script>
