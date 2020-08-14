<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="isAdmin"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <CardContent slot="content"
                 :content="content" />
    <div><span v-if="state"
            class="order-state"
            :class="state.classStyle"
            v-html="state.text"></span>{{message.extensionType}}</div>
    <el-dropdown v-if="isAdmin && message.status !== '8'"
                 trigger="click"
                 @command="handleUpdate">
      <div class="el-dropdown-link">
        <CardHref content="更新进展"></CardHref>
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
    <template v-else-if="isHandler && message.status !== '8' && message.status !== '6'">
      <CardHref content="更新进展"
                @click="handleFinish"></CardHref>
    </template>
    <template v-if="replys.length > 0">
      <div v-for="(reply,i) in replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </template>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        operates: [{ name: '安排工单', value: '4' }, { name: '关闭工单', value: '6' }]
      }
    },
    computed: {
      content() {
        let m = this.converMessage(this.message)
        return (JSON.parse(m.msgJson || '{}').content || '').replace(/\n/g, '<br>') + '<br>' + m.content
      },
      replys() {
        // 其他人的处理情况
        const that = this
        let _replys = []
        if (Check.isRealArray(this.message.replys)) {
          that.message.replys.map(r => {
            if (r.fromClientId === 'system') {
              let cnt = r.content.substring(r.content.indexOf('：') + 1)
              _replys.push({
                fromUserName: r.fromUserName,
                content: cnt
              })
            }
          })
        }
        return _replys
      },
      isHandler() {
        let users = this.message.toUsers || []
        let handler = users.filter(v => {
          return v.type === 'executor' && v.userId === this.userId && v.status === '1'
        })[0]
        return Check.isObject(handler)
      },
      state() {
        let m = this.message
        let mJson = JSON.parse(m.msgJson || '{}')
        if (m.status === '3') {
          return { text: '未评估', classStyle: {} }
        } else if (m.status === '4') {
          let now = new Date().getTime()
          let start = new Date(DateUtils.format(mJson.startTime, DateUtils.YMD_HM)).getTime()
          let end = new Date(`${DateUtils.format(mJson.commitTime, DateUtils.YMD)} 23:59`).getTime()
          if (start > now) {
            return { text: '未开始', classStyle: { start: true } }
          } else if (start < now && end > now) {
            return { text: '进行中', classStyle: { underway: true } }
          } else if (end < now) {
            return { text: '已延误', classStyle: { delay: true } }
          }
        } else if (m.status === '8') {
          return { text: '已完成', classStyle: { finish: true } }
        } else if (m.status === '6') {
          return { text: '已关闭', classStyle: {} }
        }
        return false
      }
    },
    created() {
      if (this.isAdmin && this.isHandler) {
        this.operates = [...this.operates, { name: '已完成', value: '8' }]
      }
    },
    mounted() {},
    methods: {
      commitData(value) {
        this.modifyMessage({
          ...this.message,
          status: value,
          version: 2
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleFinish() {
        this.$confirm('确认已完成？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commitData('8')
        })
      },
      handleUpdate(op) {
        if (op.value === '4') {
          this.routePush({
            path: '/vx/group/business/create/default',
            query: {
              appType: '1203',
              msgId: this.message.id,
              arrange: 1
            }
          })
        } else {
          this.commitData(op.value)
        }
      },
      handleEdit() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1203',
            msgId: this.message.id
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .order-state {
    display: inline-block;
    width: rem(60);
    text-align: center;
    border-radius: rem(5);
    color: #fff;
    background: #ccc;
    margin-right: rem(5);
    &.start {
      background: #66cccc;
    }
    &.underway {
      background: #cc9933;
    }
    &.finish {
      background: #00cc33;
    }
    &.delay {
      background: #ff0000;
    }
  }
</style>
