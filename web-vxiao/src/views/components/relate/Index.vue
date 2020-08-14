<template>
  <el-row v-outside="closeRemove"
          class="vx-relate">
    <el-col :span="3"
            class="vx-relate-block"
            v-for="(u,i) in items"
            :key="i"
            @click.native="handleEdit(u,i)">
      <img class="avatar"
           :class="size"
           v-lazy="{src:u.avatar,error:Image.ICO_AVATAR}"
           alt='LOGO' />
      <div class="name">{{u.name}}</div>
      <i v-if="deleteMode"
         class="ico ico-delete"
         @click.stop="handleDelete(u,i)"></i>
      <slot name="icon"
            :data="u">
        <i v-if="u.icon"
           class="ico"
           :class="u.icon"></i>
      </slot>
    </el-col>
    <slot>
      <el-col :span="3"
              class="vx-relate-block plus"
              v-if="plus"
              @click.native="$emit('plus')">
        <img class="avatar"
             :class="size"
             :src="Image.ICO_PLUS" />
      </el-col>
      <el-col :span="3"
              class="vx-relate-block reduce"
              v-if="reduce"
              @click.native="deleteMode = !deleteMode">
        <img class="avatar"
             :class="size"
             :src="Image.ICO_REDUCE" />
      </el-col>
    </slot>
  </el-row>
</template>
<script>
  import Outside from '@/directives/clickoutside'
  export default {
    directives: { Outside },
    props: {
      items: Array,
      plus: { type: Boolean, default: true },
      reduce: { type: Boolean, default: true },
      size: { type: String, default: 'big' }
    },
    data() {
      return {
        deleteMode: false
      }
    },
    methods: {
      handleDelete(u, i) {
        this.$emit('delete', u, i)
      },
      closeRemove() {
        this.deleteMode = false
      },
      handleEdit(u, i) {
        this.$emit('edit', u, i)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vx-relate {
    width: 100%;
    padding: nth($padding, 1) rem(0);
    @include flex;
    @include jc(flex-start);
    @include wrap;

    &-block {
      position: relative;
      padding: nth($padding, 1) rem(0);
      cursor: pointer;

      &:hover {
        background: nth($background, 2);
      }

      img {
        margin: 0 auto;
      }

      .name {
        @include fh;
        font-size: rem(13);
        line-height: rem(25);
        text-align: center;
      }

      i {
        position: absolute;
        right: rem(12);
        bottom: rem(32);
        background: #fff;
        border-radius: rem(22);
      }

      .el-icon-error {
        color: red;
        font-size: rem(18);
        right: rem(10);
        top: rem(0);
      }
    }
  }
</style>
