import Api from './api'
import Cammand from '@/constant/cammand'
export default {
  methods: {
    rowClick(row, _params) {
      if (row.clickAble == null || row.clickAble === true) {
        let params = {
          fromUserId: this.fromUserId,
          appType: this.appType,
          ..._params,
          ...row.params
        }
        delete params.excels
        if (row.forward === Cammand.FORWARD_LIST) {
          this.$web.postJsAction({
            type: Cammand.FORWARD_LIST,
            title: _params.appName || '',
            groupId: this.groupId,
            appType: this.appType,
            params: {
              type: this.appType,
              groupId: params.groupId || this.groupId,
              ...row.params
            }
          })
          this.setStorage('_message_list_refresh', true)
          this.setStorage('_message_params_cache', {
            type: this.appType,
            groupId: params.groupId || this.groupId,
            ...row.params
          })
          this.routePush({
            path: '/vx/group/business/message/list'
          })
        } else if (row.forward === Cammand.FORWARD_CUSTOM) {
          this.$web.postJsAction({
            type: Cammand.FORWARD_CUSTOM,
            title: _params.appName || '',
            groupId: this.groupId,
            appType: this.appType,
            customAction: row.customAction,
            params: {
              type: this.appType,
              ...params
            }
          })
          this.routePush({
            name: 'customAction',
            query: {
              ...params,
              type: this.appType,
              action: row.customAction
            }
          })
        } else if (row.forward === Cammand.FORWARD_PHOTO) {
          if (row.params) {
            this.imageUrl = row.params.photo || ''
            if (this.imageUrl) {
              setTimeout(() => {
                const viewer = this.$el.querySelector('.vx-report-image').$viewer
                viewer.show()
              }, 200)
            }
          }
        } else if (row.forward === Cammand.FORWARD_CHART) {
          if (row.url) {
            this.routePush({
              path: row.url,
              query: row.params
            })
          } else {
            this.routePush({
              name: 'reportChart',
              params: { groupId: this.groupId, templetId: _params.templetId },
              query: params
            })
          }
        } else if (row.forward === Cammand.FORWARD_BUSINESS_DETAIL) {
          this.routePush({
            name: 'businessDetail',
            params: { refresh: ++this.refresh },
            query: { ...this.$route.query, ...row.params }
          })
        } else if (row.forward === Cammand.FORWARD_DETAIL) {
          this.$web.postJsAction({
            type: Cammand.FORWARD_DETAIL,
            title: _params.appName || '',
            groupId: this.groupId,
            appType: this.appType,
            params: {
              ...row.params
            }
          })
        } else if (row.forward === Cammand.FORWARD_TABLE_POST) {
          this.$confirm('确定退款?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          })
            .then(() => {
              Api.refundCommit({
                groupId: this.groupId,
                orders: [
                  {
                    id: params.id,
                    categoryId: params.categoryId,
                    userId: params.userId
                  }
                ]
              }).then(res => {
                row.columns.pop()
                row.columns.push('已退款')
                this.$set(row, 'clickAble', false)
                this.$message({
                  type: 'success',
                  message: '成功'
                })
              })
            })
            .catch(() => {})
        } else if (this.noTempletReport) {
          this.routePush({
            name: 'businessDetail',
            params: { groupId: params.groupId, refresh: ++this.refresh },
            query: {
              ...params,
              noTempletReport: this.noTempletReport
            }
          })
        } else {
          // let ps = {
          //   groupId: this.groupId,
          //   templetId: _params.templetId,
          //   title: this.historyTab.name || void 0
          // }
          this.pageTabs.push({
            title: this.pageTab.historyTab.name || '',
            tabs: [],
            tabTitle: '',
            customParams: null,
            historyTab: null,
            historyReport: {},
            queryData: { ...this.pageTab.queryData, ...params },
            templetId: _params.templetId
          })
          // this.routePush({
          //   name: 'reportDetail',
          //   params: {
          //     groupId: params.groupId || this.groupId
          //   },
          //   query: {
          //     ...params
          //   }
          // })
        }
      }
    },
    cellClick(cell) {}
  }
}
