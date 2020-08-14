<template>
  <div class="card-content">
    <label ref="_label"
           :class="{'close':close}"
           @click="handle">
      <slot></slot>
      <span v-html="content"></span>
    </label>
    <div v-if="show"
         class="card-click text-color"
         @click.stop="handleMore">{{this.close ? '更多': '收起' }}</div>
    <slot name="other"></slot>
  </div>
</template>
<script>
  export default {
    props: {
      content: { type: [String], default: '' },
      more: { type: [Boolean], default: true }
    },
    data() {
      return {
        close: false,
        show: false
      }
    },
    methods: {
      handle(e) {
        const el = e.target
        const className = el.className
        if (className.indexOf('topic') >= 0) {
          e.stopPropagation()
          this.routePushModel({
            name: 'topicList',
            query: {
              label: e.target.innerText.replace(/#/g, '')
            }
          })
        } else if (className.indexOf('and') >= 0) {
          e.stopPropagation()
          const userId = el.getAttribute('id')
          const userName = el.getAttribute('title')
          this.routePushModel({
            name: 'userDetail',
            params: { userId: userId },
            query: {
              title: userName,
              userId: userId
            }
          })
        }
      },
      handleMore() {
        this.close = !this.close
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.show = this.$refs._label.offsetHeight > 139
        this.close = this.show
      })
    }
  }
</script>
