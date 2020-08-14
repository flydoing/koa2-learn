<template>
  <div class="counter">
    <div class="star-list">
      <div class="star-Icon" v-for="(_i,i) in [1,2,3,4,5]" :key="i" :class="{'show':i<star}"></div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      star: { type: [Number], default: 0 }
    }
  }

</script>
