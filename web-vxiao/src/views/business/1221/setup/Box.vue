<template>
  <div class="storage-container"
       v-if="count===12">
    <div class="storage-block"
         v-for="(b,i) in allots"
         :key="i"
         :class="{'active':b.active}"
         @click="clickBox(b)">
      <template v-if="b.active">
        <div v-if="value === '1'">
          <div>{{b.boxnum}}</div>
        </div>
        <div v-if="value === '2'">
          <div>{{b.boxnum}}</div>
          <div>{{b.name}}</div>
        </div>
        <div v-if="value === '3'">
          <div>{{b.gname}}</div>
          <div>{{b.uname}}</div>
        </div>
      </template>
      <template v-else>
        <div>{{b.boxnum}}</div>
        <div v-if="value === '1'">空</div>
      </template>
    </div>
  </div>
  <div class="storage-container storage-24"
       v-else-if="count===24">
    <div class="storage-group"
         v-for="(as,i) in conver(24)"
         :key="i">
      <div class="storage-block"
           v-for="(b,i) in as"
           :key="i"
           :class="{'active':b.active}"
           @click="clickBox(b)">
        <template v-if="b.active">
          <div v-if="value === '1'">
            <div>{{b.boxnum}}</div>
          </div>
          <div v-if="value === '2'">
            <div>{{b.boxnum}}</div>
            <div>{{b.name}}</div>
          </div>
          <div v-if="value === '3'">
            <div>{{b.gname}}</div>
            <div>{{b.uname}}</div>
          </div>
        </template>
        <template v-else>
          <div>{{b.boxnum}}</div>
          <div v-if="value === '1'">空</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    count: { type: Number, default: 12 },
    allots: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: '' // 寄存柜1,器材柜2,储物柜3
  },
  filters: {
    isShowNull: id => {
      console.log(id)
      if (id) return ''
      return '空'
    }
  },
  methods: {
    clickBox(b) {
      this.$emit('click', b)
    },
    conver(count) {
      let arr = []
      if (count === 24) {
        for (let i = 0; i < this.allots.length; i += 6) {
          arr.push(this.allots.slice(i, i + 6))
        }
      }
      return arr
    }
  },
  watch: {
    allots(s) {
      this.allots = s
    },
    count(s) {
      this.count = s
    }
  }
}
</script>
<style lang="scss" scoped>
  .storage {
    &-container {
      margin: rem(10) auto;
      width: rem(110+110+40);
      @include flex;
      @include wrap;
    }
    &-24 {
      @include flex;
      @include jc(space-around);
      @include ai(flex-start);
      width: auto;
      .storage-group {
        @include flex;
        @include wrap;
        width: rem(110+110+8);
      }
      .storage-block {
        margin: rem(0) rem(2);
      }
    }
    &-block {
      @include ct;
      @include fd;
      margin: rem(0) nth($padding, 3);
      width: rem(110);
      height: rem(100);
      border: rem(1) solid #fff;
      background: nth($background, 1);
      cursor: pointer;
      &:hover {
        background: nth($background, 2);
      }
      &.active {
        @include bc;
        color: #fff;
        &:hover {
          @include bch;
        }
      }
    }
  }
</style>
