<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="readed === 2">
    <div class="add-summary">
      <template v-if="readed === 2">
        <keep-alive>
          <EditorSimple placeholder="输入内容"
                        :store.sync="form"
                        :toolbars="[]">
            <span class="btn btn-insert-award"
                  slot="toolbar"
                  @click="handleInsert">插入评语</span>
          </EditorSimple>
        </keep-alive>
      </template>
      <template v-else>
        <div class="summary-txt"
             v-html="converContent(form.content)"></div>
      </template>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          content: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        summary: 'getCreateObject'
      }),
      title() {
        let item = this.summary.item || {}
        return item.name || ''
      },
      readed() {
        return parseInt(this.routeQuery('readed') || 0)
      },
      msgId() {
        return this.routeParam('msgId')
      }
    },
    created() {
      let comments = this.summary.comments
      if (comments) {
        if (comments.length > 0) {
          let datas = comments.map(v => {
            return v.content
          })
          this.form.content = datas.join('<br>')
        }
        this.modifyCreateObjectField('comments')
      } else if (this.summary.item) {
        this.form.content = this.summary.item.content
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleInsert() {
        let item = this.summary.item
        this.routePush({
          name: 'selectComment1222',
          query: { userId: item.userId }
        })
      },
      handleSubmit() {
        const that = this
        let item = this.summary.item
        if (Check.isNullString(that.form.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let postData = {
          fromUserId: that.userId,
          userId: item.userId,
          content: that.form.content,
          msgId: that.msgId,
          description: item.description
        }
        item.id && (postData.id = item.id)
        Api.commitSummaryData(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .add-summary {
    & > div.summary-txt {
      padding: rem(5) rem(8);
      text-align: justify;
    }
  }
</style>
