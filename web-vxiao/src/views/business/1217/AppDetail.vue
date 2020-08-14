<template>
  <AppPage :title="app.name"
           :showTips="users.length===0"
           :loading="loading">
    <label slot="btn"
           @click="batchBand">批量绑定</label>
    <AppCommon :app="curApp" />
    <el-collapse accordion>
      <el-collapse-item v-for="r in this.users"
                        :key="r.id">
        <template slot="title">
          <div class="pd">{{r | showCardId }}</div>
        </template>
        <div class="pd">
          <Item :hasClick="false"
                class="full-input">
            <input placeholder="Touch设备号"
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
  </AppPage>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        users: [],
        schoolId: '',
        loading: false
      }
    },
    computed: {
      curApp() {
        return this.currentApp || this.app
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.loading = true
        Api.getUserList(this.schoolId)
          .then(res => {
            this.users = res.cards || []
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      band(u) {
        Api.bandCardId({
          vdevice: {
            cardId: u.cardId,
            schoolId: this.schoolId,
            type: 9,
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
      },
      batchBand() {
        this.$import({
          title: '批量绑定',
          uploadURI: `${this.$store.state.FILE_URL}/readExcel`,
          templateUrl: `/terminal/vtouch/exportTemplate/${this.schoolId}?`,
          callback: (res, file) => {
            if (Check.isRealArray(res.dataGirds) && Check.isRealArray(res.dataGirds[0].data)) {
              let data = res.dataGirds[0].data
              data.shift()
              Api.batchImport({
                dataJson: JSON.stringify(data),
                schoolId: this.schoolId
              }).then(res => {
                if (res.errorMsg) {
                  this.$message({
                    type: 'warning',
                    message: res.errorMsg
                  })
                }
              })
            }
          }
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
    },
    watch: {
      currentApp(v) {
        this.init()
      }
    }
  }
</script>
