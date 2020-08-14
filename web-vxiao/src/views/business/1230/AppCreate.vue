<template>
  <page title="新建学科评价"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        @back="handleBack"
        listenBack>
    <div class="subject-appraisal-create">
      <item @click="handleSubject">
        <div slot="main">科目</div>
        <div slot="remark"
             v-html="subjectTxt"></div>
      </item>
      <item @click="handleKnowledge">
        <div slot="main">知识图谱</div>
        <div slot="remark"
             v-html="knowledgeTxt"></div>
      </item>
      <div class="category-title"></div>
      <item v-for="(item,i) in form.students"
            :key="i"
            :hasClick="false">
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark">
          <div class="star-items">
            <span v-for="(s,k) in item.stars"
                  :key="k"
                  class="star"
                  :class="{'active':s.active, 'half-active':s.half}"
                  @click="handleStar(item, s, i, k, $event)"></span>
          </div>
        </div>
      </item>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          students: [],
          subject: null,
          knowledge: null,
          year: ''
        }
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        appraisal: 'getSubjectAppraisal'
      }),
      subjectTxt() {
        return this.form.subject ? this.form.subject.obj : '请选择'
      },
      knowledgeTxt() {
        return this.form.knowledge ? this.form.knowledge.name : '请选择'
      },
      stars() {
        let s = []
        for (let i = 0; i < 5; i++) {
          s.push({ score: i + 1 })
        }
        return s
      }
    },
    methods: {
      ...mapActions(['setSubjectAppraisal']),
      fetchData() {
        const that = this
        if (that.appraisal.form) {
          that.form = JSON.parse(JSON.stringify(that.appraisal.form))

          if (that.appraisal.subject) {
            that.form.subject = that.appraisal.subject
            that.setSubjectAppraisal({ subject: null })
          }

          if (that.appraisal.knowledge) {
            that.form.knowledge = that.appraisal.knowledge
            that.setSubjectAppraisal({ knowledge: null })
          }
        } else {
          Api.loadStudentList(that.currentGroup.groupId).then(res => {
            that.form.year = res.year
            that.form.students = res.relations.map(v => {
              v.stars = that.stars.map(s => {
                let star = {
                  ...s,
                  active: false,
                  half: false
                }
                return star
              })
              v.score = 0
              return v
            })
          })
        }
      },
      handleSubject() {
        this.setSubjectAppraisal({ form: this.form, subject: this.form.subject })
        this.routePush({ name: 'selectSubject1230' })
      },
      handleKnowledge() {
        let subject = this.form.subject
        if (!subject) {
          this.$message({ message: '请选择科目', type: 'warning' })
          return false
        }
        this.setSubjectAppraisal({ form: this.form, subject: subject, knowledge: this.form.knowledge })
        this.routePush({ name: 'selectKnowledge1230' })
      },
      handleStar(item, star, index, sIndex, e) {
        if (sIndex === 0 && e.offsetX < 3) {
          let stars = item.stars.map(s => {
            s.active = false
            s.half = false
            return s
          })
          this.$set(this.form.students[index], 'score', 0)
          this.$set(this.form.students[index], 'stars', stars)
        } else {
          let score = 0
          let stars = []
          item.stars.forEach((s, i) => {
            if (i < sIndex) {
              s.active = true
              s.half = false
              score++
            } else if (i > sIndex) {
              s.active = false
              s.half = false
            }
            stars.push(s)
          })
          if (e.offsetX > 8) {
            star.active = true
            star.half = false
            score++
          } else {
            star.half = true
            star.active = false
            score += 0.5
          }
          stars[sIndex] = star
          this.$set(this.form.students[index], 'score', score)
          this.$set(this.form.students[index], 'stars', stars)
        }
      },
      handleSubmit() {
        const that = this

        let form = that.form
        if (!form.subject) {
          that.$message({ message: '请选择科目', type: 'warning' })
          return false
        }

        if (!form.knowledge) {
          that.$message({ message: '请选择知识图谱', type: 'warning' })
          return false
        }

        let datas = []
        form.students.map(v => {
          if (v.score > 0) {
            datas.push({ userId: v.userId, score: v.score })
          }
        })

        if (!Check.isRealArray(datas)) {
          that.$message({ message: '至少对一学生进行评价', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1152',
          groupId: that.currentGroup.groupId,
          msgJson: JSON.stringify(datas),
          extension: JSON.stringify({
            categoryId: form.knowledge.id,
            subjectCategoryId: form.subject.key,
            subjectName: form.subject.obj,
            year: form.year
          }),
          content: form.subject.obj
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.setSubjectAppraisal({ form: null })
          this.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setSubjectAppraisal({ form: null })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .subject-appraisal-create {
    .star-items {
      .star {
        display: inline-block;
        width: rem(18);
        height: rem(18);
        margin-left: rem(5);
        vertical-align: middle;
        cursor: pointer;
        background: url(~images/ico/ico_star.png) no-repeat center;
        background-size: 100%;
        &.active {
          background: url(~images/ico/ico_light_star.png) no-repeat center;
          background-size: 100%;
        }
        &.half-active {
          background: url(~images/ico/ico_half_star.png) no-repeat center;
          background-size: 100%;
        }
      }
    }
  }
</style>
