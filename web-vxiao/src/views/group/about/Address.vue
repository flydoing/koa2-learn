<template>
  <Page title="详细地址">
    <ItemList v-for="(item,i) in address" :key="i" :hasClick="false">
      <span slot="title">{{item | getPlace}}</span>
      <span slot="main">{{item | getAddress}}</span>
    </ItemList>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [R],
    computed: {
      ...mapGetters({
        metaDatas: 'getMetaDatas'
      }),
      address() {
        let address = []
        if (Check.isRealArray(this.metaDatas)) {
          address = this.metaDatas.filter(meta => {
            return meta.metaType === 'm_school_address' && this.groupId === meta.extension
          })
        }
        return address
      }
    },
    filters: {
      getPlace(item) {
        return JSON.parse(item.obj)['place']
      },
      getAddress(item) {
        let obj = JSON.parse(item.obj)
        return `${obj.province}${obj.city}${obj.district}${obj.address || ''}`
      }
    }
  }

</script>
