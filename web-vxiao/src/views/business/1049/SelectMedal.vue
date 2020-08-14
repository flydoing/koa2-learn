<template>
  <page title="选择勋章"
        hasSubmit
        @submit="handleSubmit">
    <div class="pd">
      <div class="medal-list">
        <div v-for="(item,i) in list"
             :key="i"
             :item="item"
             class="ml-item">
          <div class="md-dimension"
               v-html="item.name"></div>
          <div class="md-content">
            <div class="md-block"
                 :class="{'active':medal.active}"
                 v-for="(medal,j) in item.childs"
                 :key="j"
                 :medal="medal"
                 @click="medalClick(item, medal, j, i)">
              <Medal :medal="medal"></Medal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api1005 from '@/views/business/1005/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      fetchData() {
        const that = this
        let mMap = new Map()
        if (Check.isRealArray(this.rating.medals)) {
          this.rating.medals.map(v => {
            mMap.set(v.id, v)
          })
        }
        Api1005.loadSpeedMedalData(that.currentGroup.groupId).then(res => {
          that.list = res.categorys.map(v => {
            v.childs = v.childs.map(c => {
              c.active = Check.isObject(mMap.get(c.id))
              return c
            })
            return v
          })
        })
      },
      medalClick(dimension, medal, index, pIndex) {
        medal.active = !medal.active
        this.$set(this.list[pIndex].childs, index, medal)
      },
      handleSubmit() {
        let medals = []
        this.list.forEach(v => {
          let ms = v.childs.filter(c => {
            return c.active
          })
          medals.push(...ms)
        })
        this.setRating({ medals: medals })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .medal-list {
    padding-bottom: rem(20);
    display: block;

    .ml-item {
      display: block;
      width: 100%;

      .md-dimension {
        padding-left: rem(18);
        display: block;
        position: relative;

        &:before {
          width: rem(8);
          height: rem(30);
          background: #ededed;
          position: absolute;
          left: 0;
          top: 50%;
          margin-top: rem(-15);
          content: ' ';
        }
      }

      .md-content {
        @extend %clearfix;

        .md-block {
          margin: rem(8) rem(8) 0 0;
          position: relative;
          float: left;
          cursor: pointer;

          &:after {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 0;
            z-index: 998;
            border-radius: rem(8);
            background: #000;
            opacity: 0.5;
            filter: alpha(opacity=50);
            content: ' ';
            left: 0;
            transition: all ease 0.3s;
            box-sizing: border-box;
          }

          &:hover:after {
            height: 100%;
          }

          &.active:after {
            background: url('~images/ico/icon_choose.png') no-repeat;
            background-size: 100% 100%;
            opacity: 1;
            height: 100%;
          }

          .medal-03 {
            margin: 0;
          }
        }
      }
    }
  }
</style>
