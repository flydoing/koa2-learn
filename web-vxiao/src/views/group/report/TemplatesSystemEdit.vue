<template>
  <Page :title="t.name"
        hasSubmit
        @submit="submit">
    <div v-for="(rule,i) in templateRules"
         :key="i"
         id="r.id">
      <div class="category-title text">{{rule.title}}</div>
      <item class="it"
            v-for="(item,j) in rule.r"
            :key="j"
            :hasArrow="false"
            @click="handleRule(item)">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.select}" />
        </div>
        <div slot="main">{{item.name}}</div>
        <div slot="remark"
             class="ellipsis">{{item.extension}}</div>
      </item>
    </div>
  </Page>
</template>
<script>
  import Api from './api'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        rules: [],
        t: {}
      }
    },
    computed: {
      templateRules() {
        const that = this
        let obj = [{ id: '179', title: '推送周期', r: [] }, { id: '180', title: '推送范围', r: [] }, { id: '181', title: '身份可见', r: [] }]
        if (that.rules.length > 0) {
          that.rules.forEach(r => {
            obj[r.type === '179' ? 0 : r.type === '180' ? 1 : 2]['r'].push(r)
          })
        }
        return obj
      }
    },
    created() {
      const that = this
      let _t = this.getStorage('_templet')
      if (Check.isNullObject(_t)) {
        that.routeBack()
      }
      that.t = _t
      that.t.groupId = that.routeQuery('groupId')
      Api.loadTemplateRule().then(res => {
        if (that.t.allocation && Check.isRealArray(that.t.allocation.categorys)) {
          res.categorys.forEach(r => {
            Check.isRealArray(
              that.t.allocation.categorys.filter(_c => {
                return _c.id === r.id
              })
            ) && (r.select = true)
          })
        }
        that.rules = res.categorys
      })
    },
    methods: {
      submit() {
        const that = this
        that.t.allocation = {
          categorys: that.rules.filter(c => {
            return !!c.select
          })
        }
        Api.addTemplate({ templet: that.t }).then(res => {
          that.routeBack()
        })
      },
      handleRule(rule) {
        this.$set(rule, 'select', !rule.select)
      }
    }
  }
</script>
