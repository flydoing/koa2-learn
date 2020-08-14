<template>
  <Card :message="message">
    <CardContent :message="message">
      <div slot="other" v-if="approve.remark" v-html="approve.remark"></div>
      <div slot="other" v-if="approve.replys">
        <div v-for="(reply,i) in approve.replys" :key="i" :reply="reply">
          <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
        </div>
      </div>
    </CardContent>
    <el-dropdown v-if="approve.isApprover" trigger="click" @command="handleApprove">
      <div class="el-dropdown-link">
        <CardHref content="立即审批"></CardHref>
      </div>
      <el-dropdown-menu class="drop-menu" slot="dropdown">
        <el-dropdown-item class="menu-item" v-for="(op,i) in operates" :key="i" :op="op" :command="op">{{op.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <CardHref v-if="approve.isExecutor" :content="executeBtn.txt" @click="executeBtn.handle"/>
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
    data() {
      return {
        executeBtn: {
          name: '备案',
          txt: '备案完毕',
          handle: this.handleExecute
        }
      }
    },
    computed: {
      approve() {
        return this.toApprove(this.message)
      }
    }
  }

</script>
