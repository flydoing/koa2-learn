<template>
  <Page :title="title"
        listenBack
        @back="back">
    <label slot="btn"
           @click="submit">{{ active=== 0 ? '下一步':'提交'}}</label>
    <template v-if="active===0">
      <div class="category-title text">{{isClass?'班徽':'校徽'}}</div>
      <div style="padding:10px;">
        <el-upload :action="uploadURL"
                   list-type="picture-card"
                   :on-success="onSuccess"
                   :file-list="fileList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div class="category-title text">{{isClass ? '班训':'校训'}}</div>
      <TextInput placeholder="必填"
                 :max="200"
                 v-model="visualize.motto" />
    </template>
    <template v-if="active===1">
      <Item>
        <div>文字颜色</div>
        <div slot="remark"
             class="font-block">
          <div class="font-color"
               :class="{'active':color===visualize.fontColor}"
               v-for="(color,i) in fontColors"
               :key="i"
               :style="prefixFontColor(color)"
               @click="$set(visualize,'fontColor',color)"></div>
        </div>
      </Item>
      <Item>
        <div>字体大小</div>
        <div slot="remark"
             class="font-block">
          <div class="font-size"
               :class="{'active':size===visualize.fontSize}"
               v-for="(size,i) in fontSizes"
               :key="i"
               :style="prefixFontSize(size)"
               @click="$set(visualize,'fontSize',size)">A</div>
        </div>
      </Item>
      <div class="vs-templets">
        <!-- 左校徽，右校训 -->
        <div class="vs-templet"
             :class="{'active':visualize.template==='1'}"
             @click="$set(visualize,'template','1')">
          <div class="tx">
            <img class="avatar"
                 v-lazy="{src:url(visualize.logo,'thumb')}" />
            <div :style="prefix">{{visualize.motto}}</div>
          </div>
          <img class="bg"
               v-lazy="{src:url(visualize.templateBackground,'thumb')}" />
          <div class="text">{{isClass?'左班徽，右班训':'左校徽，右校训'}}左校徽，右校训</div>
          <i class="ico ico-select active"></i>
        </div>
        <!-- 左校训，右校徽 -->
        <div class="vs-templet"
             :class="{'active':visualize.template==='2'}"
             @click="$set(visualize,'template','2')">
          <div class="tx">
            <div :style="prefix">{{visualize.motto}}</div>
            <img class="avatar"
                 v-lazy="{src:url(visualize.logo,'thumb')}" />
          </div>
          <img class="bg"
               v-lazy="{src:url(visualize.templateBackground,'thumb')}" />
          <div class="text">{{isClass?'左班训，右班徽':'左校训，右校徽'}}</div>
          <i class="ico ico-select active"></i>
        </div>
        <!-- 上校徽，下校训 -->
        <div class="vs-templet"
             :class="{'active':visualize.template==='3'}"
             @click="$set(visualize,'template','3')">
          <div class="tx top">
            <img class="avatar"
                 v-lazy="{src:url(visualize.logo,'thumb')}" />
            <div :style="prefix">{{visualize.motto}}</div>
          </div>
          <img class="bg"
               v-lazy="{src:url(visualize.templateBackground,'thumb')}" />
          <div class="text">{{isClass?'上班徽，下班训':'左校训，右校徽'}}</div>
          <i class="ico ico-select active"></i>
        </div>
        <!-- 上校训，下校徽 -->
        <div class="vs-templet"
             :class="{'active':visualize.template==='4'}"
             @click="$set(visualize,'template','4')">
          <div class="tx bottom">
            <div :style="prefix">{{visualize.motto}}</div>
            <img class="avatar"
                 v-lazy="{src:url(visualize.logo,'thumb')}" />
          </div>
          <img class="bg"
               v-lazy="{src:url(visualize.templateBackground,'thumb')}" />
          <div class="text">{{isClass?'上班训，下班徽':'上校训，下校徽'}}上校训，下校徽</div>
          <i class="ico ico-select active"></i>
        </div>
      </div>
    </template>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  export default {
    mixins: [R],
    components: {
      TextInput: resolve => require(['@/components/TextInput'], resolve)
    },
    data() {
      return {
        active: 0,
        title: '',
        fontColors: ['#000000', '#beff97', '#fff001', '#2b57c1', '#FFFFFF'],
        fontSizes: ['24', '22', '20', '18', '16', '14'],
        visualize: {},
        fileList: []
      }
    },
    computed: {
      prefix() {
        return {
          color: this.visualize.fontColor,
          'font-size': `${this.visualize.fontSize}px`
        }
      }
    },
    created() {
      this.title = this.isClass ? '班训班徽' : '校训校徽'
      Api.getBannar(this.groupId).then(res => {
        let _v = res.visualize || {}
        this.visualize = {
          fontColor: '#000000',
          fontSize: '24',
          groupId: this.groupId,
          logo: '',
          motto: '',
          schoolId: this.currentGroup.parentId,
          template: '',
          templateBackground: '',
          ..._v
        }
        this.fileList = [
          {
            url: this.url(this.visualize.logo, 'thumb')
          }
        ]
      })
    },
    methods: {
      back() {
        if (this.active === 0) {
          this.routeBack()
          return
        }
        this.active--
      },
      submit() {
        if (this.active === 1) {
          Api.setBannar({ visualize: this.visualize }).then(res => {
            this.$message({ type: 'success', message: '修改成功' })
            this.routeBack()
          })
        }
        this.active++
      },
      onSuccess(res) {
        this.$set(this.visualize, 'logo', res.file.id)
      },
      prefixFontSize(size) {
        return { 'font-size': `${size}px` }
      },
      prefixFontColor(color) {
        return { 'background-color': `${color}` }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/_mixin';
  .font {
    &-block {
      @include flex;
      @include ai;
      @include jc(space-between);
    }
    &-color {
      width: rem(20);
      height: rem(20);
      border-radius: 50%;
      border: $border;
      &.active {
        width: rem(30);
        height: rem(30);
      }
    }
    &-size,
    &-color {
      margin: 0 rem(10);
      &.active {
        @include fc;
      }
    }
  }

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
          background: rgba(255, 255, 255, 0.3);
        }
      }
      .tx {
        width: 100%;
        height: rem(160);
        position: absolute;
        @include flex;
        @include ai;
        @include jc;
        &.top,
        &.bottom {
          @include fd;
        }
        div {
          width: 60%;
          padding: 0 rem(10);
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
      .bg {
        width: rem(190+100);
      }
      .text {
        text-align: center;
        line-height: rem(40);
        background: nth($background, 2);
      }
    }
  }
</style>
