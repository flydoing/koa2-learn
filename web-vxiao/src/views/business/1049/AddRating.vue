<template>
  <page :title="title" @submit="handleSubmit" hasSubmit :hasClose="false">
    <div v-if="rating.isRemark">
      <item @click="handleItem">
        <div slot="main" v-html="itemTxt"></div>
        <div slot="remark" v-if="rating.curItem" v-html="rating.curItem.name"></div>
      </item>
    </div>
    <div v-else>
      <item :hasClick="false">
        <div slot="main">分值</div>
        <input slot="remark" class="align-right" :placeholder="sPlaceholder" v-model="score" />
      </item>
    </div>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage" :toolbars="['photo']" />
    </keep-alive>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import MessageApi from '@/api/message'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        score: '',
        editorMessage: {}
      }
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      title() {
        return this.rating.isRemark ? '添加备注' : '评分'
      },
      itemTxt() {
        return this.rating.project ? '班级' : '项目'
      },
      sPlaceholder() {
        if (this.rating.curItem) {
          let rule = this.rating.curItem.rule
          return `输入${rule.minPoint}至${rule.maxPoint}的分值`
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setRating']),
      handleSubmit() {
        const that = this
        let project = that.rating.project
        let item = that.rating.curItem
        let postData = that.constructionMessage({
          type: '1107',
          ...this.editorMessage
        })

        if (that.rating.isRemark) {
          if (!item) {
            let txt = this.rating.project ? '请选择班级' : '请选择项目'
            that.$message({ message: txt, type: 'warning' })
            return false
          }
          if (project) {
            postData = {
              ...postData,
              groupId: item.groupId,
              categoryId: project.id,
              msgJson: JSON.stringify({
                score: project.score,
                type: project.name
              })
            }
          } else {
            postData = {
              ...postData,
              groupId: that.rating.cls.groupId,
              categoryId: item.id,
              msgJson: JSON.stringify({
                score: item.score,
                type: item.name
              })
            }
          }
        } else {
          let rule = item.rule
          if (Check.isNullString(that.score)) {
            that.$message({ message: '分值不能为空', type: 'warning' })
            return false
          }
          if (parseFloat(that.score) < rule.minPoint || parseFloat(that.score) > rule.maxPoint) {
            that.$message({ message: `请输入正确的分值（${rule.minPoint}至${rule.maxPoint}分）`, type: 'warning' })
            return false
          }

          let score = parseFloat(that.score)
          if (project) {
            postData = {
              ...postData,
              groupId: item.groupId,
              categoryId: project.id,
              msgJson: JSON.stringify({
                score: score,
                type: project.name
              })
            }
          } else {
            postData = {
              ...postData,
              groupId: that.rating.cls.groupId,
              categoryId: item.id,
              msgJson: JSON.stringify({
                score: score,
                type: item.name
              })
            }
          }
        }
        MessageApi.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleItem() {
        this.routePush({
          name: 'selectItem1049'
        })
      }
    },
    watch: {}
  }

</script>
<style scoped></style>
