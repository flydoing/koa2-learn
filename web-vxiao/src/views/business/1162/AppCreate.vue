<template>
  <page title="新建学生风采"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="student-mien-create">
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item>
          <div slot="main">上传风采形象</div>
          <div slot="remark">
            <img class="avatar"
                 v-lazy="{src:logo}"
                 alt='LOGO' />
          </div>
        </item>
      </el-upload>
      <item @click="handleMember">
        <div slot="main">学生</div>
        <div slot="remark"
             v-html="userTxt"></div>
      </item>
      <item @click="handlePost">
        <div slot="main">职务</div>
        <div slot="remark"
             v-html="postTxt"
             class="ellipsis"></div>
      </item>
      <item @click="handleRange"
            v-if="isSchool">
        <div slot="main">显示范围</div>
        <div slot="remark"
             v-html="rangeTxt"></div>
      </item>
      <item :hasClick="false"
            class="full-input">
        <input placeholder="荣誉介绍（限20字）"
               v-model="form.description" />
      </item>
      <TextInput placeholder="介绍内容（200字以内）"
                 v-model="form.content"></TextInput>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          content: '',
          avatar: null,
          description: '',
          user: null,
          posts: []
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        mien: 'getStudentMien',
        vscreen: 'getCreateObject'
      }),
      rangeTxt() {
        if (this.vscreen.places && this.vscreen.places.length > 0) {
          return `${this.vscreen.places.length}个场所`
        } else {
          return ''
        }
      },
      logo() {
        return this.form.avatar ? this.url(this.form.avatar.id) : ''
      },
      userTxt() {
        return this.form.user ? this.form.user.name : ''
      },
      postTxt() {
        let posts = this.form.posts
        return posts.length > 0
          ? posts
              .map(v => {
                return v.name
              })
              .join('、')
          : ''
      }
    },
    methods: {
      ...mapActions(['setStudentMien', 'clearSelectedList']),
      handleRange() {
        this.routePush({ name: 'selectPlace1162' })
      },
      fetchData() {
        const that = this
        if (that.mien.form) {
          that.form = { ...that.mien.form }
          if (that.mien.user) {
            that.form.user = that.mien.user
          }
          if (Check.isRealArray(that.mien.posts)) {
            that.form.posts = that.mien.posts
          }
        }
      },
      uploadSuccess(res, file, fileLlist) {
        this.form.avatar = res.file
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit1M = file.size / 1024 / 1024 < 1
        if (!limit1M) {
          this.$message({ message: '上传风采形象图片大小不能超过 1MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
      },
      handleMember(item) {
        if (this.isSchool) {
          this.routePush({ name: 'selectClass1162' })
          this.setStudentMien({ form: this.form, user: this.form.user })
        } else {
          this.setStudentMien({ form: this.form, user: this.form.user })
          this.routePush({ name: 'selectMember1162' })
        }
      },
      handlePost() {
        this.setStudentMien({ form: this.form, posts: this.form.posts })
        this.routePush({ name: 'selectPost1162' })
      },
      handleSubmit() {
        const that = this
        let form = that.form

        if (Check.isNullString(form.avatar)) {
          that.$message({ message: '风采形象不能为空', type: 'warning' })
          return false
        }

        if (!form.user) {
          that.$message({ message: '请选择学生', type: 'warning' })
          return false
        }
        if (this.isSchool) {
          if (this.vscreen.places.length < 1) {
            that.$message({ message: '请选择显示范围', type: 'warning' })
            return false
          }
        }

        if (Check.isNullString(form.description)) {
          that.$message({ message: '荣誉介绍简介不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.content)) {
          that.$message({ message: '介绍内容不能为空', type: 'warning' })
          return false
        }
        let toUsers = []
        this.vscreen.places.some(v => {
          toUsers.push({
            name: v.name,
            type: 'cc',
            userId: v.id,
            userType: 'place'
          })
        })
        let postData = that.constructionMessage({
          type: '1163',
          content: form.content,
          title: form.description,
          groupId: that.currentGroup.groupId,
          medias: [
            {
              type: 'photo',
              fileId: form.avatar.id,
              fileName: form.avatar.name,
              size: form.avatar.size,
              extension: form.avatar.extension,
              remark: form.avatar.remark,
              status: 1
            }
          ],
          extensionType: form.user.name,
          userId: form.user.userId,
          toUsers: toUsers
        })

        if (Check.isRealArray(form.posts)) {
          postData.msgJson = JSON.stringify({
            categorys: form.posts.map(v => {
              return { id: v.id, name: v.name }
            })
          })
        }

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          // 新建成功后清空存储选择的学生
          this.clearSelectedList()
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setStudentMien({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .student-mien-create {
    .el-upload {
      display: block !important;
    }

    textarea {
      height: rem(150);
    }
  }
</style>
