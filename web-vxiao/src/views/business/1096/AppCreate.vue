<template>
  <page title="新建选拔"
        closePrompt
        @back="handleBack"
        listenBack>
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span class="active"><b>1</b><br>面向年级</span>
        <span><b>2</b><br>备选课程</span>
        <span><b>3</b><br>选课数量</span>
        <span><b>4</b><br>规则设定</span>
        <i></i>
      </div>
    </div>
    <div class="face-grade">
      <div v-for="(item, i) in list"
           :key="i">
        <div class="category-title text"
             v-html="item.name"></div>
        <item v-for="(grade,j) in item.groups"
              :key="j"
              :hasArrow="false"
              @click="handleSelect(grade, i, j)">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':grade.selected}"></i>
          </div>
          <div slot="main"
               v-html="grade.name"></div>
        </item>
      </div>
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
  import GroupApi from '@/api/group'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
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
        const that = this
        let gs = that.selection.grades
        let gMap = new Map()
        if (Check.isRealArray(gs)) {
          gs.map(v => {
            gMap.set(v.groupId, v)
          })
        }

        GroupApi.getSchoolGradesTree(that.currentGroup.parentId).then(res => {
          if (Check.isRealArray(res.groups)) {
            that.list = res.groups.map(v => {
              if (Check.isRealArray(v.groups)) {
                v.groups = v.groups.map(g => {
                  g.selected = Check.isObject(gMap.get(g.groupId))
                  return g
                })
              }
              return v
            })
          }
        })
      },
      handleSelect(grade, cIndex, gIndex) {
        grade.selected = !grade.selected
        this.$set(this.list[cIndex].groups, gIndex, grade)
      },
      handleNext() {
        let grades = []
        this.list.forEach((v, i) => {
          let gs = v.groups.filter(g => {
            return g.selected
          })
          if (Check.isRealArray(gs)) {
            grades.push(...gs)
          }
        })

        if (!Check.isRealArray(grades)) {
          this.$message({ message: '请选择面向年级', type: 'warning' })
          return false
        }

        let version = new Date().getTime()
        this.setSelection({ grades: grades, version: version })
        this.routePush({ name: 'alternativeCourse1096' })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.setSelection({ grades: [] })
          this.routeBack()
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
    border-top: $border;
  }
</style>
