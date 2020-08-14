<template>
  <Page title="新建排考"
        listenBack
        closePrompt
        @back="handleBack">
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span><b>1</b><br>时间安排</span>
        <span><b>2</b><br>场所安排</span>
        <span class="active"><b>3</b><br>监考安排</span>
        <span><b>4</b><br>智能排考</span>
        <i></i>
      </div>
    </div>
    <!-- 场所 -->
    <template v-if="invigilate">
      <div class="category-title">{{invigilate.campus.name}}</div>
      <item v-for="(place, i) in invigilate.places"
            :key="i"
            @click="handleItem(place, i)">
        <div slot="main">{{place.examPlaceName}}</div>
        <div slot="remark"
             class="ellispis"
             v-html="userTxt(place)"></div>
      </item>
    </template>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           @click="handleNext">下一步</div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  // import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        invigilate: null
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
      userTxt(place) {
        if (Check.isRealArray(place.users)) {
          let userNames = []
          place.users.map(v => {
            userNames.push(v.name)
          })
          return userNames.join('、')
        }
        return '监考人员'
      },
      fetchData() {
        if (this.arrange.invigilate) {
          this.invigilate = JSON.parse(JSON.stringify(this.arrange.invigilate))
          let place = this.arrange.place
          if (place) {
            this.invigilate.places = this.invigilate.places.map(v => {
              if (v.examPlaceId === place.examPlaceId) {
                return place
              }
              return v
            })
            this.deleteArrangeExamProp('place')
          }
          this.deleteArrangeExamProp('invigilate')
        } else if (this.arrange.invigilateForm) {
          this.invigilate = JSON.parse(JSON.stringify(this.arrange.invigilateForm.invigilate))
          this.deleteArrangeExamProp('invigilateForm')
        } else if (this.arrange.placeForm) {
          this.invigilate = JSON.parse(JSON.stringify(this.arrange.placeForm.data))
          this.invigilate.places = this.invigilate.places.map(v => {
            v.users = []
            return v
          })
        }
      },
      handleItem(place) {
        this.setArrangeExam({ invigilate: this.invigilate, place: place })
        this.routePush({ name: 'memberList1164' })
      },
      handleNext() {
        let flag = true
        this.invigilate.places.forEach((v, i) => {
          if (!Check.isRealArray(v.users) && flag) {
            this.$message({ message: `请设置各考场监考人员`, type: 'warning' })
            flag = false
          }
        })
        this.setArrangeExam({
          invigilateForm: {
            invigilate: this.invigilate,
            datas: this.invigilate.places
          }
        })
        this.routePush({ name: 'autoStep1164' })
      },
      handleBack() {
        this.deleteArrangeExamProp('invigilateForm')
        this.routeBack()
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
