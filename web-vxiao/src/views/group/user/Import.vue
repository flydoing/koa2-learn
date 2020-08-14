<template>
  <Page title="文件导入">
    <div class="user-import">
      <el-upload ref="_elupload"
                 drag
                 :action="uploadURL"
                 :on-success="onSuccess"
                 :before-upload="onBefore"
                 accept=".xls,.xlsx"
                 :multiple="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip"
             slot="tip">
          <div><b>导入说明</b></div>
          <div>
            <span>1、下载模板，填写新成员信息</span>（
            <template v-if="isClass">
              <a class="vx-import-template"
                 href="/static/templates/group_import_teacher.xls"
                 download>老师模板</a>、
              <a class="vx-import-template"
                 href="/static/templates/group_import_parent.xls"
                 download>家长模板</a>
            </template>
            <template v-else>
              <a class="vx-import-template"
                 href="/static/templates/group_import_user.xls"
                 download>成员模板</a>
            </template>
            ）
          </div>
          <div>2、文件格式必须为xls或xlsx</div>
        </div>
      </el-upload>
      <div v-if="showProgress"
           style="line-height:30px;padding:10px 0;">
        <el-progress :text-inside="true"
                     :stroke-width="25"
                     :percentage="importData.processPercent"
                     status="success"></el-progress>
        <div>
          <span>成功：{{importData.successNum}}条、失败：{{importData.errorNum}}条</span> <span @click="downloadError"
                v-if="importData.errorNum>0">下载失败数据</span>
        </div>
      </div>
    </div>
    <div class="category-title text"
         v-if="historys.length > 0">导入历史</div>
    <Item v-for="(history,i) in historys"
          :key="i"
          :hasClick='false'>
      <div>{{showText(history.modifyTime)}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import DateFormat from '@/utils/date'
  export default {
    mixins: [R],
    data() {
      return {
        historys: [],
        showProgress: false,
        importData: {
          processPercent: 0,
          successNum: 0,
          errorNum: 0
        }
      }
    },
    created() {
      Api.loadImportHistory(this.currentGroup.groupId, this.userId).then(res => {
        this.historys = res.importDataList
      })
    },
    methods: {
      showText(t) {
        return DateFormat.converFormat(new Date(t))
      },
      onBefore() {},
      onSuccess(res, file) {
        Api.importGroupUser(this.groupId, this.userId, file.response.file.id).then(res => {
          this.$refs._elupload.clearFiles()
          this.importData = res.importData
          this.showProgress = true
          let inteterval = setInterval(() => {
            Api.loadImportProgress(this.importData.id)
              .then(res => {
                this.importData = res.importData
                if (this.importData.processPercent === 100) {
                  clearInterval(inteterval)
                }
              })
              .catch(() => {
                clearInterval(inteterval)
              })
          }, 500)
        })
      },
      downloadError() {
        this.openBrowser(`/rest/school/downloadErrorImportData/${this.importData.id}`)
      }
    }
  }
</script>
<style lang="scss">
  .user-import {
    padding: nth($padding, 3);
    .el-upload,
    .el-upload-dragger {
      width: 100% !important;
    }
    .vx-import-template {
      display: inline-block;
      @include fc;
    }

    .el-upload__tip {
      line-height: rem(24);
    }
  }
</style>
