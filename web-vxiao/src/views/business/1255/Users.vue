<template>
  <page title="详情">
    <div class="category-title"
         v-html="dateTxt"></div>
    <Relate :items="us"
            :plus="false"
            :reduce="false">
    </Relate>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        users: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        order: 'getOrder'
      }),
      us() {
        return this.users.map(v => {
          return { ...v, avatar: this.url(v.avatar), icon: v.remark === '1' ? 'ico-select active' : '' }
        })
      },
      dateTxt() {
        let date = this.routeQuery('sdate')
        let punched = []
        if (Check.isRealArray(this.users)) {
          punched = this.users.filter(v => {
            return v.remark === '1'
          })
        }
        return `${DateUtils.format(`${new Date().getFullYear()}-${date}`, 'MM月dd日')} ${punched.length}/${this.users.length}`
      }
    },
    components: {
      Relate: resolve => require(['@/views/components/relate/Index'], resolve)
    },
    methods: {
      ...mapActions(['setOrder', 'deleteOrderProp']),
      fetchData() {
        Api.getUsers(this.routeQuery('msgId'), this.routeQuery('stime')).then(res => {
          this.users = res.relations || []
        })
      }
    }
  }
</script>
