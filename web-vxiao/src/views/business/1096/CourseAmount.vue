<template>
  <page title="新建选拔"
        closePrompt>
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span><b>1</b><br>面向年级</span>
        <span><b>2</b><br>备选课程</span>
        <span class="active"><b>3</b><br>选课数量</span>
        <span><b>4</b><br>规则设定</span>
        <i></i>
      </div>
    </div>
    <div class="course-amount">
      <item :hasClick="false">
        <div slot="main">选课数量</div>
        <div slot="remark">
          <div class="ca-count-control">
            <span class="reduce"
                  @click="handleReduce(true)"></span>
            <label>{{form.courseCount}}门</label>
            <span class="plus"
                  @click="handlePlus(true)"></span>
          </div>
        </div>
      </item>
      <template v-if="form.courseCount>1">
        <div class="category-title">必选规则</div>
        <item v-for="(item,i) in form.list"
              :key="i">
          <div slot="main"
               v-html="item.name"></div>
          <div slot="remark"
               v-html="item.teachers[0].userName"></div>
          <i slot="after"
             class='ico ico-delete'
             @click="handleRemove(i)"></i>
        </item>
        <item @click="handleAdd"
              :hasArrow="false"
              v-if="form.list.length<form.courseCount-1">
          <div slot="before">
            <i class="ico ico-plus"></i>
          </div>
          <div slot="main">添加必选课程</div>
        </item>
        <template v-if="form.list.length>0">
          <div class="category-title"></div>
          <item :hasClick="false">
            <div slot="main">从以上课程中必选</div>
            <div slot="remark">
              <div class="ca-count-control">
                <span class="plus"
                      @click="handlePlus(false)"></span>
                <label>{{form.mCount}}门</label>
                <span class="reduce"
                      @click="handleReduce(false)"></span>
              </div>
            </div>
          </item>
        </template>
      </template>
    </div>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           @click="handleNext">下一步</div>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          courseCount: 1,
          list: [],
          mCount: 1
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      fetchData() {
        if (this.selection.amountForm) {
          this.form = JSON.parse(JSON.stringify(this.selection.amountForm))
          if (Check.isRealArray(this.selection.courses)) {
            this.form.list.push(...this.selection.courses)
            this.setSelection({ courses: [] })
          }
        }
      },
      handleAdd() {
        this.setSelection({ courseList: this.form.list, amountForm: this.form, courseCount: this.form.courseCount })
        this.routePush({ name: 'selectCourse1096' })
      },
      handleRemove(index) {
        this.form.list.splice(index, 1)
      },
      handlePlus(isCourse) {
        let form = this.form
        if (isCourse) {
          let total = this.selection.courseTotal
          if (form.courseCount === total) {
            this.$message({ type: 'warning', message: '选课数量不能大于备选课程数量' })
            return false
          }
          form.courseCount++
        } else if (form.mCount < form.list.length && form.mCount < form.courseCount - 1) {
          form.mCount++
        }
      },
      handleReduce(isCourse) {
        let form = this.form
        if (isCourse && form.courseCount > 1) {
          form.courseCount--
        } else if (form.mCount > 1) {
          form.mCount--
        }
      },
      handleNext() {
        if (Check.isRealArray(this.form.list)) {
          let courses = this.form.list.map(v => {
            return { id: v.id, required: 1 }
          })
          Api.modifyCourse(this.currentGroup.parentId, courses).then(res => {
            if (res.courses) {
              this.$message({ type: 'success', message: '操作成功' })
              this.setSelection({ amountForm: this.form, ruleForm: null })
              this.routePush({ name: 'ruleSetting1096' })
            }
          })
        } else {
          this.form.mCount = 0
          this.setSelection({ amountForm: this.form, ruleForm: null })
          this.routePush({ name: 'ruleSetting1096' })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tp-steps {
    padding: rem(20) rem(10);
    text-align: center;
    border-bottom: $border;

    .step-content {
      margin: 0 auto;
      display: inline-block;
      position: relative;

      i {
        position: absolute;
        border-top: $border2;
        top: 50%;
        width: 100%;
        left: 0;
      }

      span {
        display: inline-block;
        margin-left: rem(30);
        color: nth($font-color, 1);
        background: nth($background, 6);
        position: relative;
        text-align: center;
        z-index: 1;

        b {
          font-weight: normal;
          margin-right: rem(5);
          border-radius: rem(18);
          width: rem(18);
          height: rem(18);
          line-height: rem(18);
          text-align: center;
          border: $border2;
          display: inline-block;
          margin-bottom: rem(3);
        }

        &.active {
          @include fc;
        }

        &.active b {
          @include borderColor;
        }

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .course-amount {
    .ca-count-control {
      span,
      label {
        vertical-align: middle;
        display: inline-block;
      }

      .plus,
      .reduce {
        height: rem(22);
        width: rem(22);
        cursor: pointer;
      }

      .plus {
        background: url('/static/ico/ico_plus.png') no-repeat center;
        background-size: 100% 100%;
      }

      .reduce {
        background: url('/static/ico/ico_reduce.png') no-repeat center;
        background-size: 100% 100%;
      }

      label {
        margin: 0 rem(10);
      }
    }
  }

  .btm-operate {
    padding: rem(5) 0;
  }
</style>
