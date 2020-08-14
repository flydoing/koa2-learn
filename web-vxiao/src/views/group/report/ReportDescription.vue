<template>
  <Description10040 v-if="tab.templetType === '10040_2_1'" />
</template>
<script>
  import Description10040 from '@/views/business/10040/Description'
  export default {
    components: {
      Description10040
    },
    props: {
      tab: {
        type: Object,
        default: () => {
          return {}
        }
      }
    }
  }
</script>
