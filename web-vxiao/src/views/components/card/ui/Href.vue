<template>
  <div class="card-click text-color" @click="handle" v-if="content!=''">
    <slot>{{content}}</slot>
  </div>
</template>
<script>
  export default {
    props: {
      content: { type: [String], default: '' }
    },
    methods: {
      handle: function() {
        this.$emit('click')
      }
    }
  }

</script>
