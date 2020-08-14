<template>
  <Page title="新建资讯"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item label="类型"
              :remark="typeTxt"></item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(tp, i) in types"
                          :key="i"
                          :command="tp">{{tp.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="资讯内容"
                    :toolbars="['photo']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import CategoryApi from '@/api/category'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        type: null,
        types: []
      }
    },
    computed: {
      typeTxt() {
        let tp = this.type || {}
        return tp.name || ''
      }
    },
    activated() {
      const that = this
      CategoryApi.getCategorysByType('82').then(res => {
        that.types = res.categorys || []
      })
    },
    methods: {
      handleType(item) {
        this.type = item
      },
      handleSubmit() {
        const that = this
        let editor = this.editorMessage
        if (!that.type) {
          that.$message({ message: '类型不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(editor.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          ...editor,
          type: '1117',
          groupId: that.groupId,
          categoryId: that.type.id,
          categoryName: that.type.name
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
      }
    }
  }
</script>
