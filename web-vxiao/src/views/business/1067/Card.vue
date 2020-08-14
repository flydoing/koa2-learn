<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="message">
      <el-dropdown-item v-if="userId===message.fromUserId || isTeacher"
                        @click.native.stop="recommendVScreen(message)">{{xlText}}</el-dropdown-item>
    </CardDown>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:url(message.fromUserAvatar, 'thumb'),error:Image.ICO_AVATAR}"
         alt='头像' />
    <span slot="name"></span>
    <span slot="point"></span>
    <div class="score-box"
         slot="href">
      <div v-if="scoreType.value==='0' || scoreType.value === '1'"
           class="text-color"
           @click="commentHandle(scoreType)">
        <!-- 分数(0) || 等级(1) -->
        {{chileMsg.extensionType ? scoreTitle + chileMsg.extensionType : '立即评价'}}
      </div>
      <div v-if="scoreType.value==='2'"
           class="text-color"
           @click="commentHandle(scoreType)">
        <!-- 评星 -->
        <template v-if="!chileMsg.extensionType">
          立即评价
        </template>
        <div class="star-box"
             v-else>
          <i class="ico ico-star-press star"
             v-for="n in 5"
             :key="n"
             :class="{'active': Number(chileMsg.extensionType)>=n}"
             @click.stop="commentHandle(scoreType, n)"></i>
        </div>
      </div>
    </div>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Api from './api'
  import MsgApi from '@/api/message'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      }
    },
    data() {
      return {
        scoreType: {},
        scoreTitle: '',
        chileMsg: {}
      }
    },
    computed: {
      xlText() {
        return this.message.msgJson === '1' ? '取消推荐' : '推荐'
      }
    },
    created() {
      this.scoreType = this.message.scoreType
      this.scoreTitle = this.message.scoreType.value === '0' ? '分数：' : '等级：'
      this.chileMsg = this.message
    },
    methods: {
      commentHandle(scoreType, n) {
        if (JSON.parse(this.message.remark).isAppraiseable !== 1) return false
        switch (this.scoreType.value) {
          case '0':
            this.$prompt('', '评价', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /\d/,
              inputErrorMessage: '输入内容有误',
              inputPlaceholder: '输入分数',
              center: true,
              showClose: false
            })
              .then(({ value }) => {
                this.commitGrading(scoreType, value)
              })
              .catch(() => {})
            break
          case '1':
            // 等级
            // this.gradeShowBol = true
            this.setStorage('scoreTyepChild', this.message.scoreTyepChild)
            this.routePush({
              name: 'scoreTypeGrade1067',
              query: {
                parentId: this.message.parentId,
                categoryId: this.message.scoreType.id,
                msgId: this.message.id
              }
            })
            break
          case '2':
            // 评星
            this.commitStar(scoreType, n)
            break
        }
      },
      handleReturn() {
        this.gradeShowBol = false
      },
      gradeHandle(grade) {
        this.commitGrading(grade)
      },
      commitGrading(grade, scoreText = null) {
        let that = this
        let reqBody = {
          homeworks: [
            {
              msgId: that.message.parentId,
              categoryId: that.scoreType.id,
              datas: [
                {
                  optionId: !scoreText ? grade.id : void 0,
                  score: scoreText || grade.value,
                  userId: that.userId,
                  answerMsgId: that.message.id
                }
              ]
            }
          ]
        }
        Api.grading(reqBody).then(res => {
          if (res && res.code === '1') {
            this.$message({
              type: 'success',
              message: '成功'
            })
            let that = this
            that.gradeShowBol = false
            that.chileMsg = res.messages[0]
          }
        })
      },
      commitStar(scoreType, n) {
        let scoreValue = n * 20
        this.commitGrading(scoreType, scoreValue)
      },
      recommendVScreen(m) {
        MsgApi.modifyMessage({
          id: m.id,
          type: '1067',
          msgJson: m.msgJson === '1' ? '0' : '1'
        }).then(res => {
          this.$set(this.message, 'msgJson', res.messages[0].msgJson)
          this.$message({
            type: 'success',
            message: '成功'
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .star-box {
    .star {
      display: inline-block;
      width: rem(18);
      height: rem(18);
      margin-left: rem(5);
      vertical-align: middle;
      cursor: pointer;
      background: url(~images/ico/ico_star.png) no-repeat center;
      background-size: 100%;

      &.active,
      &:hover {
        background: url(~images/ico/ico_light_star.png) no-repeat center;
        background-size: 100%;
      }
    }
  }

  .el-dropdown-menu {
    z-index: 10001 !important;
  }
</style>
