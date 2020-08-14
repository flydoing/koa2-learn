<template>
  <Page title="导入结果">
    <vx-table :data="tableData.lines"
              :height="maxHeight"
              border>
      <vx-table-column v-for="(label, i) in tableData.headers"
                       :key="i"
                       :fixed="i===0"
                       :label="label">
        <template slot-scope="scope">
          <div v-html="scope.row[i]"></div>
        </template>
      </vx-table-column>
    </vx-table>
    <template slot="bottom">
      <div class="list-button">
        <div class="button"
             @click="handleImport">忽略错误继续导入</div>
        <div class="button"
             @click="routeBack()">修改后重新导入</div>
      </div>
    </template>
  </Page>
</template>
<script>
  export default {
    data() {
      return {
        tableData: {},
        maxHeight: 100
      }
    },
    mounted() {
      const that = this
      let commonTable = that.getStorage('_import_receipt')
      if (commonTable) {
        that.tableData = commonTable
      }
    },
    methods: {
      handleImport() {
        let uri = this.routeQuery('uri')
        let fileId = this.routeQuery('fileId')
        let cback = this.routeQuery('cback')
        const loading = this.$loading({ target: '._page' })
        if (uri.indexOf('?') !== -1) {
          uri = `${uri}&fileId=${fileId}&ignoreErrors=1`
        } else {
          uri = `${uri}?fileId=${fileId}&ignoreErrors=1`
        }
        this.$http.get(uri).then(res => {
          loading.close()
          if (cback) {
            this.setStorage('_receipt_cback_data', res)
          }
          if (res && res.code === '1') {
            this.$message({ type: 'success', message: '操作成功' })
          }
          this.routeBack()
        })
      }
    }
  }
</script>
