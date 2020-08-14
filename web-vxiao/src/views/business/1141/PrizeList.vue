<template>
  <page title="奖品列表">
    <div class="prize-list"
         @click="handle">
      <div class="pl-item"
           v-for="(item,i) in list"
           :key="i"
           :item="item"
           @click="handleItem(item)">
        <div class="pl-remove"
             v-if="item.isRemove"
             @click.stop="handleRemove(item, i)">
          <i class="ico ico-delete" />
        </div>
        <img :src="Image.IMG_EMPTY"
             v-lazy:background-image="toLogo(item.logo)"
             :style="imageStyle(toLogo(item.logo))" />
        <div class="name"
             v-html="item.name"></div>
        <div class="count">剩余：{{item.count || 0}}</div>
      </div>
      <div class="pl-btn-add"
           @click.stop="handleAdd"></div>
      <div class="pl-btn-remove"
           @click.stop="handleRemoveStatus"></div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {},
    data() {
      return {
        list: [],
        isRemove: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        prize: 'getPrize'
      })
    },
    methods: {
      ...mapActions(['setPrize']),
      fetchData() {
        let that = this
        Api.getPrizeList(that.currentGroup.parentId).then(res => {
          that.list = res.prizes.map(c => {
            c.isRemove = false
            return c
          })
        })
      },
      toLogo(value) {
        return value ? this.url(value) : ''
      },
      handle() {
        this.isRemove = false
        this.refreshList(false)
      },
      refreshList(isRemove) {
        if (Check.isArray(this.list)) {
          this.list = this.list.map(it => {
            it.isRemove = isRemove
            return it
          })
        }
      },
      handleAdd() {
        this.setPrize({ cache: null, thing: null })
        this.routePush({ name: 'prizeEdit1141' })
      },
      handleItem(item) {
        this.setPrize({ cache: item, thing: null })
        this.routePush({ name: 'prizeEdit1141' })
      },
      handleRemoveStatus() {
        this.isRemove = !this.isRemove
        this.refreshList(this.isRemove)
      },
      handleRemove(item, index) {
        let that = this
        Api.commitPrize({
          id: item.id,
          status: 'd'
        }).then(res => {
          this.list.splice(index, 1)
          that.$message({ message: '操作成功', type: 'success' })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .prize-list {
    display: block;
    width: 100%;
    overflow: hidden;
    .pl-item {
      display: inline-block;
      margin: rem(15) rem(2) 0 rem(13);
      vertical-align: middle;
      width: rem(126);
      position: relative;
      cursor: pointer;
      img {
        width: rem(126);
        height: rem(80);
        border: $border;
      }
      .name,
      .count {
        text-align: center;
      }
      .name {
        margin-top: rem(10);
      }
      .pl-remove {
        position: absolute;
        right: rem(-10);
        top: rem(-10);
        color: red;
        font-size: rem(20);
        cursor: pointer;
        .ico-delete {
          background: #fff;
          border-radius: rem(18);
        }
      }
    }
    .pl-btn-add {
      background: url('/static/ico/ico_medal_add.png') no-repeat;
      background-size: 100% 100%;
    }
    .pl-btn-remove {
      background: url('/static/ico/ico_medal_remove.png') no-repeat;
      background-size: 100% 100%;
    }
    .pl-btn-add,
    .pl-btn-remove {
      border: rem(1) solid #e8e8e8;
      display: inline-block;
      margin: rem(15) rem(2) 0 rem(13);
      vertical-align: middle;
      width: rem(126);
      height: rem(126);
      cursor: pointer;
      border-radius: rem(8);
      position: relative;
    }
  }
</style>
