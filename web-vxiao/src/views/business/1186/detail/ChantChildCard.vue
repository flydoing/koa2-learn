<template>
  <Card :message="message">
    <CardDown slot="down"
              :m="message"></CardDown>
    <img slot="avatar"
         class="avatar"
         v-lazy="{src:avatar,error:Image.ICO_AVATAR}"
         alt='头像' />
    <span slot="name"></span>
    <span slot="point"></span>
    <cardAudio slot="audio"
               :audios="m.audios"></cardAudio>
    <div class="score-box"
         v-if="fromUserId === userId || message.fromUserId === userId">
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
  import Api from '@/views/business/1067/api'
  import CardMixin from '@/views/components/card/mixin'
  export default {
    mixins: [CardMixin],
    props: {
      message: {
        type: [Object]
      },
      fromUserId: {
        type: [Number, String]
      }
    },
    data() {
      return {
        avatar: this.url(this.message.fromUserAvatar),
        scoreType: this.message.scoreType,
        scoreTitle: this.message.scoreType.value === '0' ? '分数：' : '等级：',
        chileMsg: this.message,
        selectNum: 0
      }
    },
    methods: {
      commentHandle(scoreType, n) {
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
              name: 'scoreTypeGrade1186',
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
        Api.grading(reqBody).then((res) => {
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
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';

  .star-box {
    @include flex;

    .star {
      width: rem(18);
      height: rem(18);
      margin-right: rem(5);
      font-size: rem(18);
      color: #9f9f9f;

      &.active {
        color: #f4ea2a;
      }

      &:hover {
        color: #f4ea2a;
      }
    }
  }
</style>
