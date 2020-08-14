<template>
  <page title="新建习题"
        closePrompt
        listenBack
        @back="back">
    <div slot="btn">
      <div>
        <el-dropdown class="submit-type"
                     trigger="click"
                     @command="handleDraft">
          <div class="btn">草稿</div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(item, i) in draftOpts"
                              :key="i"
                              :command="item">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-dropdown class="submit-type"
                     trigger="click"
                     @command="submitPraxis">
          <div class="btn"
               v-if="praxis.curDifficulty">提交</div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(item, i) in submitTypes"
                              :key="i"
                              :command="item">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="create-praxis">
      <div class="category-title">
        <span class="right"
              @click="importPraxis">从文件中批量导入习题</span>
      </div>
      <item :hasClick="false">
        <div>习题名称</div>
        <input type="text"
               slot="remark"
               placeholder="选填"
               v-model="praxis.name">
      </item>
      <item @click="praxis.isBatch = !praxis.isBatch">
        <div>{{isCourse ? '批量设置目录和难度' : '批量设置难度'}}</div>
        <div slot="remark">
          <i-switch :value="praxis.isBatch"
                    @click="praxis.isBatch = !praxis.isBatch" />
        </div>
        <span slot="after"></span>
      </item>
      <div class="batch-setting-bar"
           v-if="praxis.isBatch">
        <div class="setting-list">
          <div class="btn"
               v-if='isCourse'
               @click="cetegoryChange">{{praxis.curCategory.name || '目录'}}</div>
          <el-dropdown class="drop-down"
                       trigger="click"
                       @command="difficultChange">
            <div class="btn"
                 v-if="praxis.curDifficulty">{{praxis.curDifficulty.name || '难度'}}</div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <template v-for="(item, i) in praxis.difficulty">
                <el-dropdown-item v-if="praxis.difficulty.length>0"
                                  class="menu-item"
                                  :key="i"
                                  :command="item">{{item.name}}</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 题目控件 -->
      <PraxisView :praxis.sync="praxis"
                  appType="1047" />
    </div>
    <div slot="bottom"
         class="add-praxis-btn"
         @click="addQuestion">添加题目</div>
  </page>
</template>
<script>
import Api from './api'
import MessageApi from '@/api/message'
import CategoryApi from '@/api/category'
import G from '@/views/group/mixin'
import Check from '@/utils/check'
import MixinMessage from '@/views/group/mixinMessage'
import PraxisView from '@/views/business/1047/components/commonPraxis'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [G, MixinMessage],
  components: {
    PraxisView
  },
  data() {
    return {
      draftOpts: [
        {
          name: '存为草稿',
          value: '1'
        },
        {
          name: '查看列表',
          value: '2'
        }
      ],
      praxis: {
        name: '',
        curCategory: {},
        isBatch: false,
        curDifficulty: {},
        difficulty: [],
        questions: [
          {
            content: '',
            explain: '',
            type: '8',
            isCreate: true
          }
        ]
      },
      draft: null,
      submitTypes: [{ name: '直接提交', type: 1 }, { name: '提交并生成习题组', type: 2 }]
    }
  },
  computed: {
    ...mapGetters({
      cahchePraxis: 'getPraxis'
    })
  },
  activated() {
    let draft = this.getStorage('_praxis_draft_cache')
    if (draft) {
      Api.getDraftDetail(draft.id).then(res => {
        if (res.praxis) {
          this.praxis.name = res.praxis.title
          this.praxis.questions = res.praxis.questions.map(v => {
            v.content = v.title
            v.isCreate = true
            return v
          })
        }
      })
    } else if (this.cahchePraxis.isHasCache) {
      this.praxis = JSON.parse(JSON.stringify(this.cahchePraxis))
    }
    CategoryApi.getCategorys({
      type: '44',
      extension: 'filter'
    }).then(res => {
      this.praxis.difficulty = res.categorys
    })
  },
  methods: {
    ...mapActions(['savePraxis', 'clearPraxis']),
    getQuestions() {
      let questions = []
      let difficulty = this.praxis.curDifficulty ? this.praxis.curDifficulty : this.praxis.difficulty[0]
      let datas = JSON.parse(JSON.stringify(this.praxis.questions))
      datas.forEach((question, k) => {
        let temp = []
        if (question.type === '16') {
          question.options.forEach(optionArr => {
            optionArr.forEach(option => {
              temp.push(option)
            })
          })
        }
        let options = []
        if (Check.isRealArray(question.options)) {
          options = question.options.map(v => {
            v.content = v.content
            delete v.imgs
            return v
          })
        }
        questions.push({
          categoryId: this.isCourse ? (this.praxis.isBatch ? this.praxis.curCategory.id : question.curCategory.id) : void 0,
          difficulty: this.praxis.isBatch ? difficulty.value : question.curDifficulty ? question.curDifficulty.value : difficulty.value,
          options: temp.length > 0 ? temp : options,
          title: question.content,
          type: question.type,
          explain: question.explain || void 0,
          medias: question.medias ? question.medias : void 0,
          direction: question.curDirection ? question.curDirection.value : void 0,
          spaceCount: question.curSpaceCount ? question.curSpaceCount : void 0,
          mediaType: question.type === '13' || question.type === '17' ? (question.type === '13' ? 2 : 1) : void 0
        })
        // 格式化综合题 提交内容
        let subQuestions = []
        question.questions &&
          question.questions.forEach(subQuestion => {
            let subTemp = []
            if (subQuestion.type === '16') {
              subQuestion.options.forEach(optionArr => {
                optionArr.forEach(option => {
                  subTemp.push(option)
                })
              })
            }
            subQuestions.push({
              options: subTemp.length > 0 ? subTemp : subQuestion.options,
              title: subQuestion.content,
              type: subQuestion.type,
              explain: subQuestion.explain || void 0,
              medias: subQuestion.medias ? subQuestion.medias : void 0,
              direction: subQuestion.curDirection ? subQuestion.curDirection.value : void 0,
              spaceCount: subQuestion.curSpaceCount ? subQuestion.curSpaceCount : void 0,
              mediaType: subQuestion.type === '13' || subQuestion.type === '17' ? (subQuestion.type === '13' ? 2 : 1) : void 0
            })
          })
        if (subQuestions.length > 0) {
          questions[k].questions = subQuestions
        }
      })
      return questions
    },
    submitPraxis(obj) {
      if (!Check.isRealArray(this.praxis.questions)) {
        this.$message({
          type: 'warning',
          message: '先导入模板或者添加题目'
        })
        return false
      }
      if (this.isCourse) {
        if (this.praxis.isBatch) {
          if (!this.praxis.curCategory.id) {
            this.$message({
              type: 'warning',
              message: '请设置目录'
            })
            return false
          }
        } else {
          let bol = this.praxis.questions.some(q => {
            return !q.hasOwnProperty('curCategory')
          })
          if (bol) {
            this.$message({
              type: 'warning',
              message: '请设置目录'
            })
            return false
          }
        }
      }
      if (this.praxis.isBatch) {
        if (!this.praxis.curDifficulty.id) {
          this.$message({
            type: 'warning',
            message: '请设置题目难度'
          })
          return false
        }
      } else {
        let bol = this.praxis.questions.some(q => {
          return !q.hasOwnProperty('curDifficulty')
        })
        if (bol) {
          this.$message({
            type: 'warning',
            message: '请设置题目难度'
          })
          return false
        }
      }
      let hasFillAnswer = true
      this.praxis.questions.forEach(q => {
        if (q.type === '12' && q.options) {
          hasFillAnswer = q.options.some(o => {
            return !o.content
          })
        } else {
          hasFillAnswer = false
        }
      })
      if (hasFillAnswer) {
        this.$message({
          type: 'warning',
          message: '填空题答案不能为空'
        })
        return false
      }

      this.addMessage({
        type: '1047',
        groupId: this.groupId,
        msgType: 'create',
        msgJson: JSON.stringify({ title: this.praxis.name, questions: this.getQuestions(), extension: obj.type === 2 ? 'mix' : void 0 }),
        title: this.praxis.name,
        ...this.constructionMessage()
      }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.clearPraxis()
        this.routeBack()
      })
    },
    getContentImgs(content) {
      let imgReg = /<img.*?(?:>|\/>)/gi
      return content.match(imgReg)
    },
    convertContent(content) {
      // let attrReg = /data-src=[\'\"]?([^\'\"]*)[\'\"]?/i
      return content.replace(/<img(?:.|\s)*?>/gi, '【图片】')
    },
    recoverContent(imgs, content) {
      if (Check.isRealArray(imgs)) {
        imgs.forEach(img => {
          content = content.replace('【图片】', img)
        })
      }
      return content
    },
    importPraxis() {
      const that = this
      that.$import({
        title: '导入习题',
        uploadURI: this.uploadURL,
        templateUrl: '/static/templates/praxisTemplate.doc',
        callback(res, file) {
          Api.importPraxis(res.file.id, '1047').then(res => {
            let questions = []
            if (that.praxis.questions.length > 0) {
              questions = [...that.praxis.questions, ...res.praxis.questions]
            } else {
              questions = res.praxis.questions
            }
            if (Check.isRealArray(questions)) {
              questions = questions.map(q => {
                q.ops = []
                if (!Check.isNullString(q.content.trim())) {
                  q[`content_imgs`] = that.getContentImgs(q.content)
                  // that.convertContent(q.content)
                } else {
                  q.content = ''
                }
                if (!Check.isNullString(q.explain.trim())) {
                  q['explain_imgs'] = that.getContentImgs(q.explain)
                } else {
                  q.explain = ''
                }
                if ((q.type === '6' || q.type === '7') && q.options) {
                  q.options = q.options.map(o => {
                    if (!Check.isNullString(o.content)) {
                      o[`content_imgs`] = that.getContentImgs(o.content)
                    } else {
                      o.content = ''
                    }
                    return o
                  })
                } else if (q.type === '12' && q.options) {
                  q.options = q.options.map(o => {
                    o.content = o.content || ''
                    return o
                  })
                }
                return q
              })
            }
            if (Check.isNullString(that.praxis.name)) {
              that.$set(that.praxis, 'name', res.praxis.title || '')
            }
            that.$set(that.praxis, 'questions', questions)
          })
        }
      })
    },
    cetegoryChange(i) {
      this.savePraxis({
        ...this.praxis,
        isHasCache: true
      })
      this.routePush({
        name: 'praxisCatalogues1047',
        query: {
          index: Check.isNumber(i) ? i + 1 : void 0
        }
      })
    },
    difficultChange(difficul) {
      if (difficul.hasOwnProperty('index')) {
        this.$set(this.praxis.questions[difficul.index], 'curDifficulty', difficul.type)
      } else {
        this.praxis.curDifficulty = difficul
      }
    },
    back() {
      const that = this
      that
        .$confirm('是否取消当前的操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.clearPraxis()
          that.routeBack()
        })
        .catch(() => {})
    },
    handleDraft(item) {
      if (item.value === '1') {
        if (Check.isNullString(this.praxis.name)) {
          this.$message({ type: 'warning', message: '习题名称不能为空' })
          return false
        }

        let m = this.constructionMessage({
          type: '1047',
          groupId: this.groupId,
          msgType: 'create',
          msgJson: JSON.stringify({
            title: this.praxis.name,
            questions: this.getQuestions()
          }),
          title: this.praxis.name,
          status: 'u'
        })

        MessageApi.addMessage(m).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
        })
      } else {
        this.routePush({ name: 'draftList1047' })
      }
    },
    addQuestion() {
      this.praxis.questions.push({
        content: '',
        explain: '',
        type: '8',
        isCreate: true
      })
    }
  }
}
</script>
<style lang="scss">
  @import '~scss/mixin';

  .submit-type {
    .btn {
      margin-left: rem(10);
      padding: 0;
      color: #fff;
      cursor: pointer;
    }
  }

  .batch-setting-bar {
    position: relative;
    padding: 0 rem(10);
    margin: 0;
    min-height: rem(45);
    border-bottom: $border;
    @include flex;
    @include ai;

    .setting-list {
      @include flex;
      margin-top: rem(2);

      .btn {
        position: relative;
        padding: rem(5) rem(20);
        margin-right: rem(16);
        text-align: center;
        background-color: #f7f8fa;
        cursor: pointer;

        &:after {
          content: '';
          width: 15px;
          height: 29px;
          position: absolute;
          right: 0;
          top: 0;
          background-image: url($icon-url);
          background-position: rem(-400) rem(-32);
        }

        &:hover {
          background-color: #ccc;
        }
      }
    }

    .delete-btn {
      position: absolute;
      right: rem(10);
      @include fc;
      cursor: pointer;
    }
  }

  .add-praxis-btn {
    height: rem(40);
    line-height: rem(40);
    text-align: center;
    @include fc;
    cursor: pointer;
    background-color: #f8f8f8;

    &:hover {
      background-color: #ededed;
    }
  }
</style>
