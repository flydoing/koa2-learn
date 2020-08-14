<template>
  <Card :message="msg">
    <div slot="contents"
         class="card-medals"
         v-if="md.count>3">
      <div v-for="(row,i) in md.datas"
           :key="i"
           :row="row">
        <template v-if="i < 3">
          <template v-for="(medal,j) in row">
            <template v-if="md.count > 9 && i+1 === 3 && j+1 === 3">
              <div :key="j"
                   class="more-medal"
                   @click="showMedalList = true">
                <i class="ico ico-plus"></i><span v-html="md.count"></span>
              </div>
            </template>
            <template v-else>
              <Medal2 :key="j"
                      :medal="medal"
                      @click="handleMedal(medal)"></Medal2>
            </template>
          </template>
        </template>
      </div>
    </div>
    <div slot="contents"
         class="card-medals"
         v-else>
      <div v-for="(medal,i) in md.datas[0]"
           :key="i"
           :medal="medal">
        <Medal1 :medal="medal"
                @click="handleMedal(medal)"></Medal1>
      </div>
    </div>
    <template slot="images"></template>
    <CardHref slot="href"
              v-if="button"
              :content="button.text"
              @click="button.handle" />
    <MedalInfo slot="other"
               :show.sync="showMedalInfo"
               v-if="medalData"
               :medal="medalData" />
  </Card>
</template>
<script>
  import Check from '@/utils/check'
  import CardMixin from '@/views/components/card/mixin'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        showMedalInfo: false,
        medalData: null,
        showAddContent: false,
        showMedalList: false,
        mCount: 0,
        msg: this.message
      }
    },
    components: {
      Medal1: resolve => require(['@/views/components/medal/Medal1'], resolve),
      Medal2: resolve => require(['@/views/components/medal/Medal2'], resolve),
      MedalInfo: resolve => require(['@/views/components/medal/Info'], resolve)
    },
    computed: {
      md() {
        let _m = this.msg
        try {
          let json = JSON.parse(_m.extensionType)
          if (!Check.isNullObject(json)) {
            let mds = []
            let cols = []
            json.datas.forEach((v, i) => {
              if (i % 3 === 0) {
                cols = [v]
                mds.push(cols)
              } else {
                cols.push(v)
              }
            })
            return {
              datas: mds,
              count: json.datas.length,
              list: json.datas
            }
          }
          return false
        } catch (e) {}
        return false
      },
      button() {
        let _m = this.msg
        let isAdd = _m.msgJson ? JSON.parse(_m.msgJson).isAddContent : false
        if (!isAdd && _m.fromUserId === this.$store.state.USERID) {
          return {
            text: '添加评价内容',
            handle: this.handleAddContent
          }
        }
        return false
      }
    },
    methods: {
      handleMedal(md) {
        this.showMedalInfo = true
        this.medalData = md
      },
      handleAddContent() {
        this.routePushModel({
          name: 'addContent1264',
          params: { msgId: this.msg.id }
        })
      }
    },
    watch: {
      message(v) {
        this.msg = v
      }
    }
  }
</script>
<style lang="scss">
  .card-medals {
    display: block;
    padding-top: rem(5);

    & > div {
      display: block;
      width: 100%;
      @extend %clearfix;
    }

    img.m-img {
      width: rem(100);
      height: rem(100);
      margin: 0 rem(5) rem(5) 0;
      float: left;
      cursor: pointer;
      border: rem(1) solid #f3f3f3;
    }

    .more-medal {
      width: rem(100);
      height: rem(100);
      border: rem(1) solid #ededed;
      margin: 0 rem(5) 0 0;
      float: left;
      text-align: center;
      cursor: pointer;

      &:before {
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        content: '';
      }

      span {
        @include fc;
        font-size: rem(28);
        height: rem(28);
        line-height: rem(28);
        vertical-align: middle;
      }
    }
  }
</style>
