<template>
  <Page title="编辑商品"
        @submit="handleSubmit"
        hasSubmit>
    <div class="goods-detail">
      <item :hasClick="false"
            label="名称">
        <input slot="remark"
               type="text"
               placeholder="必填"
               v-model="form.name">
      </item>
      <item label="编码"
            :hasClick="false"
            :remark="form.goodsCode">
      </item>
      <item label="状态"
            :hasClick="false"
            :remark="form.status === '1' ? '已上架' : '已下架'">
      </item>
      <el-upload :action="uploadURL"
                 :data="{'cover':1}"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <item label="缩略图"
              id="_cover">
          <img slot="remark"
               class="logo-img"
               v-lazy="{src: logo}"
               alt='LOGO' />
        </item>
      </el-upload>
      <item label="商品类型"
            :hasClick="false"
            :remark="form.goodsTypeName">
      </item>
      <item label="预算类型"
            :hasClick="false"
            :remark="form.budgetTypeName">
      </item>
      <item label="税率"
            :hasClick="false"
            :remark="form.taxRate * 100">
        <div slot="after">%</div>
      </item>
      <item label="供应商（内部）"
            :hasClick="false"
            :remark="form.innerProviderName">
      </item>
      <item label="供应商（外部）"
            :hasClick="false"
            :remark="form.outsideProviderName">
      </item>
      <template v-if="form.goodsSchoolRelations">
        <div class="category-title text">价格</div>
        <item v-for="(item, i) in form.goodsSchoolRelations"
              :key="i"
              :label="item.areaName"
              :remark="item.schoolName || '全部'"
              @click="handlePrice(item)">
        </item>
      </template>
      <div class="category-title"></div>
      <item label="介绍内容"
            @click="handleContent">
      </item>
      <div class="button button-common"
           @click="handleOperate"
           :class="{'error': isUpper}">{{isUpper ? '下架' : '上架'}}</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        form: {
          name: '',
          goodsCode: '',
          icon: '',
          status: '1',
          innerProviderName: '',
          outsideProviderName: '',
          content: '',
          taxRate: 0,
          goodsTypeName: '',
          budgetTypeName: '',
          editor: null
        },
        loading: null,
        style:
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}body>.ql-editor{padding:0!important;}</style></head><body><div class="ql-editor">'
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      logo() {
        return this.form.icon ? this.url(this.form.icon) : ''
      },
      isUpper() {
        return this.form.status === '1'
      }
    },
    created() {
      if (this.obj.goods) {
        this.form = JSON.parse(JSON.stringify(this.obj.goods))
        if (this.obj.editor) {
          this.form.editor = this.obj.editor
          this.modifyCreateObjectField('editor')
        }
        this.modifyCreateObjectField('goods')
      } else {
        Api.getGoodsDetail(this.routeQuery('gid')).then(res => {
          let goods = res.mallGoods
          if (goods) {
            this.form = { ...goods, editor: null }
            if (goods.detail) {
              this.form.editor = {
                content: goods.detail.replace(this.style, '').replace('</div></body></html>', ''),
                medias: goods.medias ? JSON.parse(goods.medias) : []
              }
            }
          }
        })
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      uploadSuccess(res, file, fileLlist) {
        this.$set(this.form, 'icon', res.file.id)
        this.loading.close()
      },
      beforeUpload(file) {
        let isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        let limit2M = file.size / 1024 / 1024 < 2
        if (!limit2M) {
          this.$message({ message: '上传头像图片大小不能超过 2MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = this.$loading({ target: '#_cover' })
      },
      handlePrice(item) {
        this.setCreateObject({ goods: this.form })
        this.routePush({
          name: 'priceDetail10041',
          query: {
            schoolId: item.id
          }
        })
      },
      handleContent() {
        this.setCreateObject({ goods: this.form, editor: this.form.editor })
        this.routePush({
          name: 'contentEdit10041'
        })
      },
      handleSubmit() {
        let form = this.form
        let editor = form.editor || {}
        let content = editor.content ? `${this.style}${editor.content}</div></body></html>` : ''
        Api.modifyGoods({
          mallGoods: {
            id: form.id,
            name: form.name,
            icon: form.icon,
            detail: content,
            medias: (editor.medias || []).length > 0 ? JSON.stringify(editor.medias) : ''
          }
        }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      },
      handleOperate() {
        let form = this.form
        this.$confirm(`确认${this.isUpper ? '下架' : '上架'}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyGoodsStatus({
            goodsIdList: [form.id],
            goodsStatus: form.status === '1' ? '-1' : '1'
          }).then(res => {
            this.$message({ type: 'success', message: '操作成功' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
<style lang="scss">
  .goods-detail {
    .el-upload {
      display: block !important;
    }

    .logo-img {
      height: rem(50);
      margin: rem(5) rem(10) rem(5) rem(5);
    }
  }
</style>
