<template>
  <page title="习题设置"
        @submit="handleSubmit"
        closePrompt
        hasSubmit>
    <div class="class-room-resource">
      <item label="倒计时"
            :hasClick="false">
        <input slot="remark"
               placeholder="不限"
               v-model="extensionType.countdownTime" />
        <div slot="after">秒</div>
      </item>
      <item label="分数"
            :hasClick="false">
        <input slot="remark"
               placeholder="不限"
               v-model="extensionType.points" />
        <div slot="after">分</div>
      </item>
      <item @click="extensionType.isAllExtensionType = !extensionType.isAllExtensionType">
        <div>应用到全部</div>
        <div slot="remark">
          <i-switch :value="extensionType.isAllExtensionType"
                    @click="extensionType.isAllExtensionType = !extensionType.isAllExtensionType" />
        </div>
        <span slot="after"></span>
      </item>
    </div>
  </page>
</template>
<script>
import G from '@/views/group/mixin'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [G],
  data () {
    return {
      extensionType: {
        countdownTime: '',
        points: '',
        isAllExtensionType: false,
        id: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      settingTime: 'getSettingTime'
    })
  },
  created() {
    // 匹配id，显示数据
    this.extensionType.id = this.routeQuery('id')
    let settingTime = this.settingTime || []
    settingTime.map(item => {
      if (item.id === this.extensionType.id) {
        this.extensionType = item
      }
    })
  },
  methods: {
    ...mapActions(['saveSettingTime']),
    handleSubmit() {
      // this.routeBack()
      let settingTime = this.settingTime || []
      
      // 应用到全部：
      if (this.extensionType.isAllExtensionType) {
        settingTime.map(item => {
          item.countdownTime = this.extensionType.countdownTime
          item.points = this.extensionType.points
          item.isAllExtensionType = false
        })
        this.extensionType.isAllExtensionType = true
      }
      // updata还是push
      let repeatArray = []
      repeatArray = settingTime.filter(item => {
        return item.id === this.extensionType.id
      })
      if (repeatArray.length > 0) {
        settingTime.map(item => {
          // 1.1存在重复的习题：替换
          if (item.id === this.extensionType.id) {
            item = this.extensionType
          }
        })
      } else {
        // 1.2不存在：push加入
        settingTime.push(this.extensionType)
      }
      this.saveSettingTime(settingTime)
      this.routeBack()
      // this.routePush({
      //   path: '/vx/group/business/create/default',
      //   query: {
      //     appType: this.routeQuery('appType'),
      //     groupId: this.routeQuery('groupId'),
      //     ...this.extensionType
      //   }
      // })
    },
    itemClick(resource) {
      // 如果item类型为url或者image, 不跳转到目录
      if (resource.type === 'url') {
        this.$prompt('请输入链接', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: 'http://',
          inputErrorMessage: '链接格式不正确'
        })
          .then(({ value }) => {
            let reg =
              '(http://|https://|(www[.]{1})){1}((([0-9a-z]+[.]){1,2}[0-9a-z]+)|(([0-9]{1,3}.){3}[0-9]{1,3}))(:[0-9]{1,4})?(([/?[a-zA-Z0-9=&#._-]*)|(/[a-zA-Z0-9?=&#._-]*)?)'
            let result = value.match(reg)
            if (result !== null && result !== undefined) {
              let classLesson = [
                ...this.cacheClassRoom.classLesson,
                {
                  fileId: value,
                  type: 'url'
                }
              ]
              this.saveClassRoomCreate({
                classLesson: classLesson
              })
              this.routeBack()
            } else {
              this.$message({
                type: 'error',
                message: '链接格式不正确'
              })
              return false
            }
          })
          .catch(() => {})
        return false
      }
      if (this.isClass) {
        // 如果当前群是班级 并且 上一次已经选过课程，则直接跳转目录，如果上次没选过课程，则跳转用户所有的课程群列表
        if (this.cacheClassRoom.selectedGroup) {
          this.routePush({
            name: 'classRoomCatalogues1073',
            query: {
              range: resource.range,
              groupId: this.cacheClassRoom.selectedGroup.groupId,
              groupName: this.cacheClassRoom.selectedGroup.name,
              appName: resource.name,
              type: resource.type,
              msgType: this.routeQuery('msgType')
            }
          })
        } else {
          this.routePush({
            name: 'classRoomCourseList1073',
            query: {
              range: resource.range,
              appName: resource.name,
              type: resource.type,
              msgType: this.routeQuery('msgType')
            }
          })
        }
      } else {
        // 如果当前群为课程群，则直接跳转到该课程下的目录列表
        this.routePush({
          name: 'classRoomCatalogues1073',
          query: {
            range: resource.range,
            groupId: this.currentGroup.groupId,
            appName: resource.name,
            type: resource.type,
            msgType: this.routeQuery('msgType')
          }
        })
      }
    },
    handleUploadSuccess(res, file) {
      if (res.file.extension === 'jpg' || res.file.extension === 'jpeg' || res.file.extension === 'png' || res.file.extension === 'gif') {
        res.file.type = 'photo'
      }
      this.saveClassRoomCreate({
        classLesson: [...this.cacheClassRoom.classLesson, res.file]
      })
      this.routeBack()
    }
  }
}
</script>
<style lang="scss">
@import '~scss/mixin';
.class-room-resource {
  .el-upload {
    display: block;
  }
}
</style>
