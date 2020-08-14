<template>
  <div class="questios-list"
       v-if="praxis&&praxis.questions.length&&isShowPraxis">
    <div class="category-title"></div>
    <div class="question"
         v-for="(question, q) in praxis.questions"
         :key="q">
      <div class="batch-setting-bar">
        <div class="setting-list">
          <template v-if="question.isCreate">
            <el-dropdown class="drop-down"
                         trigger="click"
                         @command="praxisTypeChange">
              <div class="btn">
                {{praxis.questions[q].curPraxisType ? praxis.questions[q].curPraxisType : '解答题'}}
              </div>
              <el-dropdown-menu class="drop-menu"
                                slot="dropdown">
                <el-dropdown-item class="menu-item"
                                  v-for="(item, i) in xlPraxisType"
                                  :key="i"
                                  :command="{obj: item, index: q, isCompost: false}">
                  {{item.value}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <div v-else
               class="btn">{{getPraxiStyle(question.type)}}</div>
          <div class="btn"
               v-if='isCourse&&!praxis.isBatch&&!praxis.isReading'
               @click="cetegoryChange(q)">
            {{praxis.questions[q].curCategory ? praxis.questions[q].curCategory.name : '目录'}}
          </div>
          <el-dropdown class="drop-down"
                       trigger="click"
                       @command="difficultChange"
                       v-if="!praxis.isReading&&!praxis.isBatch">
            <div class="btn"
                 v-if="praxis.curDifficulty">
              {{praxis.questions[q].curDifficulty ? praxis.questions[q].curDifficulty.name : '难度'}}
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <template v-if="praxis.difficulty.length>0">
                <el-dropdown-item class="menu-item"
                                  v-for="(item, i) in praxis.difficulty"
                                  :key="i"
                                  :command="{type: item, index: q}">
                  {{item.name}}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="drop-down"
                       trigger="click"
                       @command="selectDirection"
                       v-if="praxis.questions[q].type==='13'">
            <div class="btn">
              {{praxis.questions[q].curDirection ? praxis.questions[q].curDirection.text : '方向'}}
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <el-dropdown-item class="menu-item"
                                v-for="(item, i) in [{text:'竖向', value:'1'},{text:'横向',value:'2'}]"
                                :key="i"
                                :command="{value: item, index: q}">
                {{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="drop-down"
                       trigger="click"
                       @command="slelectSpaceCount"
                       v-if="praxis.questions[q].type==='13'">
            <div class="btn">
              {{praxis.questions[q].curSpaceCount ? praxis.questions[q].curSpaceCount : '数量'}}
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <el-dropdown-item class="menu-item"
                                v-for="item in 7"
                                :key="item"
                                :command="{value: item, index: q}">
                {{item}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <div class="delete-btn"
             @click="praxis.questions.splice(q, 1)">删除</div> -->
        <div class="delete-btn"
             @click="handleDelete(q)">删除</div>
      </div>
      <p>
        <EditorPraxis v-model="question.content"
                      property="content"
                      :store.sync="question"
                      style="padding:0;"
                      placeholder="题干内容" />
        <!-- <TextInput v-model="question.content"
                   placeholder="题干内容" /> -->
      </p>
      <div class="question-options"
           v-if="question.options">
        <template v-if="question.type==='12'">
          <!-- 填空题 -->
          <div class="btn-flex">
            <p style="color:#999;">答案</p>
            <p style="color:#00C162;cursor:pointer;"
               @click="question.options.push({content: '',isCorrent: 1})">添加选项</p>
          </div>
          <div class="set-answer">
            <item v-for="(option, o) in question.options"
                  :key="o"
                  :hasClick="false">
              <div>第{{o+1}}空</div>
              <input type="text"
                     placeholder="请设置答案(必填)"
                     v-model="option.content"
                     slot="remark">
              <i class="ico ico-delete"
                 slot="after"
                 v-if="o>0"
                 @click="question.options.splice(o, 1)"></i>
            </item>
          </div>
        </template>
        <template v-else-if="question.type==='13'">
          <!-- 图片排序 -->
          <el-upload class="pic-upload"
                     v-if="!question.medias"
                     :action="imageUploadUrl(q)"
                     :data="{direction:question.curDirection,splitCount:question.curSpaceCount}"
                     :show-file-list="false"
                     accept="image/png, image/jpeg,.gif"
                     :before-upload="(file)=>{return onPhotoBefore(file,q)}"
                     :on-success="(res, file)=>{return onSuccess(res,file,q)}"
                     :on-error="onError"
                     :on-exceed="onExceed">
            <div class="btn-flex">
              <p style="color:#999;">点击添加图片</p>
            </div>
          </el-upload>
          <img v-lazy="{src:url(question.medias[0].fileId)}"
               v-if="question.medias"
               style="width: 100%;" />
        </template>
        <template v-else-if="question.type==='14'">
          <!-- 判断题 -->
          <div class="set-answer">
            <div>
              答案：
              <span @click="setAnswerHandle(q)">{{getRightAnswer(question)}}
                <i class="ico ico-right"></i>
              </span>
            </div>
          </div>
        </template>
        <template v-else-if="question.type==='15'">
          <!-- 综合题 -->
          <div class="questios-list"
               v-if="question.questions.length>0"
               style="border:1px solid #ededed;">
            <div class="question"
                 v-for="(subQuestion, s) in question.questions"
                 :key="s">
              <div class="batch-setting-bar">
                <div class="setting-list">
                  <template v-if="subQuestion.isCreate">
                    <el-dropdown class="drop-down"
                                 trigger="click"
                                 @command="praxisTypeChange">
                      <div class="btn">
                        {{question.questions[s].curPraxisType ? question.questions[s].curPraxisType : '解答题'}}
                      </div>
                      <el-dropdown-menu class="drop-menu"
                                        slot="dropdown">
                        <el-dropdown-item class="menu-item"
                                          v-for="(item, i) in xlPraxisType.filter(v=>{return v.type!=='15'})"
                                          :key="i"
                                          :command="{obj: item, index: s, isCompost: true, parent: question.questions}">
                          {{item.value}}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                  <el-dropdown class="drop-down"
                               trigger="click"
                               @command="selectDirection"
                               v-if="question.questions[s].type==='13'">
                    <div class="btn">
                      {{question.questions[s].curDirection ? question.questions[s].curDirection.text : '方向'}}
                    </div>
                    <el-dropdown-menu class="drop-menu"
                                      slot="dropdown">
                      <el-dropdown-item class="menu-item"
                                        v-for="(item, i) in [{text:'竖向', value:'1'},{text:'横向',value:'2'}]"
                                        :key="i"
                                        :command="{value: item, index: s}">
                        {{item.text}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dropdown class="drop-down"
                               trigger="click"
                               @command="slelectSpaceCount"
                               v-if="question.questions[s].type==='13'">
                    <div class="btn">
                      {{question.questions[s].curSpaceCount ? question.questions[s].curSpaceCount : '数量'}}
                    </div>
                    <el-dropdown-menu class="drop-menu"
                                      slot="dropdown">
                      <el-dropdown-item class="menu-item"
                                        v-for="item in 7"
                                        :key="item"
                                        :command="{value: item, index: s}">
                        {{item}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <!-- <div class="delete-btn"
                     @click="question.questions.splice(s, 1)">删除</div> -->
                <div class="delete-btn"
                     @click="handleDeleteQuestions(q, s)">删除</div>
              </div>
              <p>
                <EditorPraxis v-model="subQuestion.content"
                              property="content"
                              :store.sync="subQuestion"
                              style="padding:0;"
                              placeholder="题干内容" />
                <!-- <TextInput v-model="subQuestion.content"
                           placeholder="题干内容" /> -->
              </p>
              <div class="question-options"
                   v-if="subQuestion.options">
                <template v-if="subQuestion.type==='12'">
                  <!-- 填空题 -->
                  <div class="btn-flex">
                    <p style="color:#999;">答案</p>
                    <p style="color:#00C162;cursor:pointer;"
                       @click="subQuestion.options.push({content: '',isCorrent: 1})">添加选项</p>
                  </div>
                  <div class="set-answer">
                    <item v-for="(option, o) in subQuestion.options"
                          :key="o"
                          :hasClick="false">
                      <div>第{{o+1}}空</div>
                      <input type="text"
                             placeholder="请设置答案(必填)"
                             v-model="option.content"
                             slot="remark">
                      <i class="ico ico-delete"
                         slot="after"
                         v-if="o>0"
                         @click="subQuestion.options.splice(o, 1)"></i>
                    </item>
                  </div>
                </template>
                <template v-else-if="subQuestion.type==='13'">
                  <!-- 图片排序 -->
                  <el-upload class="pic-upload"
                             v-if="!subQuestion.medias"
                             :action="imageUploadUrl(s)"
                             :data="{direction:subQuestion.curDirection,splitCount:subQuestion.curSpaceCount}"
                             :show-file-list="false"
                             accept="image/png, image/jpeg,.gif"
                             :before-upload="(file)=>{return onPhotoBefore(file,s)}"
                             :on-success="(res, file)=>{return onSuccess(res,file,s)}"
                             :on-error="onError"
                             :on-exceed="onExceed">
                    <div class="btn-flex">
                      <p style="color:#999;">点击添加图片</p>
                    </div>
                  </el-upload>
                  <img v-lazy="{src:url(subQuestion.medias[0].fileId)}"
                       v-if="subQuestion.medias"
                       style="width: 100%;" />
                </template>
                <template v-else-if="subQuestion.type==='14'">
                  <!-- 判断题 -->
                  <div class="set-answer">
                    <div>
                      答案：
                      <span @click="setAnswerHandle(q, s)">
                        {{getRightAnswer(subQuestion)}}
                        <i class="ico ico-right"></i>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else-if="subQuestion.type==='16'">
                  <!-- 连线题 -->
                  <div class="btn-flex">
                    <p style="color: #999;">选项</p>
                    <p style="color:#00C162;cursor:pointer;"
                       @click="addMatchingItem(subQuestion)">添加选项</p>
                  </div>
                  <template v-if="subQuestion.options.length>0">
                    <div class="matching-item"
                         v-for="(arr, a) in subQuestion.options"
                         :key="a">
                      <div style="display:flex;justify-content:space-between;">
                        <p>连线{{a+1}}</p>
                        <p style="color:#00C162;cursor:pointer;"
                           @click="subQuestion.options.splice(a, 1)"
                           v-if="a>1">删除</p>
                      </div>
                      <template v-if="arr.length>0">
                        <div v-for="(option, o) in arr"
                             :key="o">
                          <span>{{o===0?'左选项':'右选项'}}</span>
                          <input type="text"
                                 placeholder="选项内容"
                                 v-model="option.content">
                        </div>
                      </template>
                    </div>
                  </template>
                </template>
                <template v-else-if="subQuestion.type==='17'">
                  <!-- 文字排序 -->
                  <div class="btn-flex">
                    <p style="color: #999;">选项</p>
                    <p style="color:#00C162;cursor:pointer;"
                       @click="subQuestion.options.push({content: '', sort: subQuestion.options.length + 1})">添加选项</p>
                  </div>
                  <div class="set-answer">
                    <item v-for="(option, o) in subQuestion.options"
                          :key="o"
                          :hasClick="false">
                      <div>选项{{o+1}}</div>
                      <input type="text"
                             placeholder="请输入选项内容(必填)"
                             v-model="subQuestion.content"
                             slot="remark">
                      <i class="ico ico-delete"
                         slot="after"
                         v-if="o>0"
                         @click="subQuestion.options.splice(o, 1)"></i>
                    </item>
                  </div>
                </template>
                <template v-else>
                  <!-- 单选、多选 -->
                  <div class="btn-flex">
                    <p style="color: #999;">选项</p>
                    <p style="color:#00C162;cursor:pointer;"
                       @click="subQuestion.options.push({content: '请输入选项内容（必填）', selected: false})">添加选项</p>
                  </div>
                  <div v-for="(option, o) in subQuestion.options"
                       :key="o">
                    <item @click="$set(option, 'showEditor', !option.showEditor)">
                      <div slot="before">{{getSerial(o)}}.</div>
                      <div class="option-content"
                           v-html="option.content"></div>
                      <i class="ico ico-delete"
                         v-if="o>0"
                         slot="after"
                         @click.stop="subQuestion.options.splice(o, 1)"></i>
                      <span v-else
                            slot="after"></span>
                    </item>
                    <EditorPraxis v-if="option.showEditor"
                                  property="content"
                                  v-model="option.content"
                                  :store.sync="subQuestion.options[o]"
                                  style="padding:0;"
                                  placeholder="请输入选项内容（必填）" />
                  </div>
                  <div class="set-answer"
                       style="margin-top:10px;">
                    <div>
                      答案：
                      <span @click="setAnswerHandle(q, s)">
                        {{getRightAnswer(subQuestion)}}
                        <i class="ico ico-right"></i>
                      </span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="question-analy"
                   @click="$set(subQuestion, 'showEditor', !subQuestion.showEditor)">
                解析：
                <div class="analy-show"
                     v-html="subQuestion.explain ? subQuestion.explain : '请输入解析内容'"></div>
              </div>
              <EditorPraxis ref="_editor"
                            v-if="subQuestion.showEditor"
                            property="explain"
                            v-model="subQuestion.explain"
                            :store.sync="question.questions[s]" />
              <div v-if="s<question.questions.length-1"
                   class="category-title"></div>
            </div>
            <div slot="bottom"
                 class="add-praxis-btn"
                 @click="addQuestion(question.questions)">添加小题</div>
          </div>
        </template>
        <template v-else-if="question.type==='16'">
          <!-- 连线题 -->
          <div class="btn-flex">
            <p style="color: #999;">选项</p>
            <p style="color:#00C162;cursor:pointer;"
               @click="addMatchingItem(question)">添加选项</p>
          </div>
          <template v-if="question.options.length>0">
            <div class="matching-item"
                 v-for="(arr, a) in question.options"
                 :key="a">
              <div style="display:flex;justify-content:space-between;">
                <p>连线{{a+1}}</p>
                <p style="color:#00C162;cursor:pointer;"
                   @click="question.options.splice(a, 1)"
                   v-if="a>1">删除</p>
              </div>
              <template v-if="arr.length>0">
                <div v-for="(option, o) in arr"
                     :key="o">
                  <span>{{o===0?'左选项':'右选项'}}</span>
                  <input type="text"
                         placeholder="选项内容"
                         v-model="option.content">
                </div>
              </template>
            </div>
          </template>
        </template>
        <template v-else-if="question.type==='17'">
          <!-- 文字排序 -->
          <div class="btn-flex">
            <p style="color: #999;">选项</p>
            <p style="color:#00C162;cursor:pointer;"
               @click="question.options.push({content: '', sort: question.options.length + 1})">添加选项</p>
          </div>
          <div class="set-answer">
            <item v-for="(option, o) in question.options"
                  :key="o"
                  :hasClick="false">
              <div>选项{{o+1}}</div>
              <input type="text"
                     placeholder="请输入选项内容(必填)"
                     v-model="option.content"
                     slot="remark">
              <i class="ico ico-delete"
                 slot="after"
                 v-if="o>0"
                 @click="question.options.splice(o, 1)"></i>
            </item>
          </div>
        </template>
        <template v-else>
          <!-- 单选、多选 -->
          <div class="btn-flex">
            <p style="color: #999;">选项</p>
            <p style="color:#00C162;cursor:pointer;"
               @click="question.options.push({content: '请输入选项内容（必填）', selected: false})">添加选项</p>
          </div>
          <div v-for="(option, o) in question.options"
               :key="o">
            <item @click="$set(option, 'showEditor', !option.showEditor)">
              <div slot="before">{{getSerial(o)}}.</div>
              <div class="option-content"
                   v-html="option.content"></div>
              <i class="ico ico-delete"
                 v-if="o>0"
                 slot="after"
                 @click.stop="question.options.splice(o, 1)"></i>
              <span v-else
                    slot="after"></span>
            </item>
            <EditorPraxis v-if="option.showEditor"
                          property="content"
                          v-model="option.content"
                          :store.sync="question.options[o]"
                          style="padding:0;"
                          placeholder="请输入选项内容（必填）" />
          </div>
          <div class="set-answer"
               style="margin-top:10px;">
            <div>
              答案：
              <span @click="setAnswerHandle(q)">{{getRightAnswer(question)}}
                <i class="ico ico-right"></i>
              </span>
            </div>
          </div>
        </template>
      </div>
      <div class="question-analy"
           @click="$set(question, 'showEditor', !question.showEditor)"
           v-if="question.type !== '15'">
        解析：
        <div class="analy-show"
             v-html="question.explain ? question.explain : '请输入解析内容'"></div>
      </div>
      <EditorPraxis ref="_editor"
                    v-if="question.showEditor"
                    property="explain"
                    v-model="question.explain"
                    :store.sync="praxis.questions[q]" />
      <div v-if="q<praxis.questions.length-1"
           class="category-title"></div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import G from '@/views/group/mixin'
import Check from '@/utils/check'
export default {
  mixins: [G],
  props: {
    praxis: {
      type: Object,
      default: null
    },
    appType: {
      type: String,
      default: ''
    }
  },
  components: {
    EditorPraxis: resolve => require(['@/components/editor/EditorPraxis'], resolve)
  },
  data() {
    return {
      isShowPraxis: false,
      xlPraxisType: [
        {
          value: '单选题',
          type: '6',
          question: {
            content: '',
            explain: '',
            options: [
              {
                content: '请输入选项内容（必填）',
                selected: true
              }
            ],
            type: '6',
            isCreate: true
          }
        },
        {
          value: '多选题',
          type: '7',
          question: {
            content: '',
            explain: '',
            options: [
              {
                content: '请输入选项内容（必填）',
                selected: true
              }
            ],
            type: '7',
            isCreate: true
          }
        },
        {
          value: '填空题',
          type: '12',
          question: {
            content: '',
            explain: '',
            options: [
              {
                content: '',
                isCorrent: 1,
                selected: false
              }
            ],
            type: '12',
            isCreate: true
          }
        },
        {
          value: '解答题',
          type: '8',
          question: {
            content: '',
            explain: '',
            type: '8',
            isCreate: true
          }
        },
        {
          value: '判断题',
          type: '14',
          question: {
            content: '',
            explain: '',
            options: [
              {
                content: '正确',
                selected: true
              },
              {
                content: '错误',
                selected: false
              }
            ],
            type: '14',
            isCreate: true
          }
        },
        {
          value: '综合题',
          type: '15',
          question: {
            content: '',
            explain: '',
            type: '15',
            options: [],
            questions: [
              {
                explain: '',
                title: '',
                type: 8,
                isCreate: true
              }
            ],
            isCreate: true
          }
        },
        {
          value: '连线题',
          type: '16',
          question: {
            content: '',
            explain: '',
            options: [
              [
                {
                  content: '',
                  serialNumber: 'A',
                  sort: 1
                },
                {
                  content: '',
                  serialNumber: 'A',
                  sort: 2
                }
              ],
              [
                {
                  content: '',
                  serialNumber: 'B',
                  sort: 1
                },
                {
                  content: '',
                  serialNumber: 'B',
                  sort: 2
                }
              ]
            ],
            type: '16',
            isCreate: true
          }
        },
        {
          value: '文字排序题',
          type: '17',
          question: {
            content: '',
            explain: '',
            type: '17',
            options: [
              {
                content: '',
                sort: 1
              }
            ],
            isCreate: true
          }
        },
        {
          value: '图片排序题',
          type: '13',
          question: {
            content: '',
            explain: '',
            options: [],
            // curDirection: { text: '竖向', value: '1' },
            // curSpaceCount: 2,
            type: '13',
            isCreate: true
          }
        }
      ],
      loading: null
    }
  },
  created() {
    this.isShowPraxis = true
  },
  methods: {
    // 删除一级的一道题
    handleDelete(q) {
      this.isShowPraxis = false
      this.praxis.questions.splice(q, 1)
      const that = this
      setTimeout(function() {
        that.isShowPraxis = true
      }, 10)
    },
    // 删除综合题的二级小题
    handleDeleteQuestions(q, s) {
      this.isShowPraxis = false
      this.praxis.questions[q].questions.splice(s, 1)
      const that = this
      setTimeout(function() {
        that.isShowPraxis = true
      }, 10)
    },
    // old
    ...mapActions(['savePraxis', 'saveReading']),
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
    praxisTypeChange(praxisType) {
      // isCompost true ---> 综合题
      var questions = JSON.parse(JSON.stringify(praxisType.obj.question))
      if (praxisType.isCompost) {
        praxisType.parent.splice(praxisType.index, 1, questions)
        this.$set(praxisType.parent[praxisType.index], 'curPraxisType', this.getPraxiStyle(praxisType.obj.type))
      } else {
        this.praxis.questions.splice(praxisType.index, 1, questions)
        this.$set(this.praxis.questions[praxisType.index], 'curPraxisType', this.getPraxiStyle(praxisType.obj.type))
      }
    },
    getPraxiStyle(type) {
      switch (type) {
        case '6':
          return '单选题'
        case '7':
          return '多选题'
        case '8':
          return '解答题'
        case '9':
          return '填空题'
        case '12':
          return '填空题'
        case '13':
          return '图片排序题'
        case '14':
          return '判断题'
        case '15':
          return '综合题'
        case '16':
          return '连线题'
        case '17':
          return '文字排序题'
      }
    },
    getSerial(i) {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i)
    },
    setAnswerHandle(i, k) {
      if (this.appType === '1047') {
        this.savePraxis({
          ...this.praxis,
          isHasCache: true
        })
      } else {
        this.saveReading({
          ...this.praxis,
          isHasCache: true
        })
      }
      this.routePush({
        name: 'modifyAnswer1047',
        query: {
          index: i,
          subIndex: k,
          appType: this.appType
        }
      })
    },
    getRightAnswer(question) {
      if (question.type === '14') {
        return (
          question.options.filter(o => {
            return o.selected
          })[0].content || '正确'
        )
      } else {
        let serails = []
        question.options.forEach((option, o) => {
          option.selected && serails.push(this.getSerial(o))
        })
        return serails.join(',') || 'A'
      }
    },
    addQuestion(obj) {
      if (obj) {
        obj.push({
          content: '',
          explain: '',
          type: '8',
          isCreate: true
        })
      } else {
        this.praxis.questions.push({
          content: '',
          explain: '',
          type: '8',
          isCreate: true
        })
      }
    },
    addMatchingItem(question) {
      question.options.push([
        {
          content: '',
          serialNumber: this.getSerial(question.options.length),
          sort: 1
        },
        {
          content: '',
          serialNumber: this.getSerial(question.options.length),
          sort: 2
        }
      ])
    },
    slelectSpaceCount(countObj) {
      this.$set(this.praxis.questions[countObj.index], 'curSpaceCount', countObj.value)
    },
    selectDirection(direction) {
      this.$set(this.praxis.questions[direction.index], 'curDirection', direction.value)
    },
    onPhotoBefore(file, index) {
      if (!this.praxis.questions[index].curDirection) {
        this.$message({ type: 'warning', message: '先选择图片方向' })
        return false
      }
      if (!this.praxis.questions[index].curSpaceCount) {
        this.$message({ type: 'warning', message: '先选择排序数量' })
        return false
      }
      this.loading = this.$loading({ target: this.$el })
    },
    onSuccess(res, file, index) {
      this.$set(this.praxis.questions[index], 'medias', [
        {
          fileId: res.file.drawId,
          fileName: res.file.name,
          remark: res.file.remark,
          size: res.file.size,
          type: 'photo'
        }
      ])
      this.loading && this.loading.close()
    },
    onExceed() {
      this.$message({ type: 'warning', message: '上传文件格式不正确' })
    },
    onError() {},
    imageUploadUrl(q) {
      let direction = this.praxis.questions[q].curDirection ? this.praxis.questions[q].curDirection.value : 1
      let splitCount = this.praxis.questions[q].curSpaceCount ? this.praxis.questions[q].curSpaceCount : 2
      return `${this.uploadURL}?direction=${direction}&splitCount=${splitCount}`
    }
  }
}
</script>
<style lang="scss">
  @import '~scss/mixin';
  .questios-list {
    .question {
      &-title,
      &-options {
        margin-top: rem(10);
        padding: 0 rem(10);
        .set-answer {
          color: #999; // padding: 0 rem(10);
          span {
            display: inline-block;
            padding: rem(5) rem(10);
            text-align: center;
            background-color: #f7f8fa;
            cursor: pointer;
          }
        }
        .matching-item {
          margin-top: rem(10);
          border: $border;
          color: #999;
          & > div {
            padding: rem(10);
            border-bottom: $border;
            &:last-child {
              border-bottom: none;
            }
          }
          input {
            margin-left: rem(5);
            width: rem(500);
            display: inline-block;
            border: none;
          }
        }
      }
      &-analy {
        @include flex;
        flex-wrap: wrap;
        padding: rem(10);
        color: #999;
        .analy-show {
          p {
            img {
              display: inline-block !important;
            }
          }
        }
      }
      .btn-flex {
        @include flex;
        @include jc(space-between);
      }
      .option-content {
        padding: rem(5) 0 rem(5) rem(10) !important;
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
        color: #00c162;
        cursor: pointer;
      }
    }
  }
</style>
