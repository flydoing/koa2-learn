<template>
  <page :title="title">
    <div class="class-room-resource">
      <item v-for="(resource, r) in resourceList"
            :key="r"
            @click="itemClick(resource)"
            v-if="resource.type!=='image'">
        <div>{{resource.name}}</div>
      </item>
      <el-upload class="avatar-uploader"
                 :action="uploadURL"
                 :show-file-list="false"
                 v-for="(resource, r) in resourceList"
                 :key="r"
                 v-if="resource.type==='image'"
                 :on-success="handleUploadSuccess">
        <item>
          <div>{{resource.name}}</div>
        </item>
      </el-upload>
    </div>
  </page>
</template>
<script>
  import G from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [G],
    data() {
      return {
        resourceList: [
          {
            name: '教学设计',
            type: '1043',
            range: 17
          },
          {
            name: '课件',
            type: '1151',
            range: 14
          },
          {
            name: '习题',
            type: '1047',
            range: 8
          },
          {
            name: '阅读作业',
            type: '1069',
            range: 18
          },
          {
            name: '微课',
            type: '1074',
            range: 12
          },
          {
            name: '资源',
            type: '1072',
            range: 9
          },
          {
            name: '作业',
            type: '1002',
            range: 19
          },
          {
            name: '视频',
            type: '1156',
            range: 16
          },
          {
            name: '图片',
            type: 'image'
          },
          {
            name: '链接',
            type: 'url'
          }
        ],
        title: ''
      }
    },
    computed: {
      ...mapGetters({
        cacheClassRoom: 'getClassRoomCreate'
      })
    },
    created() {
      switch (Number(this.routeQuery('msgType'))) {
        case 1:
          this.title = '请选择课前资料'
          this.resourceList = this.resourceList.filter(r => {
            return r.type !== 'url' && r.type !== 'image'
          })
          break
        case 2:
          this.title = '请选择课中资料'
          this.resourceList = this.resourceList.filter(r => {
            return r.type !== '1069' && r.type !== '1002'
          })
          break
        case 3:
          this.title = '请选择课后资料'
          this.resourceList = this.resourceList.filter(r => {
            return r.type !== 'url' && r.type !== 'image'
          })
      }
    },
    methods: {
      ...mapActions(['saveClassRoomCreate']),
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
              name: 'classRoomCatalogues1269',
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
              name: 'classRoomCourseList1269',
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
            name: 'classRoomCatalogues1269',
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
