<template>
  <page title="选择奖品"
        @submit="handleSubmit"
        hasSubmit>
    <div class="score"
         v-html="scoreTxt"></div>
    <div class="prize-list">
      <div class="pl-item"
           v-for="(item,i) in list"
           :key="i"
           :item="item"
           @click="handleItem(item)">
        <i v-if="item.selected"
           class="ico ico-select active" />
        <img :src="Image.IMG_EMPTY"
             v-lazy:background-image="url(item.logo)"
             :style="imageStyle(url(item.logo))" />
        <div class="name"
             v-html="item.name"></div>
        <div class="count">需{{item.integral}}分，剩{{item.count || 0}}</div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    props: {},
    components: {},
    data() {
      return {
        list: [],
        score: null,
        amount: 1
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        prize: 'getPrize'
      }),
      scoreTxt() {
        if (this.prize.user && this.score) {
          return `${this.prize.user.name}剩余${this.score.remainScore}分`
        }
        return ''
      }
    },
    methods: {
      ...mapActions(['setPrize']),
      fetchData() {
        const that = this
        let user = this.prize.user
        if (user) {
          Api.getPrizeList(that.currentGroup.parentId, that.groupId, user.userId).then(res => {
            if (Check.isRealArray(res.prizes)) {
              that.list = res.prizes.map(c => {
                c.selected = false
                return c
              })
            }
            that.score = res.userScore
          })
        }
      },
      handleItem(item) {
        this.list = this.list.map(v => {
          v.selected = v.id === item.id
          return v
        })
      },
      handleSubmit() {
        const that = this
        let user = that.prize.user
        let data = that.list.filter(v => {
          return v.selected
        })[0]
        if (Check.isNullObject(data)) {
          that.$message({ message: '请选择兑换奖品', type: 'warning' })
          return false
        }

        if (Check.isNullString(that.amount)) {
          that.$message({ message: '请输入兑换数量', type: 'warning' })
          return false
        }

        if (!Check.isNumber(that.amount) || !/^[0-9]*[1-9][0-9]*$/.test(that.amount)) {
          that.$message({ message: '请输入整数数量', type: 'warning' })
          return false
        }
        if (parseInt(that.amount) * data.integral > that.score.remainScore) {
          that.$message({ message: '积分不足', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1141',
          groupId: that.groupId,
          msgJson: JSON.stringify({
            count: that.amount,
            groupId: that.groupId,
            userId: user.userId,
            prizeId: data.id
          }),
          toUsers: [
            {
              userId: user.userId,
              name: user.name,
              avatar: user.avatar,
              type: 'to'
            }
          ]
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack(-2)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .score {
    text-align: center;
    line-height: rem(30);
    height: rem(30);
    border-bottom: $border;
  }
  .prize-list {
    display: block;
    width: 100%;
    overflow: hidden;
    .pl-item {
      display: inline-block;
      margin: rem(15) rem(2) 0 rem(13);
      vertical-align: middle;
      width: rem(126);
      position: relative;
      cursor: pointer;
      img {
        width: rem(126);
        height: rem(80);
        border: $border;
      }
      .name,
      .count {
        text-align: center;
      }
      .name {
        margin-top: rem(10);
      }
      .ico-select {
        position: absolute;
        right: 0;
        top: 0;
        background: #fff;
        border-radius: rem(22);
      }
    }
  }
</style>
