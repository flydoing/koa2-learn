<template>
  <Page title="立即审批"
        @submit="handleSubmit"
        hasSubmit>
    <item v-if="hasEdit"
          @click="handleEdit">
      <div slot="main"
           v-html="approverTxt"
           class="ellipsis"></div>
      <div slot="remark">编辑审批人</div>
    </item>
    <item v-if="hasEdit"
          @click="handleAddRelation">
      <div slot="main"
           v-html="relationTxt"
           class="ellipsis"></div>
      <div slot="remark">编辑查阅人</div>
    </item>
    <item v-for="(item,i) in operates"
          :key="i"
          @click="handleItem(item, i)"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
    <div class="category-title"></div>
    <TextInput placeholder="输入内容"
               v-model="remark" />
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import ApproveMixin from './mixin'
  import DocApi from '@/views/business/1248/api'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R, ApproveMixin],
    components: {},
    data() {
      return {
        remark: '',
        curOperate: null,
        approvers: [],
        relations: []
      }
    },
    created() {
      if (this.routeQuery('hasEdit')) {
        this.operates = [
          {
            name: '同意并批准',
            type: '1',
            selected: false
          },
          {
            name: '不同意',
            type: '3',
            selected: false
          }
        ]
        let msgId = this.routeQuery('msgId')
        DocApi.getDocUsers(msgId).then(res => {
          this.approvers = res.approvers || []
          this.relations = res.persons || []
        })
      }
    },
    computed: {
      hasEdit() {
        return this.routeQuery('hasEdit')
      },
      approverTxt() {
        let apvs = this.approvers
        if (apvs.length > 0) {
          let newApvs = apvs.sort(this.compare('approveOrder')).reverse()
          let arrTxt = []
          for (let i = 0; i < newApvs[0].approveOrder; i++) {
            let users = this.getApprovers(i + 1)
            if (users.length > 0) {
              let txt = users.map(v => {
                return v.name
              })
              arrTxt.push(txt.join('、'))
            }
          }
          return arrTxt.join('/')
        }
        return '暂无内容'
      },
      relationTxt() {
        let rls = this.relations
        if (rls.length > 0) {
          let arr = rls.map(v => {
            return v.name
          })
          return arr.join('、')
        }
        return '暂无内容'
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      // 比较字段数值大小
      compare(property) {
        return (a, b) => {
          let v1 = a[property]
          let v2 = b[property]
          return v1 - v2
        }
      },
      getApprovers(type) {
        return this.approvers.filter(v => {
          return v.approveOrder === type
        })
      },
      handleEdit() {
        this.setCreateObject({ approvers: this.approvers })
        this.routePush({
          name: 'approverEdit1001',
          query: {
            msgId: this.routeQuery('msgId')
          }
        })
      },
      handleAddRelation() {
        this.setCreateObject({ filters: this.relations })
        this.routePush({
          name: 'addRelation1001',
          query: {
            msgId: this.routeQuery('msgId')
          }
        })
      },
      handleSubmit() {
        const that = this
        if (!that.curOperate) {
          that.$message({ message: '请选择审批结果', type: 'warning' })
          return false
        }

        let op = that.curOperate
        let msgId = that.routeQuery('msgId')
        let type = that.routeQuery('msgType')
        if (op.type === '2') {
          that.setStorage('approve_remark_cache', that.remark)
          that.routePush({
            name: 'selectApprover1001',
            query: { msgId: msgId, msgType: type }
          })
        } else {
          let postData = that.constructionMessage({
            id: msgId,
            type: type,
            status: op.type === '1' ? '4' : '5',
            remark: that.remark,
            groupId: that.groupId
          })
          delete postData.fromUserName
          that.modifyMessage(postData).then(res => {
            that.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          })
        }
      },
      handleItem(op, index) {
        this.curOperate = op
        this.operates = this.operates.map(v => {
          if (v.type === op.type) {
            v.selected = !op.selected
          } else {
            v.selected = false
          }
          return v
        })
      }
    }
  }
</script>
