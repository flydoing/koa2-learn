<template>
  <Page title="新建排考"
        closePrompt>
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span><b>1</b><br>时间安排</span>
        <span><b>2</b><br>场所安排</span>
        <span><b>3</b><br>监考安排</span>
        <span class="active"><b>4</b><br>智能排考</span>
        <i></i>
      </div>
    </div>
    <!-- 场所 -->
    <div v-for="(item, i) in arranges"
         :key="i">
      <div class="category-title">
        {{item.grade.campuName}} {{item.grade.name}}
        <span class="right"
              @click="handleSubject(item)">考试科目信息</span>
      </div>
      <item v-for="(place, j) in item.places"
            :key="j"
            :hasClick="false">
        <div slot="main">{{place.examPlaceName}}</div>
        <div slot="remark">
          <span class="text text-color"
                @click="handleStudent(place)">考生（{{place.students.length}}人）</span>&#12288;
          <span class="text text-color"
                @click="handleInvigilator(place)">监考人员</span>
        </div>
      </item>
    </div>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           @click="handleFinish">完成</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import DateUtils from '@/utils/date'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        arranges: []
      }
    },
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      })
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setArrangeExam', 'deleteArrangeExamProp']),
      fetchData() {
        if (this.arrange.arranges) {
          this.arranges = JSON.parse(JSON.stringify(this.arrange.arranges))
          let place = this.arrange.place
          if (place) {
            this.arranges = this.arranges.map(v => {
              v.places = v.places.map(p => {
                if (p.examPlaceId === place.examPlaceId) {
                  return place
                }
                return p
              })
              return v
            })
            this.deleteArrangeExamProp('place')
          }
          this.deleteArrangeExamProp('arranges')
        } else {
          let arranges = []
          let tForm = this.arrange.timeForm
          let pForm = this.arrange.placeForm
          let iForm = this.arrange.invigilateForm

          // 获取排考年级及考试科目
          tForm.datas.map(v => {
            arranges.push({
              grade: {
                id: v.id,
                name: v.name,
                campusId: v.campusId,
                campusName: v.campusName
              },
              subjects: v.subjects
            })
          })

          // 获取排考场所监考数据
          let iMap = new Map()
          iForm.datas.map(v => {
            iMap.set(v.examPlaceId, v)
          })

          // 获取排考场所自动分配学生数据及合并监考人员数据
          let pMap = new Map()
          pForm.reexams.map(v => {
            let p = { ...v, users: iMap.get(v.examPlaceId).users }
            let places = pMap.get(v.gradeId)
            if (places) {
              places.push(p)
              pMap.set(v.gradeId, places)
            } else {
              pMap.set(v.gradeId, [p])
            }
          })

          // 合并数据集
          this.arranges = arranges.map(v => {
            return {
              ...v,
              places: pMap.get(v.grade.id)
            }
          })
        }
        if (this.arrange.subjects) {
          this.deleteArrangeExamProp('subjects')
        }
      },
      handleSubject(item) {
        this.setArrangeExam({ arranges: this.arranges, subjects: item.subjects })
        this.routePush({ name: 'subjectPreview1164' })
      },
      handleStudent(place) {
        this.setArrangeExam({ arranges: this.arranges, place: place })
        this.routePush({ name: 'seatPreview1164' })
      },
      handleInvigilator(place) {
        this.setArrangeExam({ arranges: this.arranges, place: place })
        this.routePush({ name: 'memberList1164' })
      },
      handleFinish() {
        const that = this
        let tForm = this.arrange.timeForm

        let mJson = []
        this.arranges.map(v => {
          v.places.map(p => {
            let place = {
              ...p,
              teachers: p.users.map(u => {
                return {
                  userId: u.userId,
                  name: u.name,
                  avatar: u.avatar
                }
              }),
              subjects: v.subjects.map(s => {
                return {
                  subjectId: s.id,
                  subjectName: s.name,
                  startDate: DateUtils.format_0800(s.startTime),
                  endDate: DateUtils.format_0800(s.endTime)
                }
              })
            }
            delete place.users
            mJson.push(place)
          })
        })

        let postData = that.constructionMessage({
          type: '1164',
          groupId: that.groupId,
          content: tForm.name,
          msgType: '1',
          msgJson: JSON.stringify(mJson)
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.deleteArrangeExamProp('timeForm')
          that.deleteArrangeExamProp('placeForm')
          that.deleteArrangeExamProp('invigilateForm')
          that.routeBack(-5)
        })
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

  .btm-operate {
    padding: rem(5) 0;
  }
</style>
