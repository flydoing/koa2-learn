<template>
  <page title="自动表彰">
    <div v-for="(item,i) in list"
         :key="i"
         :item="item">
      <item @click="handleCommend(item)">
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="item.ruleTxt"></div>
      </item>
    </div>
    <item @click="handleAddCommend"
          :hasArrow="false">
      <div slot="before">
        <i class='ico ico-plus' />
      </div>
      <div slot="main">自动表彰</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {},
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        commend: 'getCommend'
      })
    },
    methods: {
      ...mapActions(['setCommend']),
      fetchData() {
        let that = this
        Api.loadAutoCommendList(that.currentGroup.groupId).then(res => {
          that.list = res.commendAutos.map(c => {
            switch (c.autoType) {
              case 'week':
                c.ruleTxt = `一周${c.score}分`
                break
              case 'month':
                c.ruleTxt = `一月${c.score}分`
                break
              case 'season':
                c.ruleTxt = `一学期${c.score}分`
                break
              default:
                break
            }
            return c
          })
        })
      },
      handleCommend(item) {
        this.setCommend({ cache: item, cmdn: null })
        this.routePush({ name: 'autoCommendEdit1048' })
      },
      handleAddCommend() {
        this.setCommend({ cache: null, cmdn: null })
        this.routePush({ name: 'autoCommendEdit1048' })
      }
    }
  }
</script>
