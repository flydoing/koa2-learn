<template>
  <Page title="新建微信群"
        closePrompt
        hasSubmit
        @submit="handleSubmit"
        listenBack
        @back="back">
    <div class="questionaire-create">
      <item @click="importPraxis">
        <div slot="main">导入文件</div>
        <div slot="remark"></div>
      </item>
      <item :hasClick="false"
            class="apply">
        <div>时间</div>
        <el-date-picker slot="remark"
                        v-model="startTime"
                        :clearable="false"
                        type="datetime"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        prefix-icon="xxx"
                        placeholder="必填"
                        @change="handleStarTime">
        </el-date-picker>
      </item>
      <div class="category-title"></div>
      <!--需要v-for一下查出用户的数据 -->
      <item :hasClick="false"
            v-for="user in users"
            :key="user.id">
        <div>{{user.userName}}</div>
        <input slot="remark"
               type="text"
               placeholder="数量"
               v-model="user.count">
      </item>
    </div>
  </Page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import DateUtils from '@/utils/date'
  export default {
    // 组件引入之后需要继承
    mixins: [R, MixinMessage],
    data() {
      return {
        startTime: '',
        users: []
      }
    },
    computed: {
      dateTime() {
        return DateUtils.format(this.startTime, 'yyyyMMdd')
      }
    },
    activated() {
      this.fetchData()
    },
    methods: {
      // checkTime和handleStarTime为判断是否超过今天时间
      checkTime(time) {
        if (new Date(this.startTime).getTime() > new Date().getTime()) {
          this.$message({ message: '日期不能超过今天', type: 'warning' })
          return false
        }
        return true
      },
      handleStarTime(time) {
        if (!this.checkTime(this.startTime)) {
          this.startTime = DateUtils.format(new Date(), DateUtils.YMD)
        }
        this.initUsers()
      },
      fetchData() {
        let cback = this.getStorage('_receipt_cback_data')
        if (cback) {
          if (Check.isRealArray(cback.weChatGroupUserStatistics)) {
            let uMap = new Map()
            cback.weChatGroupUserStatistics.map(v => {
              uMap.set(v.userId, v)
            })
            this.users = this.users.map(v => {
              let data = uMap.get(v.userId)
              v.count = data.count
              // if (data) {

              // }
              return v
            })
          }
        }
        // 默认当天日期
        this.startTime = DateUtils.format(new Date(), DateUtils.YMD)
        this.initUsers()
      },
      initUsers() {
        Api.weixinDetails(this.groupId, this.dateTime).then(res => {
          // code=1，时间默认当天
          let resData = res.weChatGroupUserStatistics
          let obj = new Map()
          if (Check.isRealArray(resData)) {
            resData.forEach(u => {
              obj.set(u.userId, { count: u.count, id: u.id })
            })
          }
          // 拉取群关系，定义一个count
          this.users = this.getGroupUsers(this.groupId).map(v => {
            return {
              userName: v.name,
              userId: v.userId,
              count: 0,
              ...obj.get(v.userId)
            }
          })
        })
      },
      handleSubmit() {
        // 这里是封装一组数据
        let postData = this.constructionMessage({
          groupId: this.groupId,
          msgJson: JSON.stringify(this.users),
          times: [
            {
              setTime: DateUtils.format_0800(this.startTime),
              type: '1'
            }
          ],
          type: 1261
        })
        this.addMessage(postData)
          .then(res => {
            this.$message({ message: '添加成功', type: 'success' })
            this.routeBack()
          })
          .catch(res => {
            this.$message({ type: 'warning', message: '添加失败！' })
          })
      },
      importPraxis() {
        // 三个地址，一个模板地址，一个下载地址，还有一个就是文件错误后从新解析的地址
        const that = this
        that.$import({
          title: '导入文件',
          uploadURI: that.uploadURL,
          templateUrl: `/business/crm/wechatgroup/import/template/${this.groupId}`,
          callback(res, file) {
            Api.weixinTemp(that.groupId, res.file.id).then(result => {
              if (result.commonTable) {
                this.setStorage('_import_receipt', result.commonTable)
                let urlSrc = `/business/crm/wechatgroup/parse/excel/${that.groupId}/${res.file.id}`
                that.routePush({
                  path: '/vx/group/import/receipt',
                  query: {
                    uri: `${urlSrc}`,
                    fileId: res.file.id,
                    cback: 1
                  }
                })
              } else {
                if (Check.isRealArray(result.weChatGroupUserStatistics)) {
                  let uMap = new Map()
                  result.weChatGroupUserStatistics.map(v => {
                    uMap.set(v.userId, v)
                  })
                  that.users = that.users.map(v => {
                    let data = uMap.get(v.userId)
                    if (data) {
                      v.count = data.count
                    }
                    return v
                  })
                }
              }
            })
          }
        })
      },
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .apply {
    .el-date-editor {
      &.el-input {
        width: 100%;
      }
    }

    .el-time-panel__content {
      &::before {
        top: 54%;
      }

      &::after {
        top: 54%;
        left: 0;
      }
    }

    .el-input--suffix .el-input__inner {
      padding-left: rem(8);
      padding-right: 0;
    }

    .el-time-panel__footer {
      padding-right: rem(15);
    }
  }
</style>
