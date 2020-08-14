<template>
  <div class="card-counter">
    <div class="counter text-label left"
         @click.stop="$emit('readed')">
      <slot></slot>
    </div>
    <div class="counter right">
      <i :class="icoPraise"
         @click.stop="$emit('praise')"></i>
      <slot name="reply">
        <i class="ico ico-reply"
           @click.stop="$emit('reply')"></i>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      counter: {
        type: [Object],
        default: function() {
          return {}
        }
      }
    },
    computed: {
      icoPraise() {
        return [
          `ico`,
          {
            [`ico-heart`]: !this.counter.isPraise,
            [`ico-heart-press`]: this.counter.isPraise
          }
        ]
      }
    }
  }
</script>
