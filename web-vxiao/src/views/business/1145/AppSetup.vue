<template>
  <Setup>
    <template v-if="isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1145'))" slot="others">
      <item @click="dutySetting">
        <div slot="main">值日设置</div>
      </item>
    </template>
  </Setup>
</template>
<script>
import R from '@/views/group/mixin'

export default {
  mixins: [R],
  props: {},
  computed: {},
  components: {
    Setup: resolve => require(['@/views/group/app/Default'], resolve)
  },
  methods: {
    dutySetting() {
      this.routePush({ name: 'dutySetting1145' })
    }
  }
}

</script>
