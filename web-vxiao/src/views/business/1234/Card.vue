<template>
  <Card :message="message">
    <CardContent slot="content"
                 :content="m.content">
      <div slot="other"
           v-if="approve.remark"
           v-html="approve.remark"></div>
      <template slot="other"
                v-if="approve.replys">
        <div v-for="(reply,i) in approve.replys"
             :key="i"
             :reply="reply">
          <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
        </div>
      </template>
    </CardContent>
    <el-dropdown slot="href"
                 v-if="m.status === '3' && approve.isApprover"
                 trigger="click"
                 @command="handleApprove">
      <div class="el-dropdown-link">
        <CardHref content="立即审批" />
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(op,i) in approveOps"
                          :key="i"
                          :op="op"
                          :command="op">{{op.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown slot="href"
                 v-if="m.status === '4' && approve.isExecutor"
                 trigger="click"
                 @command="handleExecute">
      <div class="el-dropdown-link">
        <CardHref content="是否同意" />
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(op,i) in executeOps"
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
  data() {
    return {
      approveOps: [
        {
          name: '批准',
          type: '1'
        },
        {
          name: '不批准',
          type: '2'
        }
      ],
      executeOps: [
        {
          name: '同意',
          type: '1'
        },
        {
          name: '不同意',
          type: '2'
        }
      ]
    }
  },
  computed: {
    approve() {
      return this.toApprove(this.message)
    }
  },
  methods: {
    commitApproveData(params) {
      let postData = this.constructionMessage({
        id: this.message.id,
        groupId: this.groupId,
        type: this.message.type,
        ...params
      })
      this.modifyMessage(postData).then(res => {
        this.$message({ message: '操作成功', type: 'success' })
      })
    },
    handleApprove(op) {
      const that = this
      that.commitApproveData({
        toUsers: [{ ...that.approve.apv, status: op.type === '1' ? '4' : '5' }]
      })
    },
    handleExecute(op) {
      const that = this
      that.commitApproveData({
        toUsers: [{ ...that.approve.exc, status: op.type === '1' ? '4' : '5' }]
      })
    }
  }
}
</script>
