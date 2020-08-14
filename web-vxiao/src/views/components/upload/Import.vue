<template>
  <Overlay :show.sync="visible"
           height="450"
           width="390">
    <div class="vx-import">
      <div class="vx-import-title">{{title}}</div>
      <div class="vx-import-body">
        <el-upload class="upload-demo"
                   drag
                   :action="uploadURI"
                   :on-success="handleSuccess"
                   :on-error="handleError">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip"
               slot="tip">
            <div><b>导入说明</b></div>
            <template v-if="templateUrl!=='#'">
              <div>1、必须按正确的格式将数据填入模板（<a class="vx-import-template"
                   :href="templateUrl"
                   download>下载模板</a>）</div>
              <div>2、文件格式必须为xls或xlsx。</div>
            </template>
            <template v-else>
              <div>1、文件格式必须为xls或xlsx。</div>
            </template>
          </div>
        </el-upload>
      </div>
    </div>
  </Overlay>
</template>
<script>
  export default {
    props: {
      title: { type: String, default: '导入' },
      uploadURI: { type: String },
      receiptUrl: { type: String },
      templateUrl: { type: String, default: '#' },
      callback: { type: Function, default: () => {} },
      receiptBack: { type: Function, default: () => {} }
    },
    data() {
      return {
        visible: true
      }
    },
    methods: {
      close() {
        this.visible = false
      },
      handleError(res, file) {
        this.callback(res, file)
      },
      handleSuccess(res, file) {
        let that = this
        let _file = file.response.file
        if (that.receiptUrl) {
          that.$http
            .get(`${that.receiptUrl}&fileId=${_file.id}`)
            .then(_res => {
              // that.$message({
              //   type: 'success',
              //   message: _res.msg || '导入成功'
              // })
              that.callback(_res, _file)
              this.close()
            })
            .catch(_res => {
              that.receiptBack(_res, _file)
              that.close()
            })
        } else {
          that.callback(res, _file)
          that.close()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-import {
    background: #ffffff;
    border-radius: rem(3);
    height: 100%;

    &-title {
      line-height: rem(40);
      text-align: center;
      border-bottom: $border;
      @include fc;
    }

    &-body {
      padding: nth($padding, 3);
    }

    &-template {
      display: inline-block;
      @include fc;
    }

    .el-upload__tip {
      line-height: rem(24);
    }
  }
</style>
