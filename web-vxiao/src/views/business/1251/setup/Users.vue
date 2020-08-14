<template>
  <Page :title="title">
    <el-collapse accordion>
      <el-collapse-item v-for="r in users"
                        :key="r.id">
        <template slot="title">
          <div class="pd">{{r | showCardId }}</div>
        </template>
        <div class="pd">
          <Item :hasClick="false"
                class="full-input">
            <input placeholder="校徽设备号"
                   v-model="r.cardId" />
          </Item>
          <div class="list-button">
            <el-button type="primary"
                       icon="el-icon-upload"
                       size="medium"
                       @click="band(r)">绑定</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="medium"
                       @click="unband(r)"
                       v-if="r.id">解绑</el-button>
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
      return { users: [], title: this.routeQuery('name') }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        Api.getUserList(this.routeQuery('groupId')).then(res => {
          this.users = res.cards
        })
      },
      band(u) {
        Api.bandCardId({
          vdevice: {
            cardId: u.cardId,
            schoolId: this.routeQuery('schoolId'),
            type: 13,
            userId: u.userId
          }
        }).then(res => {
          if (res.code === '1') {
            this.$message({
              type: 'success',
              message: '绑定成功'
            })
            this.init()
          }
        })
      },
      unband(u) {
        Api.unbandCardId({
          card: { id: u.id, status: 'd' }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
          this.init()
        })
      }
    },
    filters: {
      showCardId(r) {
        let txt = r.userName
        if (r.id) {
          txt = `${r.userName}（设备号：${r.cardId}）`
        }
        return txt
      }
    }
  }
</script>
