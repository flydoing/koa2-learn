<template>
  <Page title="举报" @submit="submit" hasSubmit>
    <Item v-for="c in categorys" :key="c.id" @click="handle(c)">
      <div slot="before">
        <i :class="prefixCls(c)"></i>
      </div>
      <div>{{c.name}}</div>
    </Item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from '@/api/category'
  import Str from '@/utils/string'
  export default {
    data() {
      return {
        categorys: [],
        checkList: {}
      }
    },
    created() {
      Api.getComplain().then(res => {
        this.categorys = res.categorys
      })
    },
    methods: {
      submit() {
        if (Check.isNullObject(this.checkList)) {
          this.$messsage({ type: 'warning', message: '请选择举报类型' })
          return
        }
        const that = this
        that.$confirm('确定举报该消息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/business/message/complain', {
            complainType: this.id,
            complainReason: this.checkList.name,
            msgId: this.routeQuery('msgId'),
            refId: Str.uuid()
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.routeBack()
          })
        })
      },
      handle(c) {
        this.checkList = c
      },
      prefixCls(c) {
        return [`ico ico-select`, {
          [`active`]: this.checkList.id === c.id
        }]
      }
    }
  }

</script>
