<template>
  <page title="新建公文"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="active-create"
         slot="top">
      <item :hasClick="false"
            class='full-input'>
        <input type="text"
               placeholder="标题"
               v-model="form.title" />
      </item>
      <item :hasClick="false">
        <div slot="main">公文编号</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.number" />
      </item>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleType">
        <div class="el-dropdown-link">
          <item>
            <div slot="main">分类</div>
            <div slot="remark"
                 v-html="typeTxt"></div>
          </item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in types"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <item @click="handleApprover">
        <div slot="main">审批人</div>
        <div slot="remark"
             v-html="approverTxt"></div>
      </item>
      <item @click="handleRange">
        <div slot="main">可视范围</div>
        <div slot="remark"
             v-html="rangeTxt"></div>
      </item>
    </div>
    <div class="editor-item"
         v-if="maxHeight > 0">
      <keep-alive>
        <Editor :store.sync="editorMessage"
                placeholder="公文内容"
                :height="maxHeight"
                ref="_editor" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      Editor: resolve => require(['@/components/editor/Editor'], resolve)
    },
    data() {
      return {
        form: {
          title: '',
          type: null,
          number: '',
          approvers: [],
          ranges: []
        },
        maxHeight: 0,
        style:
          '<!DOCTYPE html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /><link rel="stylesheet" href="http://m.vxiao.cn/static/css/quill.snow.css" /><style media="screen">table{border-spacing: 0;}td{border: 1px solid #ebebeb;padding: 8px;}@media screen and (-webkit-device-pixel-ratio:3){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:2){p{font-size:16.5px}}@media screen and (-webkit-device-pixel-ratio:1){p{font-size:14px}}img{max-width:100%!important;}</style></head><body><div class="ql-editor">',
        types: []
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        doc: 'getDocument'
      }),
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      },
      approverTxt() {
        let aps = this.form.approvers
        return aps.length > 0 ? `${aps.length}人` : ''
      },
      rangeTxt() {
        let ranges = this.form.ranges
        return ranges.length > 0 ? `${ranges.length}人` : ''
      }
    },
    methods: {
      ...mapActions(['setDocument']),
      fetchData() {
        const that = this
        if (that.doc.form) {
          that.form = { ...that.doc.form }
          if (that.doc.isApprover && Check.isRealArray(that.doc.users)) {
            that.form.approvers = that.doc.users
          } else if (Check.isRealArray(that.doc.users)) {
            that.form.ranges = that.doc.users
          }
          that.setDocument({ users: [], isCache: false })
        }
        Api.getItems(that.currentGroup.parentId, this.currentGroup.groupId).then(res => {
          this.types = res.items
          if (!this.form.type) {
            this.form.type = res.items[0]
            this.form.approvers = res.items[0].users || []
          }
        })
      },
      handleType(item) {
        this.form.type = item
        if (Check.isRealArray(item.users)) {
          this.form.approvers = item.users
        }
      },
      handleApprover() {
        let tp = { ...this.form.type, users: this.form.approvers }
        this.setDocument({ form: this.form, category: tp, isApprover: true, isCache: true })
        this.routePush({ name: 'approverEdit1248' })
      },
      handleRange() {
        this.setDocument({ form: this.form, users: this.form.ranges, isApprover: false })
        this.routePush({ name: 'selectMember1248' })
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (Check.isNullString(form.title)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.number)) {
          that.$message({ message: '公文编号不能为空', type: 'warning' })
          return false
        }

        if (!form.type) {
          that.$message({ message: '请选择分类', type: 'warning' })
          return false
        }

        if (!Check.isRealArray(form.approvers)) {
          that.$message({ message: '请选择审批人', type: 'warning' })
          return false
        }

        if (Check.isNullString(this.editorMessage.content)) {
          that.$message({ message: '公文内容不能为空', type: 'warning' })
          return false
        }

        let toUsers = form.approvers.map(v => {
          return {
            type: 'to',
            userId: v.userId,
            name: v.name,
            avatar: v.avatar,
            sort: v.approveOrder
          }
        })

        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1248',
          title: form.title,
          groupId: that.currentGroup.groupId,
          categoryId: form.type.id,
          categoryName: form.type.name,
          content: `${that.style}${this.editorMessage.content}</div></body></html>`,
          extensionType: form.number,
          toUsers: toUsers,
          msgType: '1',
          isPrivate: 1
        })

        if (Check.isRealArray(form.ranges)) {
          postData.msgJson = JSON.stringify(
            form.ranges.map(v => {
              return {
                userId: v.userId,
                groupId: that.groupId
              }
            })
          )
        }

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          this.setDocument({ form: null })
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.setDocument({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
