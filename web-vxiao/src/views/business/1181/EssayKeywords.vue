<template>
  <page title="关键字"
        hasSubmit
        @submit="handleSubmit">
    <div class="keywords">
      <item :hasClick="false"
            class="full-input">
        <input type="text"
               placeholder="输入关键字"
               v-model="keyword"
               @keyup.enter="handleEnter">
      </item>
      <div class="keywords-searchs"
           v-if="searchKeywords.length>0">
        <item v-for="(searchKey, i) in searchKeywords"
              :key="i"
              @click="itemClick(searchKey)">
          <div>{{searchKey}}</div>
        </item>
      </div>
      <div class="category-title"
           v-if="selectedKeywords.length>0">已选关键字</div>
      <div class="keywords-selected"
           v-if="selectedKeywords.length>0">
        <div class="item"
             v-for="(selectedKey, j) in selectedKeywords"
             :key="j"
             @click="deleteKeyword(j, selectedKey)">
          {{selectedKey}}
        </div>
      </div>
      <div class="category-title"
           v-if="historyKeywords.length>0">历史关键字</div>
      <div class="keywords-history"
           v-if="historyKeywords.length>0">
        <div class="item"
             v-for="(selectedKey, j) in historyKeywords"
             :key="j"
             @click="addKeyword($event, selectedKey)"
             :class="{'active': isInclude(selectedKey)}">
          {{selectedKey}}
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  import ArrayUtils from '@/utils/array'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
      return {
        keyword: '',
        historyKeywords: [],
        selectedKeywords: [],
        searchKeywords: []
      }
    },
    computed: {
      ...mapGetters({
        cacheEssay: 'getEssayCreate'
      })
    },
    created() {
      if (Check.isRealArray(this.cacheEssay.keywords)) {
        this.selectedKeywords = [...this.cacheEssay.keywords]
      }
      Api.getKeywords().then(res => {
        this.historyKeywords = [...res.keyWords]
      })
    },
    methods: {
      ...mapActions(['saveEssayCreate']),
      handleSubmit() {
        this.saveEssayCreate({
          keywords: this.selectedKeywords
        })
        this.routeBack()
      },
      deleteKeyword(j, key) {
        this.selectedKeywords.splice(j, 1)
      },
      addKeyword(event, key) {
        if (!ArrayUtils.contains(this.selectedKeywords, key)) {
          this.selectedKeywords.push(key)
        } else {
          this.selectedKeywords.forEach((text, t) => {
            if (text === key) {
              this.selectedKeywords.splice(t, 1)
            }
          })
        }
      },
      isInclude(key) {
        return ArrayUtils.contains(this.selectedKeywords, key)
      },
      itemClick(key) {
        this.searchKeywords = []
        this.selectedKeywords.push(key)
      },
      handleEnter() {
        if (!ArrayUtils.contains(this.selectedKeywords, this.keyword) && !Check.isNullString(this.keyword.trim())) {
          this.selectedKeywords.push(this.keyword)
          this.searchKeywords = []
        }
        this.keyword = ''
      }
    },
    watch: {
      keyword(v) {
        if (!Check.isNullString(v.trim())) {
          Api.getKeywords(v).then(res => {
            this.searchKeywords = [...res.keyWords]
            this.keyword = ''
          })
        } else {
          this.searchKeywords = []
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .keywords {
    &-selected,
    &-history {
      @include flex;
      flex-wrap: wrap;
      .item {
        padding: rem(4) rem(8);
        border: 1px solid #cacaca;
        margin: rem(8) rem(8) 0;
        color: #9f9f9f;
        border-radius: rem(5);
        cursor: pointer;
        &.active {
          @include fc;
          @include borderColor(3);
          border-radius: rem(5);
        }
      }
    }
    &-selected {
      .item {
        @include fc;
        @include borderColor(3);
        margin-bottom: rem(8);
        border-radius: rem(5);
      }
    }
  }
</style>
