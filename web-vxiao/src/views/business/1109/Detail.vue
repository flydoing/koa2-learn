<template>
  <page title="报销详情"
        @add="handleAdd"
        :hasAdd="userId == uId"
        @scrollEnd="scrollEnd">
    <div slot="btn">
      <label v-if="authType == '4'"
             @click="handleAudit">审核</label>
      <label v-if="authType == '8'"
             @click="handleApprove">批准</label>
    </div>
    <vx-table :data="table.datas">
      <template v-if="table.columns">
        <vx-table-column v-for="(col, i) in table.columns"
                         :label="col"
                         :key="i">
          <template slot-scope="scope">
            <span v-html="scope.row.columns[i]"></span>
          </template>
        </vx-table-column>
      </template>
    </vx-table>
    <div class="category-title"></div>
    <CardList :messages="messages"></CardList>
  </page>
</template>
<script>
  import Api from './api'
  import MessageApi from '@/api/message'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    components: {
      CardList: resolve => require(['@/views/components/card/CardList'], resolve)
    },
    props: {},
    data() {
      return {
        table: {
          columns: ['类型', '金额'],
          datas: []
        },
        messages: [],
        currentPage: 1,
        hasNextPage: 1,
        authType: ''
      }
    },
    created() {
      this.fetchData()
      this.loadMessages()
    },
    methods: {
      loadMessages(append) {
        MessageApi.getMessages({
          startDate: this.sDate,
          endDate: this.eDate,
          queryType: 'creator',
          type: '1111',
          groupId: this.gId || this.groupId,
          userId: this.uId
        }).then(res => {
          if (append) {
            this.messages.push(...(res.messages || []))
          } else {
            this.messages = res.messages || []
          }
          if (res.hasNextPage > 0) {
            this.hasNextPage = res.hasNextPage
            this.currentPage = res.currentPage
          } else {
            this.hasNextPage = 0
          }
        })
      },
      fetchData() {
        this.uId = this.routeQuery('userId')
        this.sDate = this.routeQuery('startDate')
        this.eDate = this.routeQuery('endDate')
        this.gId = this.routeQuery('groupId')
        Api.getUserExpenseSummary(this.gId || this.groupId, this.uId, this.sDate, this.eDate, this.userId).then(res => {
          let datas = []
          res.pools.forEach((v, i) => {
            datas.push({
              columns: [v.categoryName || '/', v.wipedAmount || '0']
            })
          })
          this.table.datas = datas
        })
        this.getAuthType()
      },
      getAuthType() {
        Api.getExpenseUserAuth(this.gId || this.groupId, this.uId, this.sDate, this.eDate, this.userId).then(res => {
          this.authType = res.type
        })
      },
      commitData(status) {
        MessageApi.modifyMessage({
          status: status,
          userId: this.uId,
          groupId: this.gId || this.groupId,
          startDate: this.sDate,
          endDate: this.eDate,
          type: '1109',
          fromUserId: this.userId
        }).then(res => {
          this.getAuthType()
          this.$message({ message: '操作成功', type: 'success' })
          this.loadMessages()
        })
      },
      handleAudit() {
        this.$confirm('确定审核通过该报销？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commitData('4')
        })
      },
      handleApprove() {
        this.$confirm('确定批准该报销？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.commitData('8')
        })
      },
      handleAdd() {
        this.routePush({
          path: '/vx/group/business/create/default',
          query: {
            appType: '1109',
            groupId: this.groupId
          }
        })
      },
      scrollEnd() {
        if (this.hasNextPage > 0) {
          this.loadMessages(true)
        }
      }
    }
  }
</script>
