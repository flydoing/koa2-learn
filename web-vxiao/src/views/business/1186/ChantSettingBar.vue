<template>
  <div class="chant-setting-bar">
    <div class="setting-list">
      <div class="btn"
           v-if='isCourse'
           @click="handleCategory"
           v-html="categoryTxt"></div>
      <el-dropdown class="drop-down"
                   trigger="click"
                   @command="handleType">
        <div class="btn"
             v-html="typeTxt"></div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item, i) in types"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="btn"
           @click="handleAudio"
           v-html="audioTxt"></div>
      <el-dropdown class="drop-down"
                   trigger="click"
                   @command="handleSwitch">
        <div class="btn">背诵：{{set.switch.name}}</div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item, i) in switches"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    props: {
      types: {
        type: Array,
        default() {
          return []
        }
      },
      switches: {
        type: Array,
        default() {
          return []
        }
      },
      set: {
        type: Object,
        default() {
          return {}
        }
      },
      index: {
        type: [Number, String]
      }
    },
    computed: {
      categoryTxt() {
        let category = this.setting.category
        return category ? category.name : '选择目录'
      },
      typeTxt() {
        let type = this.setting.type
        return type ? type.name : '选择类型'
      },
      audioTxt() {
        let audio = this.setting.audio
        return audio ? audio.fileName : '选择伴奏'
      }
    },
    data() {
      return {
        setting: this.set
      }
    },
    created() {},
    methods: {
      handleCategory() {
        this.$emit('category', this.set, this.index)
      },
      handleType(command) {
        this.$emit('type', this.set, command, this.index)
      },
      handleAudio() {
        this.$emit('audio', this.set, this.index)
      },
      handleSwitch(command) {
        this.$emit('switch', this.set, command, this.index)
      }
    },
    watch: {
      set(val) {
        this.setting = val
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .chant-setting-bar {
    padding: 0;
    margin: 0;
    .setting-list {
      @include flex;
      margin-top: rem(2);
      .btn {
        position: relative;
        padding: rem(5) rem(20);
        margin-right: rem(16);
        text-align: center;
        background-color: #f7f8fa;
        cursor: pointer;
        &:after {
          content: '';
          width: 15px;
          height: 29px;
          position: absolute;
          right: 0;
          top: 0;
          background-image: url($icon-url);
          background-position: rem(-400) rem(-32);
        }
        &:hover {
          background-color: #ccc;
        }
      }
    }
  }
</style>
