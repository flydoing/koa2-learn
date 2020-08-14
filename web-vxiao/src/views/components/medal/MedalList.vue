<template>
  <div class="medal-list"
       @click="handle">
    <div v-for="(item,i) in list"
         :key="i"
         :item="item"
         class="ml-item">
      <div class="md-dimension">
        <div>
          {{item.name}}
          <label v-if="item.description == '2'"
                 class="remark">&nbsp;NFC手机刷学生卡即可极速颁发，默认颁发第一个勋章</label>
        </div>
      </div>
      <div class="md-content">
        <Medal v-for="(medal,j) in item.childs"
               :key="j"
               :medal="medal"
               v-on:remove="medalRemove(item, medal, j, i)"
               v-on:edit="medalEdit(item, medal, j, i)"
               :isRemove="item.isRemove"></Medal>
        <div v-if="!item.isRemove && isDefault"
             class="md-btn-add"
             v-lazy:background-image="addIcon"
             :style="imageStyle(addIcon)"
             @click.stop="medalAdd(item, i)"></div>
        <div v-if="!item.isRemove && isDefault && item.childs"
             class="md-btn-remove"
             v-lazy:background-image="removeIcon"
             :style="imageStyle(removeIcon)"
             @click.stop="handleRemove(item)"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Check from '@/utils/check'

  export default {
    name: 'MedalList',
    props: {
      list: { type: [Array] },
      editHandle: { type: [Function] },
      removeHandle: { type: [Function] },
      isRemove: false,
      mode: { type: [String] }
    },
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
    },
    data() {
      return {
        addIcon: require('images/ico/ico_medal_add.png'),
        removeIcon: require('images/ico/ico_medal_remove.png')
      }
    },
    created() {},
    computed: {
      isDefault() {
        return this.mode === 'default'
      }
    },
    methods: {
      handle() {
        this.refreshList()
      },
      refreshList() {
        if (Check.isArray(this.list)) {
          this.list.map(function(it) {
            it.isRemove = false
            return it
          })
        }
      },
      handleRemove(item) {
        this.list.map(function(it) {
          if (it.id === item.id) {
            it.isRemove = true
          }
          return it
        })
      },
      medalEdit(item, medal, index, pIndex) {
        if (Check.isFunction(this.editHandle)) {
          this.editHandle(item, medal, index, pIndex)
        }
      },
      medalAdd(item, index) {
        this.$emit('add', item, index)
      },
      medalRemove(item, medal, index, pIndex) {
        if (Check.isFunction(this.removeHandle)) {
          this.removeHandle(item, medal, index, pIndex)
        }
      }
    }
  }
</script>
<style lang="scss">
  .medal-list {
    padding-bottom: rem(20);
    display: block;
    .ml-item {
      display: block;
      width: 100%;
      margin-top: rem(8);
      .md-dimension {
        display: block;
        padding-left: rem(18);
        height: rem(30);
        line-height: rem(30);
        position: relative;
        &:before {
          width: rem(8);
          height: rem(30);
          background: #ededed;
          position: absolute;
          left: 0;
          top: 0;
          content: ' ';
        }
        .remark {
          color: #999;
          font-size: rem(13);
        }
      }
      .md-content {
        @extend %clearfix;
      }
      .md-btn-add,
      .md-btn-remove {
        padding-top: 0;
        border: rem(1) solid #ddd;
        height: rem(126);
        width: rem(120);
        float: left;
        margin: rem(8) rem(8) 0 0;
        cursor: pointer;
        border-radius: rem(8);
        position: relative;
      }
    }
  }
</style>
