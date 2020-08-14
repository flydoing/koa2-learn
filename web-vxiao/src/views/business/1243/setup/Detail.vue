<template>
  <Page :title="title">
    <el-collapse accordion>
      <el-collapse-item v-for="u in cards"
                        :key="u.id">
        <template slot="title">
          <div class="collapse">
            <label>{{u.userName}}</label>
            <label class="collapse-right">{{u.decimalCardId || u.cardId}}</label>
          </div>
        </template>
        <div class="pd">
          <Item :hasClick="false"
                class="full-input">
            <input placeholder="卡号"
                   v-model="u.decimalCardId" />
          </Item>
          <div class="list-button">
            <el-button type="primary"
                       icon="el-icon-upload"
                       size="medium"
                       @click="band(u)">绑定</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="medium"
                       @click="unband(u)"
                       v-if="u.id">解绑</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        title: '',
        cards: []
      }
    },
    created() {
      this.title = this.routeQuery('title')
      Api.getVCardDetail(this.routeQuery('groupId')).then(res => {
        this.cards = res.cards
      })
    },
    methods: {
      band(u) {
        Api.addVCard({
          cards: [
            {
              cardId: u.decimalCardId,
              groupId: this.routeQuery('groupId'),
              schoolId: this.routeQuery('schoolId'),
              userId: u.userId
            }
          ]
        }).then(res => {
          this.$message({ type: 'success', message: '绑定成功' })
        })
      },
      unband(u) {
        this.$set(u, 'cardId', '')
        Api.removeVCard({ card: { id: u.id } }).then(res => {
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  .collapse {
    padding: 0 rem(10);
    width: 100%;
  }
  .collapse-right {
    float: right;
    padding-right: rem(8);
    color: nth($font-color, 7);
    font-size: rem(13);
  }
</style>
