<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="msg">
      <el-dropdown-item v-if="(isAdmin || approve.isHandler || msg.fromUserId == userId) && msg.status != '4'"
                        @click.native.stop="handleEdit">编辑</el-dropdown-item>
    </CardDown>
    <CardContent slot="content"
                 :content="m.content">
      <div v-if="approve.endTime"
           v-html="approve.endTime"></div>
      <div slot="other"
           v-if="approve.label"
           v-html="approve.label"></div>
      <div slot="other"
           v-if="approve.remark"
           v-html="approve.remark"></div>
      <div slot="other"
           v-for="(reply,i) in approve.replys"
           :key="i"
           :reply="reply">
        <span class="text-color">{{reply.fromUserName}}</span>：{{reply.content}}
      </div>
    </CardContent>
    <CardHref slot="href"
              v-if="needAssess"
              content="工时评估"
              @click="handleAssess" />
    <CardHref slot="href"
              v-if="approve.isHandler"
              content="处理完毕"
              @click="handleDeal" />
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'
  import DateFormat from '@/utils/date'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    components: {},
    data() {
      return {
        msg: this.message
      }
    },
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      approve() {
        const that = this
        let _m = this.msg
        let approve = {
          isHandler: false,
          isAssessor: false,
          assessors: [],
          handlers: [],
          replys: [],
          endTime: '',
          remark: '',
          label: ''
        }

        try {
          if (Check.isArray(_m.times)) {
            _m.times.map(t => {
              if (t.type === 'end') {
                approve.endTime = `截止时间：${DateFormat.format(t.setTime, DateFormat.YMD)}`
              }
            })
          }

          if (Check.isArray(_m.toUsers)) {
            _m.toUsers.map(u => {
              if (u.type === 'to' && u.status !== 'd' && u.status !== '4') {
                approve.assessors.push(u)
                if (u.userId === that.userId && !u.value) {
                  approve.isAssessor = true
                }
              }
              if (u.type === 'to' && u.status === '1') {
                approve.handlers.push(u)
                if (that.userId === u.userId) {
                  approve.isHandler = true
                }
              }
            })
          }

          let label = ''
          let remark = ''
          if (Check.isRealArray(approve.assessors)) {
            label = approve.assessors
              .map(u => {
                return u.value
                  ? u.name
                      .concat('：')
                      .concat(u.value)
                      .concat('天')
                  : u.name.concat('：').concat('待评估')
              })
              .join('<br>')
          }
          if (Check.isRealArray(approve.handlers)) {
            remark = '待'
              .concat(
                approve.handlers
                  .map(u => {
                    return u.name
                  })
                  .join(' ')
              )
              .concat('处理')
          }
          approve.label = label
          approve.remark = remark

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
      },
      needAssess() {
        let meta =
          this.metaDatas.filter(m => {
            return m.metaType === 'm_workorder_man_haur' && m.extension === this.currentGroup.groupId
          })[0] || {}
        if ((this.isAdmin || this.approve.isAssessor) && this.approve.assessors.length > 0 && meta.obj === '1' && this.msg.status !== '4') {
          return true
        }
        return false
      }
    },
    methods: {
      handleAssess() {
        this.routePushModel({
          name: 'assessTime1039',
          params: {
            msgId: this.msg.id
          }
        })
      },
      handleEdit() {
        this.routePushModel({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1039',
            groupId: this.currentGroup.groupId,
            msgId: this.msg.id
          }
        })
      },
      handleDeal() {
        this.$confirm('确认处理完毕？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let m = this.msg
          let postData = this.constructionMessage({
            id: m.id,
            groupId: m.groupId,
            toUsers: [],
            type: m.type,
            status: '4'
          })
          delete postData.fromUserName
          this.modifyMessage(postData).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.msg = { ...res.messages[0], times: this.msg.times }
          })
        })
      }
    }
  }
</script>
