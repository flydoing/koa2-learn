<template>
  <scroller :height="maxHeight">
    <MedalWall1005 v-if="reportType=='4'"
                   :params="params" />
    <Chart1005 v-else-if="reportType=='5'"
               :params="params" />
    <Chart1237 v-else-if="reportType=='6'"
               :params="params" />
    <Report10040 v-else-if="reportType=='7'"
                 :params="params"
                 :tabData="tab" />
    <Report10039 v-else-if="reportType=='8'"
                 :params="params"
                 :tabData="tab" />
  </scroller>
</template>

<script>
  export default {
    props: {
      tab: { type: Object },
      type: { type: String, default: '' },
      maxHeight: { type: [String, Number] },
      params: { type: Object }
    },
    computed: {
      reportType() {
        let tab = this.tab || {}
        return tab.reportType
      }
    },
    components: {
      MedalWall1005: resolve => require(['@/views/business/1005/MedalWall'], resolve),
      Chart1005: resolve => require(['@/views/business/1005/Chart'], resolve),
      Chart1237: resolve => require(['@/views/business/1237/Chart'], resolve),
      Report10039: resolve => require(['@/views/business/10039/Report'], resolve),
      Report10040: resolve => require(['@/views/business/10040/Report'], resolve)
    }
  }
</script>
