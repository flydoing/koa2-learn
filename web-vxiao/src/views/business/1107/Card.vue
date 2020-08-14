<template>
  <Card :message="message">
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
                      :medal="medal"></Medal2>
            </template>
          </template>
        </div>
      </template>
      <template v-else>
        <div v-for="(medal,i) in mds"
             :key="i"
             :medal="medal">
          <Medal1 :medal="medal"></Medal1>
        </div>
      </template>
    </div>
    <CardHref v-if="!hasUser"
              content="相关成员"
              @click="handleUser" />
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
    components: {
      Medal1: resolve => require(['@/views/components/medal/Medal1'], resolve),
      Medal2: resolve => require(['@/views/components/medal/Medal2'], resolve)
    },
    data() {
      return {
        showMore: false
      }
    },
    computed: {
      mds() {
        let _m = this.message
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
      hasUser() {
        return Check.isRealArray(this.message.toUsers)
      }
    },
    methods: {
      handleUser() {
        this.routePush({
          name: 'selectMember1107',
          query: {
            msgId: this.message.id,
            groupId: this.message.groupId
          }
        })
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
