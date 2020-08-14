<template>
  <page title="新建阅读"
        closePrompt
        listenBack
        @back="back">
    <div slot="btn"
         v-if="reading.isDefault">
      <label @click="handleNext">下一步</label>
    </div>
    <div class="create-type"
         v-if="isClass">
      <div :class="{'active': reading.isDefault}"
           @click="changeCreateType(1)">直接新建</div>
      <div :class="{'active': !reading.isDefault}"
           @click="changeCreateType(2)">从课程中选取</div>
    </div>
    <div class="category-title"></div>
    <div class="reading-box">
      <div v-if="reading.isDefault">
        <item :hasClick="false">
          <div>阅读作业名称</div>
          <input slot="remark"
                 type="text"
                 placeholder="必填"
                 v-model="reading.title">
        </item>
        <div class="category-title"
             v-if="isCourse"></div>
        <item v-if="isCourse"
              @click="handleCatalogue">
          <div>目录</div>
          <div slot="remark"
               v-if="reading.category">{{reading.category.name}}</div>
        </item>
        <p class="reading-content"
           @click="reading.showEditor = !reading.showEditor"
           v-html="reading.content ? reading.content : '请输入阅读文段'"></p>
        <EditorPraxis ref="_editor"
                      v-if="reading.showEditor"
                      v-model="reading.content"
                      :store.sync="reading"
                      placeholder="请输入阅读文段" />
        <PraxisView :praxis.sync="reading"
                    appType="1069" />
      </div>
      <div class="course-list"
           v-else>
        <template v-if="allCourse.length>0">
          <item v-for="(group, i) in allCourse"
                :key="i"
                @click="groupClick(group)">
            <div slot="before"><img class="group-avatar"
                   v-lazy="{src:url(group.logo)}"
                   alt='群封面'></div>
            <div>{{group.name}}</div>
          </item>
        </template>
      </div>
    </div>
    <div slot="bottom"
         class="add-praxis-btn"
         @click="addQuestion"
         v-if="reading.isDefault">添加题目</div>
  </page>
</template>
<script>
  import PraxisView from '@/views/business/1047/components/commonPraxis'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    components: {
      PraxisView,
      EditorPraxis: resolve => require(['@/components/editor/EditorPraxis'], resolve)
    },
    data() {
      return {
        reading: {
          title: '',
          content: '',
          showEditor: false,
          isDefault: true,
          questions: [
            {
              content: '',
              explain: '',
              type: '8',
              isCreate: true
            }
          ],
          remarks: {},
          // 习题新建控件 true 在课程群添加题目，题目不出现选择目录按钮
          isReading: true,
          isBatch: false,
          category: null
        },
        allCourse: []
      }
    },
    computed: {
      ...mapGetters({
        cacheReading: 'getReading',
        myGroups: 'getGroups'
      })
    },
    activated() {
      if (this.cacheReading.isHasCache) {
        this.reading = JSON.parse(JSON.stringify(this.cacheReading))
      }
    },
    methods: {
      ...mapActions(['saveReading', 'clearReading']),
      addQuestion() {
        this.reading.questions.push({
          content: '',
          explain: '',
          type: '8',
          isCreate: true
        })
      },
      handleNext() {
        if (this.isCourse && Check.isNullObject(this.reading.category)) {
          this.$message({ type: 'warning', message: '请选择目录' })
          return false
        }
        if (!this.reading.title) {
          this.$message({ type: 'warning', message: '请输入阅读作业名称' })
          return false
        }
        if (!this.reading.content) {
          this.$message({ type: 'warning', message: '请输入阅读内容' })
          return false
        }
        // 习题内容或者选项是否为空
        let contentBol = this.reading.questions.some(q => {
          return !q.content
        })
        if (contentBol) {
          this.$message({ type: 'warning', message: '习题内容不能为空' })
          return false
        }
        let optionBol = false
        this.reading.questions.forEach(q => {
          if (q.options && q.options.length) {
            optionBol = q.options.some(optoin => {
              return !optoin.content
            })
          }
        })
        if (optionBol) {
          this.$message({ type: 'warning', message: '习题选项不能为空' })
          return false
        }
        this.saveReading({
          ...this.reading,
          isHasCache: true
        })
        this.routePush({
          name: 'createPreview1069'
        })
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
            that.clearReading()
            that.routeBack()
          })
          .catch(() => {})
      },
      handleCatalogue() {
        this.saveReading({
          ...this.reading,
          isHasCache: true
        })
        this.routePushModel({
          name: 'catalog1069'
        })
      },
      changeCreateType(i) {
        if (i === 1) {
          this.reading.isDefault = true
        } else {
          this.reading.isDefault = false
          this.allCourse = this.myGroups.filter(v => {
            return v.type === '23'
          })
        }
      },
      groupClick(group) {
        this.routePushModel({
          name: 'pushList1069',
          query: {
            cGroupId: group.groupId
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .create-type {
    @include flex;

    div {
      flex: 1;
      text-align: center;
      height: rem(40);
      line-height: rem(40);
      cursor: pointer;
      background-color: #f1f1f1;

      &:hover,
      &.active {
        @include fc;
        background-color: #fff;
      }
    }
  }

  .reading-box {
    .reading-content {
      padding: rem(10); // color: #999;

      p {
        margin-bottom: rem(5);
      }
    }

    .course-list {
      .group-avatar {
        padding: rem(5) 0;
        width: rem(100);
        height: rem(60);
      }
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
