<template>
  <Card :message="message"
        :parentType="1144">
    <div slot="contents"
         class="card-medals"
         v-if="medals">
      <div v-for="(medal,i) in medals"
           :key="i"
           :medal="medal">
        <Medal1 :medal="medal"
                @click="handleMedal(medal)"></Medal1>
      </div>
    </div>
    <MedalInfo v-if="medalData"
               :medal="medalData"
               :show.sync="showMedalInfo"></MedalInfo>
  </Card>
</template>
<script>
  import CardMixin from '@/views/components/card/mixin'
  import Check from '@/utils/check'

  export default {
    mixins: [CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        showMedalInfo: false,
        medalData: null
      }
    },
    components: {
      Medal1: resolve => require(['@/views/components/medal/Medal1'], resolve),
      Medal2: resolve => require(['@/views/components/medal/Medal2'], resolve),
      MedalInfo: resolve => require(['@/views/components/medal/Info'], resolve)
    },
    computed: {
      medals() {
        let _m = this.message
        try {
          let json = JSON.parse(_m.extensionType)
          if (!Check.isNullObject(json)) {
            return json.datas.map(m => {
              m.value = m.value !== 0 ? (m.value > 0 ? `+${m.value}分` : `-${m.value}分`) : `${m.value}分`
              return m
            })
          }
          return false
        } catch (e) {}
        return false
      }
    },
    methods: {
      handleMedal(md) {
        this.showMedalInfo = true
        this.medalData = md
      }
    }
  }
</script>
<style lang="scss">
  .card-medals {
    display: block;
    padding-top: rem(5);
    & > div {
      display: block;
      width: 100%;
      @extend %clearfix;
    }
  }
</style>
