<template>
  <page :title="title"
        @submit="handleSubmit"
        hasSubmit>
    <div class="question-edit">
      <keep-alive>
        <template v-if="question.type!='6'">
          <EditorSimple placeholder="标题"
                        :store.sync="question"
                        :toolbars="['photo', 'file']" />
        </template>
        <template v-else>
          <EditorSimple placeholder="标题"
                        :store.sync="question"
                        :toolbars="[]" />
        </template>
      </keep-alive>
      <template v-if="question.type=='1' || question.type=='2'">
        <div v-for="(item,i) in question.options"
             :key="i">
          <div class="category-title"></div>
          <keep-alive>
            <EditorSimple placeholder="选项内容"
                          :store.sync="question.options[i]"
                          :toolbars="['photo', 'file']" />
          </keep-alive>
        </div>
        <item @click="handleAddOption"
              :hasArrow="false">
          <div slot="before">
            <i class='ico ico-plus' />
          </div>
          <div slot="main">添加选项</div>
        </item>
      </template>
      <template v-if="question.type=='4'">
        <div class="category-title"></div>
        <div v-for="(item,i) in question.options"
             :key="i">
          <item :hasClick="false">
            <div slot="main">数字范围</div>
            <div slot="remark">
              <input placeholder="起始值"
                     class="min-input"
                     v-model="item.startValue" />至
              <input placeholder="结束值"
                     class="min-input"
                     v-model="item.endValue" />
            </div>
          </item>
          <item :hasClick="false">
            <div slot="main">单位</div>
            <input slot="remark"
                   placeholder="必填"
                   v-model="item.unit" />
          </item>
        </div>
      </template>
      <template v-if="question.type=='5'">
        <div v-for="(item,i) in question.options"
             :key="i">
          <el-dropdown class="block-element"
                       trigger="click"
                       @command="handleScore">
            <div class="el-dropdown-link">
              <item>
                <div slot="main">最高分</div>
                <div slot="remark"
                     v-html="item.startValue"></div>
              </item>
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <el-dropdown-item class="menu-item"
                                v-for="(score,i) in scores"
                                :key="i"
                                :command="score">{{score}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <div v-if="question.status === '1' || question.id"
           class="button button-common"
           @click="handleRemove">删除题目</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        question: {
          content: '',
          options: [],
          medias: []
        },
        scores: [2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    },
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    created() {
      this.fetchData()
    },
    computed: {
      title() {
        if (this.question.id) {
          return `编辑题目`
        }
        let type = this.question.type
        if (type === '1') {
          return '新建单选题'
        }
        if (type === '2') {
          return '新建多选题'
        }
        if (type === '3') {
          return '新建问答题'
        }
        if (type === '4') {
          return '新建统计题'
        }
        if (type === '5') {
          return '新建评分题'
        }
        if (type === '6') {
          return '新建定位题'
        }
        return ''
      }
    },
    methods: {
      fetchData() {
        const that = this
        let question = that.getStorage('_question_edit_cache')
        if (question) {
          let qt = JSON.parse(JSON.stringify(question))
          qt.content = qt.title
          let len = qt.options ? qt.options.length : 0
          if ((qt.type === '1' || qt.type === '2') && len < 3 && len > 0) {
            for (let i = 3 - len; i > 0; i--) {
              qt.options.push({ content: '', medias: [] })
            }
          }
          that.question = qt
        } else {
          let tp = that.getStorage('_question_edit_type')
          that.question = { ...that.question, type: tp.value }
          if (tp.value === '1' || tp.value === '2') {
            for (let i = 0; i < 3; i++) {
              that.question.options.push({ content: '', medias: [] })
            }
          } else if (tp.value === '3' || tp.value === '6') {
            that.question.options.push({ content: '' })
          } else if (tp.value === '4') {
            that.question.options.push({ startValue: '', endValue: '', unit: '' })
          } else if (tp.value === '5') {
            that.question.options.push({ startValue: 2 })
          }
        }
      },
      handleScore(score) {
        this.question.options[0].startValue = score
      },
      handleAddOption(item, index) {
        this.question.options.push({ content: '', medias: [] })
      },
      handleRemove() {
        const that = this
        that
          .$confirm('确定删除该题目', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            that.setStorage('_question_edit_cache', { ...that.question, status: 'd' })
            that.routeBack()
          })
      },
      handleSubmit() {
        const that = this

        let qt = that.question
        if (Check.isNullString(qt.content)) {
          that.$message({ message: '标题不能为空', type: 'warning' })
          return false
        }
        let opts = []
        if (qt.type === '1' || qt.type === '2') {
          opts = that.question.options.filter(v => {
            return !Check.isNullString(v.content) || Check.isRealArray(v.medias)
          })
          if (opts.length < 2) {
            that.$message({ message: '选择题不能少于两个选项', type: 'warning' })
            return false
          }
        } else if (qt.type === '4') {
          let min = that.question.options[0].startValue
          let max = that.question.options[0].endValue
          let unit = that.question.options[0].unit
          if (Check.isNullString(min) || Check.isNullString(max)) {
            that.$message({ message: '数值范围存在空值', type: 'warning' })
            return false
          }
          if (parseInt(min) > parseInt(max)) {
            that.$message({ message: '起始值不能大于结束值', type: 'warning' })
            return false
          }
          if (Check.isNullString(unit)) {
            that.$message({ message: '单位不能空', type: 'warning' })
            return false
          }
        }

        qt.title = qt.content
        delete qt.content
        delete qt.notify
        delete qt.tagging
        delete qt.toUsers
        that.setStorage('_question_edit_cache', {
          ...qt,
          options: Check.isRealArray(opts) ? opts : qt.options
        })
        that.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .question-edit {
    .min-input {
      padding: 0 rem(5);
      width: 50px;
      min-width: 50px;
      text-align: center !important;
    }
  }
</style>
