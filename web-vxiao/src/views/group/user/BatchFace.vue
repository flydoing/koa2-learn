<template>
  <Page title="导入人脸"
        :loading="loading"
        :hasSubmit="!isUpload"
        @submit="onSubmit">
    <template v-if="isUpload">
      <el-upload slot="btn"
                 ref="_upload"
                 multiple
                 :show-file-list="false"
                 :action="uploadURL"
                 :on-success="onSuccess"
                 :on-progress="onProgress"
                 :before-upload="onBefore">
        <span slot="trigger"
              style="color:#FFF;">批量导入</span>
      </el-upload>
      <el-tooltip slot="btn"
                  class="item"
                  effect="dark"
                  placement="bottom-end">
        <i class="el-icon-question"></i>
        <div slot="content">
          导入提示：<br />
          1.建议上传.jpg、.png格式的图片，单张图片不超过1MB<br />
          2.请将要导入的图片名称设置为对应的学生姓名<br />
          3.导入的图片请不要有重复命名
        </div>
      </el-tooltip>
    </template>
    <div class="u-avatar">
      <div class="block"
           v-for="u in detects"
           :key="u.userId">
        <div class="avatar">
          <img class="avatar"
               v-lazy="{src:url(u.face),error:Image.ICO_USER}" />
        </div>
        <div class="name">{{u.name}}</div>
        <div class="progress"
             :style="prefixStyle(u)"></div>
      </div>
    </div>
  </Page>
</template>
<script>
  import R from '../mixin'
  import Api from '@/api/group'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        detects: [],
        isUpload: true,
        loading: true
      }
    },
    created() {
      this.init()
    },
    methods: {
      ...mapActions(['modifyRelation']),
      init() {
        this.isUpload = true
        Api.getUnFaceList(this.groupId).then(res => {
          this.detects = res.detects || []
          this.loading = false
        })
      },
      onSubmit() {
        let _users = []
        this.detects.forEach(u => {
          if (u.face) {
            _users.push({
              face: u.face,
              name: u.name,
              userId: u.userId,
              groupId: this.groupId
            })
          }
        })
        Api.modifyUsersFace({
          detects: _users
        }).then(res => {
          this.$message({ type: 'success', message: '已提交，正在校验人脸信息' })
          this.routeBack()
          // if (Check.isRealArray(res.errDetects)) {
          //   this.$message({ type: 'error', message: `${res.errDetects.length} 个用户人脸识别失败` })
          // }
          // if (Check.isRealArray(res.detects)) {
          //   res.detects.forEach(d => {
          //     let _detects = [...this.detects]
          //     _detects.some((u, j) => {
          //       if (d.userId === u.userId) {
          //         this.detects.splice(j, 1)
          //       }
          //     })
          //   })
          // }
        })
      },
      onBefore(file) {
        const isJPG = ['image/jpg', 'image/jpeg', 'image/png', 'image/pjpeg', 'image/x-png'].includes(file.type)
        const isLt = file.size / 1024 / 1024 < 5
        if (!isJPG) {
          this.$message.error('上传人脸只能是 JPG、PNG 格式！')
        }
        if (!isLt) {
          this.$message.error(`上传人脸图片大小不能超过 5MB！`)
        }
        const isExist =
          this.detects.filter(u => {
            return file.name.indexOf(u.name) >= 0
          }).length > 0
        return isJPG && isLt && isExist
      },
      onProgress(e, file, fileList) {
        this.changeFileUser(file.name, { progress: e.percent })
      },
      onSuccess(res, file) {
        this.changeFileUser(file.name, {
          progress: 0,
          face: res.file.id
        })
        this.isUpload = false
      },
      prefixStyle(u) {
        return { width: `${u.progress || 0}%` }
      },
      changeFileUser(fileName, orgs) {
        this.detects.some((u, i) => {
          if (fileName.indexOf(u.name) >= 0) {
            this.$set(this.detects, i, {
              ...u,
              ...orgs
            })
            return true
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .u-avatar {
    @include flex;
    @include jc(flex-start);
    @include ai;
    @include wrap;
    padding: rem(10) rem(0);
    .block {
      @include ct;
      @include fd;
      width: rem(70);
      margin-bottom: rem(5);
    }
    .name {
      @include fh;
      font-size: rem(12);
      text-align: center;
      line-height: rem(25);
    }
    .avatar {
      border-radius: 0%;
    }
    .progress {
      width: 0%;
      height: rem(5);
      @include bc;
    }
  }
</style>
