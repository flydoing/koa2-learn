<template>
  <Page :title="title">
    <Item :hasClick="false"
          noborder
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="search" />
    </Item>
    <el-collapse accordion>
      <el-collapse-item v-for="(u,i) in searchUsers"
                        :key="u.id">
        <template slot="title">
          <div class="pd">
            <label>{{u.userName}}</label>
            <label class="collapse-right">{{u | filterCardText}}</label>
          </div>
        </template>
        <div class="vx-vcard">
          <div class="vx-vcard-block"
               v-for="(vcard,j) in u.cards"
               :key="vcard.id">
            <div class="info">
              <div class="name">{{u.userName}}</div>
              <div class="balance">余额：￥{{vcard.balance}}</div>
            </div>
            <div class="detail">卡号：{{vcard.cardId}}</div>
            <div class="btn">
              <span class="text-color"
                    @click="supplement(u,vcard,i,j)">补现</span>
              <span class="text-color"
                    @click="recharge(u,vcard,i,j)">充值</span>
              <span class="text-color"
                    @click="change(u,vcard,i,j)">换卡</span>
              <span class="text-color"
                    @click="frozen(vcard,i,j)">{{vcard.status==='1'?'冻结':'解冻'}}</span>
              <template v-if="vcard.balance > 0">
                <span class="text-color"
                      @click="withdraw(vcard,i,j)">提现</span>
              </template>
              <template v-else>
                <span class="text-color error"
                      @click="unband(vcard,i,j)">解绑</span>
              </template>
            </div>
          </div>
          <div class="vx-vcard-block"
               @click="band(u)">
            <span class="text-color">绑卡</span>
          </div>
          <!-- <Item :hasClick="false" class="full-input">
            <input placeholder="卡号" v-model="u.cardId" />
          </Item> -->
          <!-- <div class="list-button">
            <el-button type="primary" icon="el-icon-upload" size="medium" @click="band(u)">绑定</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="unband(u)" v-if="u.id">解绑</el-button>
          </div> -->
        </div>
      </el-collapse-item>
    </el-collapse>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        title: '',
        cards: [],
        search: ''
      }
    },
    computed: {
      searchUsers() {
        let search = this.search.toLowerCase()
        let arr = this.cards
        if (!arr) {
          return []
        }
        if (search) {
          arr = this.cards.filter(u => {
            return u.userName.toLowerCase().indexOf(search) > -1
          })
        }
        return arr
      }
    },
    created() {
      this.title = this.routeQuery('title')
      Api.getVCardDetail(this.routeQuery('groupId'), this.routeQuery('schoolId')).then(res => {
        this.cards = res.cards
      })
    },
    methods: {
      band(u) {
        this.$prompt('', '新增', {
          inputPlaceholder: '输入卡号',
          inputPattern: /(^[0-9]{10}$)|(^[a-fA-F0-9]{8}$)/,
          inputErrorMessage: '请输入"8位的16进制"或"10位的10进制"',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              Api.addVCard({
                vcard: {
                  cardId: instance.inputValue,
                  userId: u.userId,
                  userName: u.userName,
                  schoolId: this.routeQuery('schoolId'),
                  groupId: this.routeQuery('groupId')
                }
              })
                .then(res => {
                  this.$message({ type: 'success', message: '绑定成功' })
                  instance.confirmButtonLoading = false
                  done()
                })
                .catch(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else {
              done()
            }
          }
        })
      },
      unband(card, i, j) {
        this.$confirm('确认解绑该卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.removeVCard({
            card: {
              id: card.id,
              cardId: card.cardId
            }
          }).then(res => {
            this.cards[i].splice(j, 1)
            this.$message({
              type: 'success',
              message: '解绑成功'
            })
          })
        })
      },
      withdraw(vcard, i, j) {
        this.$prompt(``, '提现', {
          inputPlaceholder: '输入金额',
          inputValue: vcard.balance,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value) || !Check.isNumber(value)) {
            this.$message({ type: 'warning', message: '请输入提现金额' })
            return false
          }
          if (parseFloat(value) <= 0) {
            this.$message({ type: 'warning', message: '输入金额有误，请重新输入' })
            return false
          }
          Api.commitWithdraw({
            card: {
              id: vcard.id,
              amount: value
            }
          }).then(res => {
            this.$set(vcard, 'balance', vcard.balance - parseFloat(value))
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
      },
      change(u, card, i, j) {
        this.$prompt(`旧卡将自动注销`, '换卡', {
          inputPlaceholder: '输入新卡号',
          inputValue: card.cardId,
          inputPattern: /(^[0-9]{10}$)|(^[a-fA-F0-9]{8}$)/,
          inputErrorMessage: '请输入"8位的16进制"或"10位的10进制"',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '充值中...'
              Api.transferVCard({
                vcard: {
                  cardId: instance.inputValue,
                  userId: u.userId,
                  oldCardId: card.cardId,
                  schoolId: this.routeQuery('schoolId'),
                  groupId: this.routeQuery('groupId')
                }
              })
                .then(res => {
                  this.$set(card, 'cardId', instance.inputValue)
                  this.$message({ type: 'success', message: '换卡成功' })
                  instance.confirmButtonLoading = false
                  done()
                })
                .catch(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else {
              done()
            }
          }
        })
      },
      supplement(u, card, i, j) {
        this.$prompt(`卡号：${card.cardId}`, '补现', {
          inputPlaceholder: '补现金额',
          inputPattern: /^[0-9]+(.[0-9]{2})?$/,
          inputErrorMessage: '金额只能是数字，且小数点保留2未',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '补现中...'
              Api.rechargeVCard({
                vcard: {
                  cardId: card.cardId,
                  userId: u.userId,
                  amount: instance.inputValue,
                  operationType: '3',
                  schoolId: this.routeQuery('schoolId'),
                  groupId: this.routeQuery('groupId')
                }
              })
                .then(res => {
                  this.$set(card, 'balance', card.balance + parseInt(instance.inputValue))
                  this.$message({ type: 'success', message: '补现成功' })
                  instance.confirmButtonLoading = false
                  done()
                })
                .catch(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else {
              done()
            }
          }
        })
      },
      recharge(u, card, i, j) {
        this.$prompt(`卡号：${card.cardId}`, '充值', {
          inputPlaceholder: '充值金额',
          inputPattern: /^[0-9]+(.[0-9]{2})?$/,
          inputErrorMessage: '金额只能是数字，且小数点保留2未',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '充值中...'
              Api.rechargeVCard({
                vcard: {
                  cardId: card.cardId,
                  userId: u.userId,
                  amount: instance.inputValue,
                  operationType: '1',
                  schoolId: this.routeQuery('schoolId'),
                  groupId: this.routeQuery('groupId')
                }
              })
                .then(res => {
                  this.$set(card, 'balance', card.balance + parseInt(instance.inputValue))
                  this.$message({ type: 'success', message: '充值成功' })
                  instance.confirmButtonLoading = false
                  done()
                })
                .catch(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
            } else {
              done()
            }
          }
        })
      },
      frozen(card, i, j) {
        let txt = card.status === '2' ? '解冻' : '冻结'
        this.$confirm(`确认${txt}该卡?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyLock({
            card: {
              id: card.id,
              status: card.status === '1' ? '2' : '1'
            }
          }).then(res => {
            this.$message({
              type: 'success',
              message: `${txt}成功`
            })
            this.$set(card, 'status', card.status === '1' ? '2' : '1')
          })
        })
      }
    },
    filters: {
      filterCardText(u) {
        let cardIds = []
        u.cards &&
          u.cards.forEach(c => {
            cardIds.push(c.cardId)
          })
        return cardIds.join('、')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .collapse-right {
    float: right;
    padding-right: rem(8);
    color: nth($font-color, 7);
    font-size: rem(13);
  }

  .vx-vcard {
    @include flex;
    @include wrap;
    @include jc(space-between);
    padding: 0 rem(15);
    &-block {
      color: #fff;
      width: 49%;
      cursor: pointer;
      padding: rem(15);
      min-height: rem(150);
      margin-bottom: rem(15);
      border-radius: rem(5);
      position: relative;
      background: -webkit-linear-gradient(90deg, #ff8d5e, #ffb05e);
      background: -o-linear-gradient(90deg, #ff8d5e, #ffb05e);
      background: -moz-linear-gradient(90deg, #ff8d5e, #ffb05e);
      background: linear-gradient(90deg, #ff8d5e, #ffb05e);
      .info {
        overflow: hidden;
        .name {
          float: left;
        }
        .balance {
          float: right;
        }
      }
      .detail {
        line-height: rem(40);
      }
      .btn {
        position: absolute;
        bottom: 0;
        right: rem(15);
        text-align: right;
        line-height: rem(35);
        span {
          padding: rem(5);
        }
      }
    }
  }
</style>
