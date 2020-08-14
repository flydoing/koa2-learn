<template>
  <Page title="导入头像"
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
           v-for="u in users"
           :key="u.userId">
        <div class="avatar">
          <img class="avatar"
               v-lazy="{src:url(u.avatar),error:Image.ICO_USER}" />
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
import Check from '@/utils/check'
import { mapActions } from 'vuex'
export default {
  mixins: [R],
  data() {
    return {
      users: [],
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
      Api.getGroupStudents(this.groupId).then(res => {
        this.users = res.relations
        // .filter(u => {
        //   return !u.avatar
        // })
        this.loading = false
      })
    },
    onSubmit() {
      let _users = []
      this.users.forEach(u => {
        if (u.avatar) {
          _users.push({
            id: u.id,
            avatar: u.avatar,
            groupId: this.groupId,
            userId: u.userId
          })
        }
      })
      Api.addGroupRelation({
        relations: _users
      }).then(res => {
        if (Check.isRealArray(res.relations)) {
          res.relations.forEach(relation => {
            this.modifyRelation(relation)
          })
          this.init()
          this.$message({ type: 'success', message: '批量上传成功' })
        }
      })
    },
    onBefore(file) {
      const isJPG = ['image/jpg', 'image/jpeg', 'image/png', 'image/pjpeg', 'image/x-png'].includes(file.type)
      const isLt = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传头像只能是 JPG、PNG 格式！')
      }
      if (!isLt) {
        this.$message.error(`上传头像图片大小不能超过 5MB！`)
      }
      const isExist =
        this.users.filter(u => {
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
        avatar: res.file.id
      })
      this.isUpload = false
    },
    prefixStyle(u) {
      return { width: `${u.progress || 0}%` }
    },
    changeFileUser(fileName, orgs) {
      this.users.some((u, i) => {
        if (fileName.indexOf(u.name) >= 0) {
          this.$set(this.users, i, {
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
    .progress {
      width: 0%;
      height: rem(5);
      @include bc;
    }
  }
</style>
