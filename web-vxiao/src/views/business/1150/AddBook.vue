<template>
  <Page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <label slot="btn"
           @click="handleImport">批量导入</label>
    <item :hasClick="false"
          class="full-input">
      <input placeholder="ISBN码（可使用扫码枪扫描图书封底右下角条形码）"
             v-model="form.isbn"
             @blur="handleSearch($event)"
             @keyup.enter="handleSearch($event)" />
    </item>
    <Avatar @success="handleLogo">
      <Item>
        <div>封面</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(form.cover),error:Image.ICO_USER}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <item :hasClick="false">
      <div slot="main">书名</div>
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <item :hasClick="false">
      <div slot="main">作者</div>
      <input slot="remark"
             placeholder="必填"
             v-model="form.author" />
    </item>
    <item :hasClick="false">
      <div slot="main">出版社</div>
      <input slot="remark"
             placeholder="必填"
             v-model="form.publish" />
    </item>
    <item :hasClick="false">
      <div slot="main">出版日期</div>
      <div slot="after">
        <el-date-picker v-model="form.date"
                        prefix-icon="x"
                        :clearable="false"
                        type="datetime"
                        placeholder="选填"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
      </div>
    </item>
    <item :hasClick="false">
      <div slot="main">页码</div>
      <input slot="remark"
             placeholder="选填"
             v-model="form.pageSize" />
    </item>
    <item :hasClick="false">
      <div slot="main">价格</div>
      <input slot="remark"
             placeholder="选填"
             v-model="form.price" />
    </item>
    <item :hasClick="false">
      <div slot="main">分类号</div>
      <input slot="remark"
             placeholder="选填"
             v-model="form.categoryNumber" />
    </item>
    <item :hasClick="false">
      <div slot="main">种次号</div>
      <input slot="remark"
             placeholder="选填"
             v-model="form.seedNumber" />
    </item>
    <item :hasClick="false">
      <div slot="main">识别码</div>
      <input slot="remark"
             placeholder="必填"
             v-model="form.code" />
    </item>
    <item @click="handleBookType">
      <div slot="main">分类号</div>
      <input slot="remark"
             placeholder="版权页CIP数据处查看分类号首字母"
             v-model="bookTypeObj.typeName" />
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R, MixinMessage],
    props: {},
    data() {
      return {
        form: {
          isbn: '',
          cover: '',
          name: '',
          author: '',
          publish: '',
          date: '',
          pageSize: '',
          seedNumber: '',
          categoryNumber: '',
          code: '',
          price: '',
          bookType: ''
        },
        bookTypeObj: {}
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    computed: {
      ...mapGetters({
        meeting: 'getMeeting'
      }),
      title() {
        return this.routeQuery('appType') === '115002' ? '新建捐书' : '新建入库'
      }
    },
    methods: {
      ...mapActions(['setMeeting', 'modifyChannelMessage']),
      fetchData() {
        if (this.meeting.form) {
          this.form = { ...this.meeting.form }
        }
        let bookTypeObj = this.getStorage('_bookType_cache')
        if (Check.isObject(bookTypeObj)) {
          this.bookTypeObj = bookTypeObj
          this.form.bookType = bookTypeObj.value
        }
      },
      handleLogo(file) {
        this.$set(this.form, 'cover', file.id)
      },
      handleBookType() {
        this.setMeeting({ form: this.form })
        this.routePush({ name: 'selectBookType1150' })
      },
      handleSearch(e) {
        const that = this
        if (!Check.isNullString(e.target.value)) {
          Api.getBookInfo(e.target.value).then(res => {
            if (res.book) {
              let b = res.book
              that.form = {
                ...that.form,
                name: b.name || '',
                cover: b.logo ? b.logo.substring(b.logo.lastIndexOf('/') + 1) : '',
                author: b.author || '',
                publish: b.bookConcern || '',
                date: b.publishingDate || '',
                price: b.price || '',
                pageSize: b.pageCount || '',
                seedNumber: b.seedNumber || '',
                categoryNumber: b.categoryId || ''
              }
            }
          })
        }
      },
      importData(params) {
        const that = this
        this.$import({
          title: '导入图书',
          uploadURI: this.uploadURL,
          templateUrl: params.template,
          receiptUrl: params.uri,
          callback: (res, file) => {
            params.callback && params.callback(res)
          },
          receiptBack(res, file) {
            if (res.commonTable || res.commonTables) {
              let tbl = res.commonTable || res.commonTables[0]
              that.setStorage('_import_receipt', { lines: tbl.lines, headers: tbl.headers })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: params.uri,
                  fileId: file.id
                }
              })
            }
          }
        })
      },
      handleImport() {
        const that = this
        let type = this.routeQuery('appType')
        if (type === '115006') {
          this.importData({
            uri: `/business/book/parse/excel?groupId=${that.groupId}`,
            template: `/static/templates/bookTemplate.xlsx`,
            callback: res => {
              if (res.books) {
                let postData = that.constructionMessage({
                  type: type,
                  groupId: that.groupId,
                  msgJson: JSON.stringify(res.books)
                })
                that.addMessage(postData).then(res => {
                  that.$message({ message: '操作成功', type: 'success' })
                  that.routeBack(-2)
                })
              }
            }
          })
        } else {
          this.importData({
            uri: `/business/book/userDonateImport?schoolId=${that.schoolId}`,
            template: `/static/templates/donate_book.xlsx`,
            callback: res => {
              that.modifyChannelMessage(res.message)
              that.$message({ message: '操作成功', type: 'success' })
              that.routeBack(-2)
            }
          })
        }
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.isbn)) {
          that.$message({ message: '请输入正确的ISBN码', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.name)) {
          that.$message({ message: '书名不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.author)) {
          that.$message({ message: '作者不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.publish)) {
          that.$message({ message: '出版社不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.code)) {
          that.$message({ message: '识别码不能为空', type: 'warning' })
          return false
        }

        let type = this.routeQuery('appType')
        let mJson = {
          author: form.author,
          bookConcern: form.publish,
          categoryId: form.categoryNumber,
          fromUserId: that.userId,
          isbn: form.isbn,
          logo: form.cover,
          name: form.name,
          pageCount: form.pageSize,
          price: form.price,
          publishingDate: form.date,
          schoolId: that.currentGroup.parentId,
          seedNumber: form.seedNumber,
          bookType: form.bookType,
          sourceType: type === '115002' ? 3 : 2,
          targetCode: form.code
        }
        let postData = that.constructionMessage({
          type: type,
          groupId: that.groupId,
          msgJson: JSON.stringify(type === '115002' ? mJson : [mJson])
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.routeBack(-2)
        })
      }
    }
  }
</script>
