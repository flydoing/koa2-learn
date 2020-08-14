<template>
  <div>
    <textarea cols="30" rows="10" v-model="dContent"></textarea>
    <p>
      {{dContent}}
    </p>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dContent: ''
      }
    }
  }

</script>
