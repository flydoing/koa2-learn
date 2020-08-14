<template>
  <page :title="title"
        :hasSubmit="!editBol"
        @submit="handleSubmit">
    <div slot="main">
      <!-- 单选题 -->
      <template v-if="praxiType==='1'">
        <keep-alive>
          <SimpleEditor placeholder="题目内容"
                        :toolbars="['photo', 'file']"
                        :store.sync="praxisContent" />
        </keep-alive>
        <div v-for="(t, i) in defaultOptions"
             :key="i">
          <div class="category-title"></div>
          <keep-alive>
            <SimpleEditor :toolbars="['photo', 'file']"
                          :placeholder="t.placeholder"
                          :store.sync="defaultOptions[i]" />
          </keep-alive>
        </div>
        <item @click="addTextArea">
          <div slot="before"><i class="ico ico-plus"></i></div>
          <div>添加选项</div>
        </item>
      </template>
      <!-- 多选 -->
      <template v-else-if="praxiType==='2'">
        <keep-alive>
          <SimpleEditor placeholder="题目内容"
                        :toolbars="['photo', 'file']"
                        :store.sync="praxisContent" />
        </keep-alive>
        <div v-for="(t, i) in defaultOptions"
             :key="i">
          <div class="category-title"></div>
          <keep-alive>
            <SimpleEditor :toolbars="['photo', 'file']"
                          :placeholder="t.placeholder"
                          :store.sync="defaultOptions[i]" />
          </keep-alive>
        </div>
        <item @click="addTextArea">
          <div slot="before"><i class="ico ico-plus"></i></div>
          <div>添加选项</div>
        </item>
      </template>
      <!-- 长文本 -->
      <template v-else-if="praxiType==='3'">
        <keep-alive>
          <SimpleEditor placeholder="题目内容"
                        :toolbars="['photo', 'file']"
                        :store.sync="praxisContent" />
        </keep-alive>
      </template>
      <!-- 短文本 -->
      <template v-else-if="praxiType==='11'">
        <keep-alive>
          <SimpleEditor placeholder="题目内容（短文本20字以内）"
                        :toolbars="['photo', 'file']"
                        :store.sync="praxisContent" />
        </keep-alive>
      </template>
      <!-- <div class="commin-btn" v-if="!editBol">
        <button @click="handleSubmit">添加题目</button>
      </div> -->
      <div v-if="editBol"
           class="commin-btn">
        <button @click="handleSubmit">重新添加</button>
        <button @click="handleDeletPriaxi">删除题目</button>
      </div>
    </div>
  </page>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    components: {
      SimpleEditor: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        title: '',
        praxiType: this.routeQuery('type'),
        defaultOptions: this.routeQuery('isEdit')
          ? this.routeQuery('praxisData').arr
          : [
              {
                placeholder: '选项1',
                content: '',
                medias: []
              },
              {
                placeholder: '选项2',
                content: '',
                medias: []
              },
              {
                placeholder: '选项3',
                content: '',
                medias: []
              }
            ],
        editBol: this.routeQuery('isEdit'),
        praxisContent: {
          content: this.routeQuery('isEdit') ? this.routeQuery('praxisData').title : '',
          medias: []
        },
        cacheDatas: this.routeQuery('isEdit') ? this.routeQuery('praxisData') : {},
        curAllPraxis: []
      }
    },
    computed: {
      ...mapGetters({
        question: 'getQuestion'
      })
    },
    created() {
      this.curAllPraxis = [...this.question.enrollTable.questionnaire.questions]
      switch (this.praxiType) {
        case '1':
          this.title = '单选题'
          break
        case '2':
          this.title = '多选题'
          break
        case '3':
          this.title = '长文本'
          break
        case '11':
          this.title = '短文本'
          break
      }
    },
    methods: {
      ...mapActions(['saveQuestion']),
      addTextArea(index) {
        // 单选或多选
        this.defaultOptions.push({
          placeholder: '选项' + (this.defaultOptions.length + 1),
          content: '',
          medias: []
        })
      },
      handleSubmit() {
        if (this.praxiType === '11' && this.praxisContent.content.length > 20) {
          this.$message({ type: 'warning', message: '短文本字数不能超过20字' })
          return false
        }
        let options = []
        if (this.praxiType === '1' || this.praxiType === '2') {
          this.defaultOptions.forEach(option => {
            if (option.content !== '' || option.medias.length > 0) {
              options.push({
                content: option.content,
                medias: option.medias
              })
            }
          })
        } else {
          options.push({
            content: ''
          })
        }
        let question = {
          title: this.praxisContent.content,
          type: this.praxiType,
          options: options,
          medias: this.praxisContent.medias.length > 0 ? this.praxisContent.medias : []
        }
        if (!this.routeQuery('isEdit')) {
          // 新建
          this.curAllPraxis.push(question)
          this.saveQuestion({
            enrollTable: {
              ...this.question.enrollTable,
              questionnaire: {
                questions: this.curAllPraxis
              }
            }
          })
        } else {
          this.curAllPraxis.splice(this.routeQuery('praxisNum'), 1, question)
          this.saveQuestion({
            enrollTable: {
              ...this.question.enrollTable,
              questionnaire: {
                questions: this.curAllPraxis
              }
            }
          })
        }
        this.routeBack()
      },
      handleDeletPriaxi() {
        this.curAllPraxis.splice(this.routeQuery('praxisNum'), 1)
        this.saveQuestion({
          enrollTable: {
            ...this.question.enrollTable,
            questionnaire: {
              questions: this.curAllPraxis
            }
          }
        })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  textarea {
    display: block !important;
    width: 100%;
    padding: rem(10);
    font-family: '微软雅黑';
  }

  .commin-btn {
    @include flex;
    button {
      display: block;
      width: rem(250);
      height: rem(40);
      margin: rem(30) auto;
      line-height: rem(40);
      @include bch;
      font-size: rem(14);
      color: nth($font-color, 4);
      border-radius: rem(3);
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        @include bc;
      }
    }
  }
</style>
