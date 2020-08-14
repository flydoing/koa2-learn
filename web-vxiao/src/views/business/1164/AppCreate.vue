<template>
  <Page title="选择排考方式">
    <item @click="intelligentArrange">
      <div slot="main">智能排考</div>
    </item>
    <div class="category-title"></div>
    <item @click="seatArrange">
      <div slot="main">按考场上传排考方案</div>
      <div slot="remark">上传Excel座位表</div>
    </item>
    <item @click="normalArrange">
      <div slot="main">上传排考方案</div>
      <div slot="remark">逐个上传（图片/Excel）</div>
    </item>
    <item @click="summaryArrange">
      <div slot="main">上传排考方案</div>
      <div slot="remark">上传Excel总表</div>
    </item>
    <item @click="examPlaceArrange">
      <div slot="main">上传排考方案</div>
      <div slot="remark">上传考场信息</div>
    </item>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  // import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: {},
    methods: {
      intelligentArrange() {
        this.routePush({ name: 'timeStep1164' })
      },
      seatArrange() {
        this.routePush({ name: 'seatArrange1164' })
      },
      normalArrange() {
        this.routePush({ name: 'normalArrange1164' })
      },
      summaryArrange() {
        this.routePush({ name: 'summaryArrange1164' })
      },
      examPlaceArrange() {
        this.routePush({ name: 'examPlaceArrange1164' })
      }
    }
  }
</script>
