<template>
  <page :title="title"
        :hasAdd="hasAdd"
        @Add="handleAdd">
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <item v-for="(item,i) in results"
          :key="i"
          @click="handleItem(item, i)"
          :label="item.name"
          :remark="remarkTxt(item)">
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        results: [],
        params: {},
        keyword: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      hasAdd() {
        return this.params.hasAdd || false
      }
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      remarkTxt(item) {
        return this.params.field ? item[this.params.field] : ''
      },
      fetchData() {
        this.params = this.crm.params
        this.params.getListData(datas => {
          this.list = datas
          this.results = datas
        })
      },
      handleItem(item, index) {
        let params = this.params
        if (params.callback) {
          params.callback(item, () => {
            this.deleteCrmProp('form')
            this.routeBack()
          })
        } else {
          this.setStorage(`_crm_business_${params.property}_cache`, item)
          this.routeBack()
        }
      },
      handleAdd() {
        this.routePush(this.params.routeParams)
      }
    },
    watch: {
      keyword(value) {
        if (Check.isNullString(value)) {
          this.results = [...this.list]
          return false
        }
        if (Check.isRealArray(this.list)) {
          this.results = this.list.filter(v => {
            return v.name.indexOf(value) !== -1
          })
        }
      }
    }
  }
</script>
