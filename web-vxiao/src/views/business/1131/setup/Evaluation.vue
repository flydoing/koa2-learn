<template>
  <Page title="评比卡管理"
        @add="add"
        :hasAdd="true">
    <Item v-for="card in cards"
          :key="card.id"
          @click="edit(card)">
      <div>{{card.userName}}</div>
      <div slot="remark">{{card.cardId}}</div>
      <div slot="after">
        <i class="ico ico-delete"
           @click.stop="remove(card)" />
      </div>
    </Item>
  </Page>
</template>
<script>
import Api from '../api'
export default {
  data() {
    return { cards: [] }
  },
  created() {
    Api.getVCardDetail(this.routeQuery('groupId')).then(res => {
      this.cards = res.cards
    })
  },
  methods: {
    add() {
      let that = this
      that
        .$prompt(' ', '新增评比卡号', {
          inputPattern: /(^[0-9]{10}$)|(^[a-fA-F0-9]{8}$)/,
          inputErrorMessage: '请输入"8位的16进制"或"10位的10进制"',
          inputPlaceholder: '卡号',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          Api.addRatingVCard({
            vcard: {
              cardId: value,
              schoolId: this.routeQuery('schoolId'),
              userName: '日常评比'
            }
          }).then(res => {
            this.$message({ type: 'success', message: '添加成功' })
            this.routeBack()
          })
        })
        .catch(() => {})
    },
    edit(item) {
      let that = this
      that
        .$prompt(' ', '修改评比卡号', {
          inputPattern: /(^[0-9]{10}$)|(^[a-fA-F0-9]{8}$)/,
          inputErrorMessage: '请输入"8位的16进制"或"10位的10进制"',
          inputValue: item.cardId,
          inputPlaceholder: '卡号',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          Api.addRatingVCard({
            vcard: {
              cardId: value,
              schoolId: this.routeQuery('schoolId'),
              oldCardId: item.cardId,
              userName: item.userName
            }
          }).then(res => {
            this.$message({ type: 'success', message: '修改成功' })
            this.routeBack()
          })
        })
        .catch(() => {})
    },
    remove(r) {
      Api.removeVCard({
        card: {
          id: r.id
        }
      })
    }
  }
}
</script>
