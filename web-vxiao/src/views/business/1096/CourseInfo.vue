<template>
  <page title="课程信息"
        @back="handleBack"
        listenBack>
    <div class="course-info">
      <item :hasClick="false">
        <div slot="main">名称</div>
        <div slot="remark"
             v-html="course.name"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">任课老师</div>
        <div slot="remark"
             v-html="propTxt(course.teachers)"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">适选班级</div>
        <div slot="remark"
             v-html="propTxt(course.classes)"
             class="ellipsis"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">人数上限</div>
        <div slot="remark"
             v-html="course.upperLimit"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">上课地点</div>
        <div slot="remark"
             v-html="course.placeName"></div>
      </item>
      <item :hasClick="false">
        <div slot="main">上课时间</div>
        <div slot="remark"
             v-html="timeTxt"
             class="ellipsis"></div>
      </item>
      <div class="ci-description"
           v-html="course.description"></div>
      <div class="pd">
        <img v-if="course.logo"
             class="ci-image"
             v-lazy="{src:url(course.logo),error:'/static/ico_im_empty.png'}" />
      </div>
    </div>
    <div slot="bottom"
         class="btm-operate"
         v-if="selection.publish.role !== 'teacher' && selection.publish.role !== 'admin'">
      <div class="button button-common"
           :class="applyBtn.cls"
           @click="handleApply"
           v-html="applyBtn.text">申报</div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        course: {},
        hasOperate: false
      }
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      }),
      timeTxt() {
        if (Check.isRealArray(this.course.periods)) {
          return this.course.periods
            .map(v => {
              return `${v.dayName} ${v.sectionName}`
            })
            .join('、')
        }
        return ''
      },
      applyBtn() {
        let obj = { text: '', cls: { disabled: true } }
        switch (this.course.status) {
          case '0':
            obj = { text: '申报', cls: {} }
            break
          case '1':
            obj = { text: '取消申报', cls: { error: true } }
            break
          case '2':
            obj.text = '已录取'
            break
          case '3':
            obj.text = '上课时间冲突'
            break
          case '4':
            obj.text = '竞拍积分不足'
            break
          case '5':
            obj.text = '录取人数已满'
            break
          case '6':
            obj.text = '选课数量已达上限'
            break
          case '7':
            obj.text = '选课未开始'
            break
          case '8':
            obj.text = '选课已结束'
            break
          case '9':
            obj.text = '系统已录取'
            break
          case '10':
            obj.text = '未录取'
            break
          case '11':
            obj.text = '禁选'
            break
        }
        return obj
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setSelection']),
      propTxt(data) {
        if (Check.isRealArray(data)) {
          return data
            .map(v => {
              return v.name || v.userName || v.groupName
            })
            .join('、')
        }
        return ''
      },
      fetchData() {
        let course = this.selection.course
        let publish = this.selection.publish
        if (publish.role === 'admin' || publish.role === 'teacher') {
          Api.getCourseDetail(publish.id, course.id).then(res => {
            if (res.courses) {
              this.course = res.courses[0]
            }
          })
        } else {
          let item = this.selection.item
          Api.getCourseDetailByUserId(publish.id, item.courseId || course.id, item.userId).then(res => {
            if (res.courses) {
              this.course = res.courses[0]
            }
          })
        }
      },
      commitData(params) {
        let item = this.selection.item
        let publish = this.selection.publish
        let postData = {
          publishId: publish.id,
          userId: item.userId,
          groupId: item.groupId,
          courseId: this.course.id,
          serial: item.serial,
          status: this.course.status === '1' ? 'd' : '1'
        }
        if (params) {
          postData = { ...postData, ...params }
        }
        Api.applyCourse(postData).then(res => {
          this.fetchData()
          this.hasOperate = true
          this.$message({ type: 'success', message: '操作成功' })
        })
      },
      handleApply() {
        if (this.applyBtn.cls.disabled) {
          return false
        }
        if (this.selection.publish.categoryValue === '3' && this.status !== '1') {
          this.$prompt(`每位学生拥有100总积分，申报单个课程时投注分值高者将被优先录取。<br>剩余积分：${this.course.score}`, '积分竞拍：', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定申报',
            cancelButtonText: '取消',
            inputPlaceholder: '本次投注积分'
          })
            .then(({ value }) => {
              if (Check.isNullString(value)) {
                this.$message({ type: 'warning', message: '投注积分不能为空' })
                return false
              }
              this.commitData({ score: value })
            })
            .catch(() => {})
        } else {
          this.commitData()
        }
      },
      handleBack() {
        let publish = this.selection.publish
        let item = this.selection.item
        if (publish.role === 'admin' || publish.role === 'teacher' || item.courseId || !this.hasOperate) {
          this.routeBack()
        } else {
          this.routeBack(-2)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .course-info {
    .ci-description {
      text-align: justify;
      padding: rem(10);
    }

    .ci-image {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
  }

  .btm-operate {
    padding: rem(5) 0;
  }
</style>
