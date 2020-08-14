<template>
  <div class="reply-item praise-block"
       v-if="hasPraise">
    <i class="ico ico-heart-press" />
    <template v-for="(praise,i) in praises">
      <div class="text-color"
           ref="_praise"
           :key="i"
           v-if="praise.isPraise===1"
           @click.stop="$emit('user',praise.userId)">
        {{praise.name}}
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    props: {
      praises: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {
      hasPraise() {
        return (
          this.praises.filter(p => {
            return p.isPraise === 1
          }).length > 0
        )
      }
    }
  }
</script>
