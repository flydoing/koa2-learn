<template>
  <Page title="新建开户"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="关联学校"
          @click="handleSchool"
          :remark="schoolTxt"></item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    :toolbars="['photo', 'file']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import { mapGetters, mapActions } from 'vuex'
  import MessageApi from '@/api/message'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          school: null,
          message: null
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      schoolTxt() {
        let school = this.form.school || {}
        return school.name || '必填'
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        if (this.crm.form) {
          this.form = JSON.parse(JSON.stringify(this.crm.form))
          if (this.crm.school) {
            this.form.school = this.crm.school
            this.deleteCrmProp('school')
          }
          this.deleteCrmProp('form')
        } else {
          MessageApi.getMessageById(this.routeQuery('msgId')).then(res => {
            this.form.message = res.message
          })
        }
      },
      handleSchool() {
        this.setCrm({ form: this.form, school: this.form.school })
        this.routePush({
          path: '/vx/group/business/1287/selectSchool'
        })
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (!form.school) {
          that.$message({ message: '关联学校不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(editor.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let replys = [
          that.constructionMessage({
            ...editor,
            medias: [],
            groupId: that.groupId
          })
        ]
        if (Check.isRealArray(editor.medias)) {
          editor.medias.forEach(v => {
            replys.push(
              that.constructionMessage({
                ...editor,
                content: '',
                medias: [v],
                groupId: that.groupId
              })
            )
          })
        }

        let school = form.school
        let message = form.message
        let mJson = JSON.parse(message.msgJson)
        let postData = {
          id: message.id,
          groupId: this.groupId,
          status: '8',
          msgJson: JSON.stringify({
            ...mJson,
            schoolClientRelation: {
              clientId: mJson.clientId,
              peSchoolId: school.id,
              peSchoolName: school.name,
              peSchoolType: school.schoolType,
              peSchoolGroupId: school.groupId,
              areaId: school.areaId
            }
          }),
          replys: replys
        }

        that.modifyMessage(postData).then(res => {
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
