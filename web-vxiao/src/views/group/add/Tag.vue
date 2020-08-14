<template>
  <Page hasSubmit
        @submit="submit">
    <div class="vx-tag"
         v-if="grade.length>0">
      <div class="vx-tag-title">年级</div>
      <div class="vx-tag-block">
        <div v-for="tag in grade"
             @click="handleGrade(tag)"
             :key="tag.id"
             :class="{'active':tag.id===selectGrade.id}">
          {{tag.name}}
        </div>
      </div>
      <div class="vx-tags"
           v-if="subject.length>0">
        <div class="vx-tag-title">科目</div>
        <div class="vx-tag-block">
          <div v-for="tag in subject"
               @click="handleSubject(tag)"
               :key="tag.id"
               :class="{'active':tag.id===selectSubject.id}">
            {{tag.name}}
          </div>
        </div>
      </div>
      <div class="vx-tags"
           v-if="press.length>0">
        <div class="vx-tag-title">出版社</div>
        <div class="vx-tag-block">
          <div v-for="tag in press"
               @click="handlePress(tag)"
               :key="tag.id"
               :class="{'active':tag.id===selectVersion.id}">
            {{tag.name}}
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script>
  import Api from '@/views/business/1186/api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        grade: [],
        subject: [],
        press: [],
        selectGrade: {},
        selectSubject: {},
        selectVersion: {}
      }
    },
    computed: {
      group() {
        return {
          text: `${this.selectGrade.name || '不限'} ${this.selectSubject.name || ''} ${this.selectVersion.name || ''}`.trim(),
          gradeId: this.selectGrade.id,
          subjectId: this.selectSubject.id,
          versionId: this.selectVersion.id
        }
      }
    },
    created() {
      Api.getDefaultSearchKey().then(res => {
        this.grade = res.categorys
      })
    },
    methods: {
      submit() {
        if (Check.isNullObject(this.selectGrade)) {
          // this.$message({ type: 'warning', message: '请选择年级' })
        }
        if (this.selectGrade.id && Check.isNullObject(this.selectSubject)) {
          // this.$message({ type: 'warning', message: '请选择科目' })
        }
        this.setStorage('_cache_tag', this.group)
        this.routeBack()
      },
      handleGrade(grade) {
        this.selectGrade = grade
        if (!this.selectGrade.id) {
          return
        }
        Api.getDefaultSearchKey(grade.id).then(res => {
          this.subject = res.categorys
          this.press = []
          this.selectSubject = {}
          this.selectVersion = {}
        })
      },
      handleSubject(subject) {
        this.selectSubject = subject
        if (!this.selectSubject.id) {
          return
        }
        Api.getDefaultSearchKey(subject.id).then(res => {
          this.press = res.categorys
          this.selectVersion = {}
        })
      },
      handlePress(press) {
        this.selectVersion = press
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .vx-tag {
    padding: rem(0) rem(10);
    &-title {
      line-height: rem(30);
      font-weight: bold;
    }
    &-block {
      @include flex;
      @include jc(flex-start);
      @include wrap;
      div {
        border: $border;
        border-radius: rem(3);
        line-height: rem(30);
        text-align: center;
        padding: 0 rem(10);
        margin: 0 rem(10) rem(10) 0;
        cursor: pointer;
        &.active {
          color: #fff;
          border: rem(1) solid #fff;
          @include bc;
        }
      }
    }
  }
</style>
