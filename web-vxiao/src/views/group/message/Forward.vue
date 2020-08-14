<template>
  <Page title="转发"
        hasSubmit
        @submit="submit">
    <SelectGroup :groups="groups"
                 :multiselect="true"
                 ref="_select_group" />
  </Page>
</template>
<script>
  import R from '../mixin'
  import MR from '@/views/business/mixin'
  import { mapGetters } from 'vuex'
  import Api from '@/api/message'
  import Check from '@/utils/check'
  export default {
    mixins: [R, MR],
    components: {
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve)
    },
    computed: {
      ...mapGetters(['getGroups']),
      groups() {
        let that = this
        return this.getGroups.filter(g => {
          return (g.type === '1' || g.type === '2') && g.groupId !== that.groupId
        })
      }
    },
    methods: {
      submit() {
        let keys = this.$refs._select_group.getKeys()
        let m = this.getStorage('_cache_forward_message')
        let medias = []
        if (Check.isRealArray(m.medias)) {
          medias = m.medias.map(v => {
            return { ...v, id: null }
          })
        }
        Api.forward({
          message: {
            groupIds: keys,
            ...m,
            originalId: m.originalId && m.originalId !== '0' ? m.originalId : m.id,
            ...this.commonMessage(),
            ...{ id: null },
            medias: medias
          }
        })
          .then(res => {
            this.$message({ type: 'success', message: '转发成功' })
            this.routeBack()
          })
          .catch(res => {})
      }
    }
  }
</script>
