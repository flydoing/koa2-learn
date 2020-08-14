<template>
  <CardDetail :m="message" v-if="message">
    <div class="commend-item">
      <Commend :commendation="commend"></Commend>
    </div>
  </CardDetail>
</template>
<script>
import R from '@/views/group/mixin'
import { mapGetters } from 'vuex'
import MessageApi from '@/api/message'

export default {
  mixins: [R],
  components: {
    CardDetail: resolve => require(['@/views/components/card/CardDetail'], resolve),
    Commend: resolve => require(['./Commend'], resolve)
  },
  data() {
    return {
      message: {}
    }
  },
  computed: {
    ...mapGetters({
      commend: 'getCommend'
    })
  },
  created() {
    let msgId = this.routeParam('msgId')
    MessageApi.getMessageById(msgId).then(res => {
      this.message = res.message
    })
  },
  methods: {
    handlePraise() {}
  }
}

</script>
<style lang="scss" scoped>
@import "~scss/_mixin";
.commend-item {
  display: block;
  margin: 0 auto;
  margin-top: rem(10)!important;
  width: rem(412);
  height: rem(232);
}

</style>
