<template>
  <page title="评语"
        @submit="handleSubmit"
        hasSubmit
        :showTips="list.length === 0">
    <item @click="handleAll"
          label="全选"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
    </item>
    <div class="category-title"></div>
    <div class="comment-list">
      <div class="cl-item"
           v-for="(item, i) in list"
           :key="i"
           @click="handleSelect(item)">
        <i class="ico ico-select"
           :class="{'active': item.selected}"></i>
        <div class="cl-content"
             v-html="contentTxt(item)"></div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        list: []
      }
    },
    computed: {
      all() {
        let datas = this.list.filter(v => {
          return v.selected
        })
        return this.list.length > 0 && datas.length === this.list.length
      }
    },
    created() {
      Api.getComments(this.groupId, this.routeQuery('userId')).then(res => {
        if (res.comments) {
          this.list = res.comments.map(v => {
            return { ...v, selected: false }
          })
        }
      })
    },
    methods: {
      ...mapActions(['setCreateObject']),
      contentTxt(item) {
        return `${item.fromUserName}：${this.converContent(item.content)}`
      },
      handleSelect(item) {
        item.selected = !item.selected
      },
      handleAll() {
        let all = this.all
        this.list = this.list.map(v => {
          v.selected = !all
          return v
        })
      },
      handleSubmit() {
        let comments = this.list.filter(v => {
          return v.selected
        })
        this.setCreateObject({ comments: comments })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .comment-list {
    .cl-item {
      padding: rem(10) rem(10) rem(10) rem(42);
      font-size: rem(14);
      color: nth($font-color, 1);
      border-bottom: rem(1) solid #ebebeb;
      position: relative;
      cursor: pointer;
      .cl-content {
        text-align: justify;
        line-height: rem(22);
      }
      .ico-select {
        position: absolute;
        left: rem(10);
        top: 50%;
        margin-top: rem(-11);
      }
    }
  }
</style>
