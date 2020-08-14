<template>
  <page title="新建评课"
        closePrompt
        hasSubmit
        @submit="CommintCommentHandle"
        :hasClose="false">
    <div class="public-course-create-comment">
      <item :hasClick="false">
        <div>总分</div>
        <div slot="remark"
             v-if="total">{{total}}</div>
      </item>
      <div class="public-course-create-comment-list"
           v-if="commentItem.categories && commentItem.categories.length>0">
        <div v-for="(category, c) in commentItem.categories"
             :key="c">
          <div class="category-title text">{{category.name}}</div>
          <template v-if="category.childs.length>0">
            <el-dropdown class="drop-down public-course-create-comment-block"
                         trigger="click"
                         @command="downItemHandle"
                         v-for="(child, i) in category.childs"
                         :key="i">
              <span class="el-dropdown-link">
                <item>
                  <div slot="main">{{child.serialNumber}} {{child.name}}</div>
                  <div slot="remark"
                       v-if="child.value">{{child.value}}分</div>
                </item>
              </span>
              <el-dropdown-menu class="drop-menu"
                                slot="dropdown">
                <template v-if="child.maxScore">
                  <el-dropdown-item class="menu-item"
                                    v-for="n in child.maxScore"
                                    :key="n"
                                    :command="{n: n, obj: child}">{{n}}</el-dropdown-item>
                </template>

              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </div>
      </div>
      <div class="public-course-create-comment-editor">
        <keep-alive>
          <UeSimple placeholder="优点、不足和建议"
                    :toolbars="['photo', 'file']"
                    :store.sync="commentObj" />
        </keep-alive>
      </div>
    </div>
  </page>
</template>
<script>
import Api from '../api'
import ApiMessage from '@/api/message'
import CardMixin from '@/views/components/card/mixin'
import M from '@/views/business/mixin'
import { mapActions } from 'vuex'
export default {
  mixins: [CardMixin, M],
  components: {
    UeSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
  },
  data() {
    return {
      commentItem: {},
      commentObj: {
        content: '',
        medias: []
      },
      total: 0
    }
  },
  created() {
    const that = this
    Api.getCommentItem(that.routeQuery('templateId')).then(res => {
      if (res && res.code === '1') {
        that.commentItem = res.template
        that.commentItem.categories.forEach(c => {
          c.childs.forEach(child => {
            child.maxScore = Number(child.value)
            // that.total += Number(child.value)
            child.value = 0
          })
        })
      }
    })
  },
  methods: {
    ...mapActions(['modifyChannelMessage']),
    CommintCommentHandle() {
      let valuesHasNull = false
      let categoryData = []
      this.commentItem.categories.forEach(c => {
        c.childs.forEach(child => {
          let obj = {}
          obj.categoryId = child.id
          obj.score = child.value
          obj.isLast = false
          categoryData.push(obj)
          // 判空，0分
          if (child.value === 0) {
            valuesHasNull = true
          }
        })
      })
      if (valuesHasNull) {
        this.$message({
          type: 'warning',
          message: '评分项不能留空！请填写完整'
        })
        return
      }
      let reqBody = {
        content: this.commentObj.content,
        datas: categoryData,
        parentId: this.routeQuery('msgId'),
        groupId: this.currentGroup.groupId,
        medias: this.commentObj.medias,
        type: this.routeQuery('classroomType') || '1193',
        ...this.commonMessage()
      }
      ApiMessage.addMessage(reqBody).then(res => {
        if (res && res.code === '1') {
          this.modifyChannelMessage(res.messages[0])
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        }
      })
    },
    downItemHandle(o) {
      this.$set(o.obj, 'value', o.n)
      this.computedTotal()
    },
    computedTotal() {
      const that = this
      that.total = 0
      that.commentItem.categories.forEach(c => {
        c.childs &&
          c.childs.forEach(child => {
            that.total += Number(child.value)
          })
      })
    }
  }
}
</script>
<style lang="scss">
  @import '~scss/mixin';
  .public-course-create-comment {
    padding-bottom: rem(10);
    &-block {
      display: block;
    }
  }
</style>
