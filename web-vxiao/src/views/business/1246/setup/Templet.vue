<template>
  <Page title="模板设置" listenBack @back="back">
    <label slot="btn" @click="next">{{active===2?'完成':'下一步'}}</label>
    <el-steps :active="active" simple slot="top">
      <el-step title="选择模板" icon="el-icon-tickets"></el-step>
      <el-step title="选择风格" icon="el-icon-news"></el-step>
      <el-step title="选择背景" icon="el-icon-picture-outline"></el-step>
    </el-steps>
    <div class="vs-templets">
      <template v-if="active===0">
        <div :class="prefixCss(templet,'templetId')" v-for="(templet,i) in templets" :key="i" @click="handle(templet,'templetId')">
          <img v-lazy="{src:url(templet.logo,'thumb')}" />
          <div>{{templet.name}}</div>
          <i class="ico ico-select active"></i>
        </div>
      </template>
      <template v-if="active===1">
        <div :class="prefixCss(style,'styleId')" v-for="(style,i) in styles" :key="i" @click="handle(style,'styleId')">
          <img v-lazy="{src:url(style.logo,'thumb')}" />
          <div>{{style.name}}</div>
          <i class="ico ico-select active"></i>
        </div>
      </template>
      <template v-if="active===2">
        <div :class="prefixCss(background,'backgroundId')" v-for="(background,i) in backgrounds" :key="i" @click="handle(background,'backgroundId')">
          <img v-lazy="{src:url(background.logo,'thumb')}" />
          <div>{{background.name}}</div>
          <i class="ico ico-select active"></i>
        </div>
      </template>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        active: 0,
        categorys: {},
        schoolTemplet: {
          backgroundId: '',
          categoryId: '',
          schoolId: '',
          styleId: '',
          templetId: ''
        }
      }
    },
    computed: {
      styles() { return this.categorys[129] },
      templets() { return this.categorys[128] },
      backgrounds() { return this.categorys[158] }
    },
    created() {
      this.getCategories(128)
      this.schoolTemplet = this.getStorage('_cache_templets') || {}
    },
    methods: {
      getCategories(type) {
        Api.getTempletCategorys(this.currentGroup.parentId, this.routeQuery('id'), type).then(res => {
          this.$set(this.categorys, type, res.categories)
        })
      },
      next() {
        if (this.active === 2) {
          Api.modifyTemplet({ schoolTemplet: this.schoolTemplet }).then(res => {
            this.$message({ type: 'success', message: '设置成功' })
            this.routeBack()
          }).catch(res => {})
          return
        }
        ++this.active
        this.getCategories(this.active === 1 ? 129 : 158)
      },
      back() {
        this.active === 0 ? this.routeBack() : --this.active
      },
      handle(templet, type) {
        this.$set(this.schoolTemplet, type, templet.id)
      },
      prefixCss(t, type) {
        return [`vs-templet`, {
          [`active`]: t.id === this.schoolTemplet[type]
        }]
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "~scss/_mixin";
  .vs {
    &-templets {
      padding: rem(15);
      width: 100%;
      @include flex;
      @include jc(space-between);
      @include ai(flex-start);
      @include wrap;
    }
    &-templet {
      margin-bottom: rem(15);
      position: relative;
      cursor: pointer;
      &:hover {
        @include after(0, 0) {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, .3);
        }
      }
      .ico {
        display: none;
        position: absolute;
        bottom: rem(10);
        right: rem(10);
      }
      &.active {
        .ico {
          display: block;
        }
      }
      img {
        width: rem(190);
        height: rem(160);
      }
      &>div {
        text-align: center;
        line-height: rem(40);
        background: nth($background, 2);
      }
    }
  }

</style>
