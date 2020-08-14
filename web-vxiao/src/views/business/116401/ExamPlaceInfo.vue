<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <keep-alive>
      <EditorSimple :store.sync="form"
                    :toolbars="[]" />
    </keep-alive>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '@/views/business/1164/api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        form: {},
        medias: []
      }
    },
    components: {
      EditorSimple: (resolve) => require(['@/components/editor/EditorSimple'], resolve)
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      }
    },
    created() {
      const that = this
      that.placeId = that.routeQuery('pId')
      that.msgId = that.routeParam('msgId')
      Api.getExamPlaceDetail(that.placeId).then((res) => {
        if (res.reexam) {
          that.form = { content: res.reexam.remark }
        }
      })
    },
    methods: {
      handleSubmit() {
        const that = this
        if (Check.isNullString(that.form.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }
        Api.modifyExamPlaceDetail({
          reexam: {
            id: that.placeId,
            msgId: that.msgId,
            remark: that.form.content
          }
        }).then((res) => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
