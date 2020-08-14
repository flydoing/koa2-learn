<template>
  <Card :message="msg"
        @more="handleMore">
    <CardDown slot="down"
              :m="msg"
              v-if="!msg.isInterface">
      <el-dropdown-item v-if="(isAdmin || isTeacher) && msg.extension !== '1'"
                        @click.native.stop="handleRecommend">推荐到班牌</el-dropdown-item>
    </CardDown>
    <div slot="contents"
         class="card-medals">
      <template v-if="mds.length>3">
        <div v-for="(row,i) in colMedals"
             :key="i"
             :row="row">
          <template v-for="(medal,j) in row">
            <template v-if="mds.length>9 && i+1==3 && j+1==3 && !showMore">
              <div :key="j"
                   class="more-medal"
                   @click="showMore = true">
                <i class="ico ico-plus"></i><span v-html="mds.length"></span>
              </div>
            </template>
            <template v-else>
              <Medal2 :key="j"
                      :medal="medal"
                      @click="handleMedal(medal)"></Medal2>
            </template>
          </template>
        </div>
      </template>
      <template v-else>
        <div v-for="(medal,i) in mds"
             :key="i"
             :medal="medal">
          <Medal1 :medal="medal"
                  @click="handleMedal(medal)"></Medal1>
        </div>
      </template>
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
        showMore: false,
        msg: this.message
      }
    },
    components: {
      Medal1: resolve => require(['@/views/components/medal/Medal1'], resolve),
      Medal2: resolve => require(['@/views/components/medal/Medal2'], resolve),
      MedalInfo: resolve => require(['@/views/components/medal/Info'], resolve)
    },
    computed: {
      mds() {
        let _m = this.msg
        let json = _m.extensionType ? JSON.parse(_m.extensionType) : {}
        if (!Check.isNullObject(json)) {
          return json.datas
        }
        return []
      },
      colMedals() {
        let datas = []
        let cols = []
        if (Check.isRealArray(this.mds)) {
          this.mds.forEach((v, i) => {
            if (i % 3 === 0) {
              cols = [v]
              datas.push(cols)
            } else {
              cols.push(v)
            }
          })
        }
        if (this.showMore) {
          return datas
        }
        return datas.length > 3 ? datas.slice(0, 3) : datas
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
      handleRecommend() {
        let m = { ...this.msg, extension: '1' }
        this.modifyMessage(m).then(res => {
          this.$set(this, 'msg', m)
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleAddContent() {
        this.routePushModel({
          name: 'addContent1005',
          params: { msgId: this.msg.id }
        })
      },
      handleMore() {
        this.$emit('more')
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
