/**
 * 审批公用处理逻辑
 */
import R from '@/views/group/mixin'
import Check from '@/utils/check'

export default {
  mixins: [R],
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
      ],
      executeBtn: {
        name: '执行',
        txt: '执行完毕',
        handle: this.handleExecute
      }
    }
  },
  computed: {},
  methods: {
    toApprove(message) {
      const that = this
      let _m = message
      let approve = {
        isApprover: false,
        isExecutor: false,
        approvers: [],
        executors: [],
        replys: [],
        apv: null,
        exc: null,
        remark: ''
      }

      let replys = []
      if (Check.isRealArray(_m.replys)) {
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

      if (Check.isRealArray(_m.toUsers)) {
        _m.toUsers.map(u => {
          if (u.type === 'to') {
            approve.approvers.push(u)
            if ((u.status === '1' || u.status === '3') && u.userId === that.userId) {
              approve.apv = u
              approve.isApprover = true
            }
          }
          if ((u.status === '1' || u.status === '3') && u.type === 'executor') {
            if (u.userId === that.userId) {
              approve.exc = u
              approve.isExecutor = true
            }
            approve.executors.push(u)
          }
        })
      }

      if (_m.msgType === '1' || _m.msgType === '2') {
        approve.remark = _m.remark || ''
      } else {
        let remark = ''
        if (Check.isRealArray(approve.approvers)) {
          remark = `待${approve.approvers
            .map(u => {
              return u.name
            })
            .join(' ')}审批；`
        }
        if (Check.isRealArray(approve.executors)) {
          remark = `${remark || '待'}${approve.executors
            .map(u => {
              return u.name
            })
            .join(' ')}${that.executeBtn.name}；`
        }
        approve.remark = remark
      }
      return approve
    },
    handleResult() {
      if (this.isOpen) {
        this.routePushModel({
          name: 'approveQrcode1001',
          query: {
            msgId: this.message.id,
            appType: this.message.type
          }
        })
      } else {
        let query = {
          msgId: this.message.id,
          msgType: this.message.type
        }
        if (this.message.type === '1248') {
          query.hasEdit = 1
        }
        this.setStorage('approve_user_cache', this.approve.approvers)
        this.routePushModel({
          name: 'approveResult1001',
          query: query
        })
      }
    },
    commitApproveData(params) {
      const that = this
      let postData = that.constructionMessage({
        id: that.message.id,
        groupId: that.currentGroup.groupId,
        type: that.message.type,
        ...params
      })
      delete postData.fromUserName
      that.modifyMessage(postData).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
      })
    },
    handleApprove(op) {
      const that = this
      if (op.type === '2') {
        that.setStorage('approve_user_cache', that.approve.approvers)
        that.routePushModel({
          name: 'selectApprover1001',
          query: {
            msgId: this.message.id,
            msgType: this.message.type
          }
        })
      } else {
        that.commitApproveData({
          status: op.type === '1' ? '4' : '5'
        })
      }
    },
    handleExecute() {
      const that = this
      this.$confirm(`${that.executeBtn.txt}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = that.constructionMessage({
          id: that.message.id,
          type: that.message.type,
          status: '8',
          toUsers: [
            {
              userId: that.userId,
              type: 'executor'
            }
          ],
          groupId: this.groupId
        })
        delete postData.fromUserName
        that.modifyMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
        })
      })
    }
  },
  watch: {}
}
