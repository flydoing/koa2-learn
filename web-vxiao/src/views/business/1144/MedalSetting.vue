<template>
  <page title="奖章设置"
        @add="handleAddDim"
        :hasAdd="true">
    <div class="pd">
      <div class="medal-list"
           @click="handle">
        <div v-for="(item,i) in list"
             :key="i"
             :item="item"
             class="ml-item">
          <div class="md-dimension">
            <label v-html="item.name"></label>
            <label class="edit text-color"
                   @click="handleEditDim(item)">编辑</label>
          </div>
          <div class="md-content">
            <Medal v-for="(medal,j) in item.childs"
                   :key="j"
                   :medal="medal"
                   @remove="handleRemove(item, medal, j, i)"
                   @edit="handleEdit(item, medal, j, i)"
                   :isRemove="item.isRemove"></Medal>
            <div v-if="!item.isRemove"
                 class="md-btn-add"
                 v-lazy:background-image="addIcon"
                 :style="imageStyle(addIcon)"
                 @click.stop="handleAdd(item, i)"></div>
            <div v-if="!item.isRemove && item.childs"
                 class="md-btn-remove"
                 v-lazy:background-image="removeIcon"
                 :style="imageStyle(removeIcon)"
                 @click.stop="handleRemoveState(item)"></div>
          </div>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        addIcon: require('images/ico/ico_medal_add.png'),
        removeIcon: require('images/ico/ico_medal_remove.png')
      }
    },
    created() {
      Api.loadMedalList(this.currentGroup.groupId).then(res => {
        this.list = res.categorys.map(v => {
          v.isRemove = false
          if (v.childs) {
            v.childs = v.childs.map(c => {
              c.score = c.value
              c.value = c.value > 0 ? `+${c.value}分` : `${c.value}分`
              return c
            })
          }
          return v
        })
      })
    },
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
    },
    computed: {
      ...mapGetters({
        classMedal: 'getClassMedal'
      })
    },
    methods: {
      ...mapActions(['setClassMedal']),
      handle() {
        this.refreshList()
      },
      refreshList() {
        if (Check.isArray(this.list)) {
          this.list = this.list.map(it => {
            it.isRemove = false
            return it
          })
        }
      },
      handleRemoveState(item) {
        this.list = this.list.map(it => {
          if (it.id === item.id) {
            it.isRemove = true
          }
          return it
        })
      },
      handleAdd(dimension, index) {
        this.setClassMedal({ dimension: dimension, cache: null, medal: null })
        this.routePush({ name: 'medalEdit1144' })
      },
      handleRemove(dimension, medal, index, pIndex) {
        let that = this
        CategoryApi.addCategory([
          {
            id: medal.id,
            status: 'd',
            groupId: that.currentGroup.groupId
          }
        ]).then(res => {
          that.list[pIndex].childs.splice(index, 1)
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleEdit(dimension, medal, index, pIndex) {
        this.setClassMedal({ dimension: dimension, cache: medal, medal: null })
        this.routePush({ name: 'medalEdit1144' })
      },
      handleAddDim() {
        this.setClassMedal({ cache: null, dimension: null })
        this.routePush({ name: 'dimensionEdit1144' })
      },
      handleEditDim(item) {
        this.setClassMedal({ cache: item, dimension: null })
        this.routePush({ name: 'dimensionEdit1144' })
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
        .edit {
          position: absolute;
          right: 0;
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
