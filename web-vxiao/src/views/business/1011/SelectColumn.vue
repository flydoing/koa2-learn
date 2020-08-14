<template>
  <Popover title="选择栏目" :th="400" :hasSubmit="false">
    <item v-for="(item,i) in columns" :key="i" @click="handleSelect(item)">
      <div slot="main" v-html="item.name"></div>
    </item>
  </Popover>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    props: {
      columns: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    created() {},
    computed: {},
    methods: {
      handleSelect(item) {
        this.$emit('change', item)
      }
    }
  }

</script>
