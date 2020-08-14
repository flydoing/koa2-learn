<template>
  <page title="新建作业"
        closePrompt
        hasSubmit
        listenBack
        @submit="commitCreateHomework"
        @back="back">
    <div class="homework-create">
      <item @click="selectSubjectClick">
        <div>科目</div>
        <div slot="remark">{{homework.subject.name || ''}}</div>
      </item>
      <item v-if="isCourse"
            @click="catalogueSelectClick">
        <div>目录</div>
        <div slot="remark">{{homework.remark.categoryName || ''}}</div>
      </item>
      <el-dropdown trigger="click"
                   @command="homeworkType">
        <item class="el-dropdown-link">
          <div>类型</div>
          <div slot="remark">{{homework.category.name}}</div>
        </item>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(type, t) in homeworkTypes">
            <el-dropdown-item v-if="homeworkTypes.length>0"
                              :command="type"
                              :key="t">{{type.name}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click"
                   @command="limitType"
                   v-if="homework.category.name==='在线作业'">
        <item class="el-dropdown-link">
          <div>答卷查看权限</div>
          <div slot="remark">{{homework.limit.name}}</div>
        </item>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(limit, l) in checkLimits">
            <el-dropdown-item :command="limit"
                              v-if="checkLimits.length>0"
                              :key="l">{{limit.name}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <item @click="Answerhandle"
            v-if="homework.category.name==='在线作业'">
        <div>参考答案</div>
        <div slot="remark">{{homework.remark.answer.content || ''}}</div>
      </item>
      <item @click="setParentAppraise">
        <div>家长评价</div>
        <div slot="remark">
          <i-switch :value="homework.remark.parentAppraise==='1'"
                    @click="setParentAppraise"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <item :hasClick="false">
        <div>定时发送</div>
        <div slot="remark">
          <el-date-picker v-model="homework.remark.time"
                          :clearable="false"
                          :picker-options="{ start: '08:30', step: '00:15', end: '18:30'}"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm:ss.0 +0800"
                          prefix-icon="xxx"
                          placeholder="选填">
          </el-date-picker>
        </div>
      </item>
      <item @click="recommendVScreen">
        <div>推荐到班牌</div>
        <div slot="remark">
          <i-switch :value="homework.recommend"
                    @click="recommendVScreen"
                    trueValue="1"
                    falseValue="0"></i-switch>
        </div>
        <span slot="after"></span>
      </item>
      <keep-alive>
        <EditorSimple :toolbars="['photo', 'file', 'at', 'emoji', 'topic', 'open']"
                      :store.sync="homework"
                      placeholder="作业内容" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import CategoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        homeworkTypes: [],
        checkLimits: [],
        homework: {
          category: {},
          subject: {
            id: 0
          },
          limit: {},
          content: '',
          remark: {
            parentAppraise: '1',
            visibleField: '1',
            time: '',
            answer: {
              content: ''
            }
          },
          isPrivate: '0',
          medias: [],
          notify: [],
          recommend: '1',
          tagging: [],
          toUsers: []
        }
      }
    },
    computed: {
      ...mapGetters({
        cacheHomework: 'getHomework'
      })
    },
    activated() {
      CategoryApi.getCategorys({
        groupId: this.currentGroup.groupId,
        type: '39'
      }).then(res => {
        this.homeworkTypes = res.categorys
        if (!this.cacheHomework.isEdit) {
          this.$set(this.homework, 'category', this.homeworkTypes[1])
        }
      })
      CategoryApi.getCategorys({
        groupId: this.currentGroup.groupId,
        type: '72'
      }).then(res => {
        this.checkLimits = res.categorys
        if (!this.cacheHomework.isEdit) {
          this.$set(this.homework, 'limit', this.checkLimits[0])
        }
      })
      if (this.cacheHomework.isEdit) {
        this.initHomework()
      }
    },
    methods: {
      ...mapActions(['saveHomework', 'clearHomework']),
      back() {
        this.$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clearHomework()
          this.routeBack()
        })
      },
      commitCreateHomework() {
        if (this.isCourese && !this.homework.remark.categoryId) {
          this.$message({
            type: 'warning',
            message: '请选择目录'
          })
          return false
        }
        if (!this.homework.content) {
          this.$message({
            type: 'warning',
            message: '内容不能为空'
          })
          return false
        }
        let homework = { ...this.homework }
        let categoryId = homework.category.id
        let title = homework.subject.id ? homework.subject.name : ''
        homework.remark.answer = JSON.stringify(this.homework.remark.answer)
        homework.remark = JSON.stringify(this.homework.remark)
        delete homework.category
        delete homework.subject
        delete homework.limit
        let reqBody = {
          categoryId: categoryId,
          title: title,
          groupId: this.currentGroup.groupId,
          msgType: this.homework.category.extension,
          type: '1002',
          ...homework,
          ...this.constructionMessage()
        }
        this.addMessage(reqBody).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
          this.clearHomework()
        })
      },
      setParentAppraise() {
        let isOpen = this.homework.remark.parentAppraise === '1' ? '0' : '1'
        this.$set(this.homework.remark, 'parentAppraise', isOpen)
      },
      recommendVScreen() {
        let isRecommend = this.homework.recommend === '1' ? '0' : '1'
        this.$set(this.homework, 'recommend', isRecommend)
      },
      selectSubjectClick() {
        this.saveCacheHomework()
        this.routePush({
          name: 'selectSubject1002'
        })
      },
      catalogueSelectClick() {
        this.saveCacheHomework()
        this.routePush({
          name: 'selectcatalogue1002'
        })
      },
      homeworkType(obj) {
        this.$set(this.homework, 'category', obj)
      },
      limitType(obj) {
        this.$set(this.homework, 'limit', obj)
      },
      Answerhandle() {
        this.saveCacheHomework()
        this.routePush({
          name: 'answersEdit1002'
        })
      },
      saveCacheHomework() {
        this.saveHomework({
          ...this.cacheHomework,
          ...this.homework,
          isEdit: true
        })
      },
      initHomework() {
        this.homework = JSON.parse(
          JSON.stringify({
            ...this.homework,
            ...this.cacheHomework
          })
        )
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .homework-create {
    .el-dropdown {
      display: block;
      width: 100%;
    }

    .el-date-editor {
      &.el-input {
        width: 100%;
      }
    }

    .el-time-panel__content {
      &::before {
        top: 54%;
      }
      &::after {
        top: 54%;
        left: 0;
      }
    }

    .el-input--suffix .el-input__inner {
      padding-left: rem(8);
      padding-right: rem(8);
    }

    .el-time-panel__footer {
      padding-right: rem(15);
    }
    textarea {
      min-height: 100px;
      padding: 8px;
      font-size: 14px;
      border: none;
    }
  }

  .el-time-spinner__item {
    line-height: rem(18) !important;
  }
</style>
