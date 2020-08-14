<template>
  <page title="选择模板"
        @submit="handleSubmit"
        hasSubmit
        :wth="664">
    <item :hasClick="false">
      <div slot="main">字体颜色</div>
      <div slot="remark">
        <div class="word-color">
          <i v-for="(item, i) in colors"
             :key="i"
             :style="{'background':item.value}"
             :class="{'active': item.active}"
             @click="handleColor(item, i)"></i>
        </div>
      </div>
    </item>
    <item :hasClick="false">
      <div slot="main">字体大小</div>
      <div slot="remark">
        <div class="word-size">
          <i v-for="(item, i) in sizes"
             :key="i"
             :style="{'font-size':item.value}"
             :class="{'active': item.active}"
             @click="handleSize(item, i)">A</i>
        </div>
      </div>
    </item>
    <div class="template-list">
      <div v-for="(item, i) in list"
           :key="i"
           class="tl-item"
           @click="handleTemplate(item)">
        <div class="tl-content"
             v-html="item.content"
             :style="{'background':getBg(item),'color':item.color}"></div>
        <div class="tl-title">
          <label v-html="item.name"></label>
          <i class="ico ico-select"
             :class="{'active':item.selected}"></i>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CatgeoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        colors: [{ value: '#000000', active: true }, { value: '#beff97', active: false }, { value: '#fff001', active: false }, { value: '#2b57c1', active: false }, { value: '#FFFFFF', active: false }],
        sizes: [
          { value: '24px', size: 52, active: true },
          { value: '22px', size: 48, active: false },
          { value: '20px', size: 42, active: false },
          { value: '18px', size: 38, active: false },
          { value: '16px', size: 32, active: false },
          { value: '14px', size: 28, active: false }
        ]
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        vscreen: 'getCreateObject'
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        let cnt = this.vscreen.content
        let tmp = this.vscreen.template
        CatgeoryApi.getCategorysByType('126').then(res => {
          res.categorys.forEach((v, i) => {
            v.content = cnt
            if (tmp) {
              v.selected = tmp.id === v.id
              v.color = tmp.fontColor
              v.size = tmp.size
              v.fontSize = tmp.fontSize
            } else {
              v.selected = i === 0
              v.color = this.colors[0].value
              v.size = this.sizes[0].size
              v.fontSize = this.sizes[0].value
            }
            this.list.push(v)
          })
        })

        if (tmp) {
          this.colors = this.colors.map(v => {
            v.active = tmp.fontColor === v.value
            return v
          })
          this.sizes = this.sizes.map(v => {
            v.active = tmp.size === v.size
            return v
          })
        }
      },
      getBg(item) {
        if (item.logo) {
          return `url('${this.url(item.logo)}') no-repeat center/cover`
        }
        return item.value
      },
      handleColor(item, index) {
        this.colors = this.colors.map(v => {
          if (item.value === v.value) {
            v.active = true
          } else {
            v.active = false
          }
          return v
        })
        this.list = this.list.map(v => {
          v.color = item.value
          return v
        })
      },
      handleSize(item, index) {
        this.sizes = this.sizes.map(v => {
          if (item.value === v.value) {
            v.active = true
          } else {
            v.active = false
          }
          return v
        })
        this.list = this.list.map(v => {
          v.size = item.size
          v.fontSize = item.value
          return v
        })
      },
      handleTemplate(item) {
        this.list = this.list.map(v => {
          if (item.id === v.id) {
            v.selected = true
          } else {
            v.selected = false
          }
          return v
        })
      },
      handleSubmit() {
        let tmp = this.list.filter(v => {
          return v.selected
        })[0]
        if (tmp) {
          this.setCreateObject({
            template: {
              id: tmp.id,
              name: tmp.name,
              size: tmp.size,
              backgroundImg: tmp.logo,
              backgroundColor: tmp.value,
              fontColor: tmp.color,
              fontSize: tmp.fontSize
            }
          })
        }
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .word-color {
    i {
      display: inline-block;
      margin-left: rem(10);
      width: rem(20);
      height: rem(20);
      border-radius: rem(20);
      cursor: pointer;
      vertical-align: middle;
      font-style: normal;
      transition: all ease-out 0.3s;
      border: rem(1) solid #ebebeb;
      &.active {
        width: rem(30);
        height: rem(30);
      }
    }
  }

  .word-size {
    i {
      display: inline-block;
      margin-left: rem(15);
      cursor: pointer;
      vertical-align: middle;
      color: #444;
      font-style: normal;
      &.active {
        @include fc;
      }
    }
  }

  .template-list {
    @extend %clearfix;
    .tl-item {
      position: relative;
      background: #fff;
      border: rem(1) solid #dcdcdc;
      width: rem(208);
      float: left;
      margin-left: rem(10);
      margin-top: rem(10);
      cursor: pointer;
      .tl-content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        padding: rem(6);
        text-align: justify;
        min-height: rem(89);
      }
      .tl-title {
        padding-left: rem(5);
        line-height: rem(40);
        height: rem(40);
        border-top: rem(1) solid #dcdcdc;
        position: relative;
        i {
          position: absolute;
          right: rem(5);
          top: 50%;
          margin-top: rem(-11);
        }
      }
    }
  }
</style>
