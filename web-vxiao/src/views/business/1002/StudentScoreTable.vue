<template>
  <div class="student-table">
    <table style="width: 100%;"
           class="table">
      <tr>
        <th v-for="(th, t) in initTitles"
            :key="t">{{th}}</th>
      </tr>
      <tr v-for="(row, r) in initList"
          :key="r"
          class="table-row">
        <td>{{row.name}}</td>
        <template v-if="scoreType.value==='0'">
          <!-- 分数 -->
          <td>{{row.parentOptionName || '未评'}}</td>
          <td v-if="!isEdit">{{row.optionName || '未评'}}</td>
          <td v-else>
            <input type="text"
                   v-model.number="row.score"
                   maxlength="3">
          </td>
        </template>
        <template v-if="scoreType.value==='1'">
          <!-- 等级 -->
          <td>{{row.parentOptionName || '未评'}}</td>
          <td v-if="!isEdit">{{row.optionName || '未评'}}</td>
          <td v-else
              @click="editScoreHandle">
            {{row.gradeName ? row.gradeName : ''}}
          </td>
          <Dialogs :visible.sync="gradeShowBol"
                   ref="_dialog_list"
                   :height="260">
            <DialogPage title="评价"
                        :hasReturn="true"
                        :hasClose="false">
              <item v-for="(grade, g) in scoreTyepChild"
                    :key="g"
                    @click="gradeHandle(grade, row)">
                <div slot="main">{{grade.name}}</div>
                <span slot="after"></span>
              </item>
            </DialogPage>
          </Dialogs>
        </template>
        <template v-if="scoreType.value==='2'">
          <!-- 评星 -->
          <td>
            <div class="star-box"
                 v-if="row.parentOptionName">
              <div class="star"
                   v-for="n in 5"
                   :key="n"
                   :class="{'active':n<=row.parentOptionName}"></div>
            </div>
            <template v-else>未评</template>
          </td>
          <td v-if="!isEdit">
            <div class="star-box"
                 v-if="row.optionName">
              <div class="star"
                   v-for="n in 5"
                   :key="n"
                   :class="{'active':n<=row.optionName}"></div>
            </div>
            <template v-else>未评</template>
          </td>
          <td v-else>
            <div class="star-box">
              <div :class="[n <= row.sortNum ? 'star active' : 'star']"
                   v-for="n in 5"
                   :key="n"
                   ref="teacherStar"
                   @click="starHanle(n, row, r)"></div>
            </div>
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>
<script>
  // import Check from '@/utils/check'
  export default {
    props: {
      initDatas: {
        type: Array,
        default() {
          return []
        }
      },
      initTitles: {
        type: Array,
        default() {
          return []
        }
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      scoreTyepChild: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        initList: [],
        gradeShowBol: false,
        scoreType: this.getStorage('scoreType', true)
      }
    },
    created() {
      let that = this
      that.initList = that.initDatas.map(v => {
        that.$set(v, 'sortNum', 5)
        return v
      })
    },
    methods: {
      editScoreHandle() {
        if (!this.isEdit) return false
        switch (this.scoreType.value) {
          case '0':
            break
          case '1':
            this.gradeShowBol = true
            break
          case '2':
            break
        }
      },
      gradeHandle(gradeObj, rowObj) {
        this.gradeShowBol = false
        rowObj.gradeName = gradeObj.name
        rowObj.score = gradeObj.value
      },
      starHanle(n, rowObj, rowIndex) {
        this.$set(this.initList[rowIndex], 'sortNum', n)
        this.$set(this.initList[rowIndex], 'score', n * 20)
        // this.$refs.teacherStar.forEach((star, s) => {
        //     star.setAttribute('class', 'star')
        //     if (s < n) {
        //       star.setAttribute('class', 'star active')
        //     }
        // })
      }
    },
    watch: {
      initList(v) {
        this.initList = v
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .table {
    .table-row {
      input {
        margin: 0 auto;
        width: rem(50);
        display: block;
        /* height: rem(30); */
        text-align: center;
        border: none;
      }
    }
  }

  .table-row {
    .star-box {
      @include flex;
      @include jc;
      &.center {
        @include jc;
        margin-bottom: rem(20);
        .star {
          width: rem(25);
          height: rem(25);
          margin-right: rem(10);
        }
      }
      .star {
        width: rem(18);
        height: rem(18);
        margin-right: rem(5);
        cursor: pointer;
        background: url(~images/ico/ico_star.png) no-repeat center;
        background-size: 100%;
        &.active {
          background: url(~images/ico/ico_light_star.png) no-repeat center;
          background-size: 100%;
        }
        &:hover {
          background: url(~images/ico/ico_light_star.png) no-repeat center;
          background-size: 100%;
        }
      }
    }
  }
</style>
