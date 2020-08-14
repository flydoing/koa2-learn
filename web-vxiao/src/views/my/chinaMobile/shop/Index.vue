<template>
  <Page title="商城">
    <Tabs>
      <TabPane label="已完成"
               name="completed"></TabPane>
      <TabPane label="未完成"
               name="uncompleted"></TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import TabPane from '@/components/tab/TabPane'
  import Tabs from '@/components/tab/Tab'
  export default {
    created() {},
    components: {
      Tabs,
      TabPane
    }
  }
</script>
