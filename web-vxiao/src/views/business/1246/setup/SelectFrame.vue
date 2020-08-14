<template>
  <Popover title="选择帧数" :th="400" :hasSubmit="false">
    <item v-for="n in 30" :key="n" @click="handleSelect(n)">
      <div slot="main">{{n}}帧</div>
    </item>
  </Popover>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    props: {
      frames: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    created() {},
    computed: {},
    methods: {
      handleSelect(num) {
        this.$emit('change', num)
      }
    }
  }

</script>
