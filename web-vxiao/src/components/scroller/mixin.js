export default {
  methods: {
    scrollTo(element) {
      this.scrollbar.scrollIntoView(element)
    },
    scrollIng(status) {
      if (status.offset.y === status.limit.y && status.offset.y !== 0) {
        this.$emit('scrollEnd', status)
      } else if (status.offset.y === 0) {
        // this.$emit('scrollStart', status)
      }
      this.$emit('scrolling', status)
    },
    scrollEnd() {
      this.scrollbar.scrollTop = this.scrollbar.limit.y
    }
  },
  watch: {
    'scrollbar.size.content.height' () {
      if (this.bottom) {
        this.scrollbar.scrollTop = this.scrollbar.limit.y
      }
    }
  }
}
