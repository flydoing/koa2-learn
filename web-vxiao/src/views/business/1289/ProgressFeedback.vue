<template>
  <Page title="进展反馈"
        closePrompt
        hasSubmit
        @submit="submit">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">类型</div>
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
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="[]" />
    </keep-alive>
  </Page>
</template>
<script>
  // import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapActions } from 'vuex'
  import Api from './api.js'
  import categoryApi from '@/api/category'
  export default {
    mixins: [R, MixinMessage],
    props: { app: Object },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        typeValue: null,
        types: [], // 分类
        editorMessage: {} // 富文本内容
      }
    },
    computed: {
      typeTxt() {
        if (this.typeValue) {
          return this.typeValue.name ? this.typeValue.name : ''
        }
      }
    },
    created() {
      this.getCategorys()
    },
    methods: {
      ...mapActions(['modifyChannelMessage']),
      // 获取分类
      getCategorys() {
        categoryApi.getCategorys({ type: '222' }).then(res => {
          this.types = res.categorys
        })
      },
      // 类型选择
      handleType(item) {
        item['categoryId'] = item.id
        delete item.createTime
        delete item.modifyTime
        this.typeValue = item
      },
      submit() {
        if (!this.typeTxt) {
          this.$message({ message: '类型不能为空', type: 'warning' })
          return
        }
        if (!this.editorMessage) {
          this.$message({ message: '反馈内容不能为空', type: 'warning' })
          return
        }
        let messageId = this.$route.query.id
        let postData = this.constructionMessage({
          groupId: this.currentGroupId,
          ...this.typeValue,
          ...this.editorMessage
        })
        Api.progressFeedBack(messageId, postData).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.typeValue = null
          this.modifyChannelMessage(res.messages[0]) // 更新列表
          this.routeBack()
        })
      },
      handleBack() {
        if (this.content.length > 0) {
          this.$confirm('是否取消当前操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.routeBack()
          })
        } else {
          this.routeBack()
        }
      }
    }
  }
</script>
