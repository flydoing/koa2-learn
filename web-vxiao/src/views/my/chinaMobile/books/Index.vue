<template>
  <Page title="图书"
        ref="_page">
    <Tabs>
      <TabPane label="借还书清单">
        <vx-table :data="lentTable.datas"
                  :height="maxHeight"
                  stripe>
          <vx-table-column min-width="120"
                           v-for="(item,j) in lentTable.columns"
                           :label="item"
                           :key="j"
                           :fixed="j===0 && lentTable.columns.length > 4">
            <template slot-scope="scope">
              <span v-html="scope.row.columns[j]"></span>
            </template>
          </vx-table-column>
        </vx-table>
      </TabPane>
      <TabPane label="捐书清单">
        <vx-table :data="donateTable.datas"
                  :height="maxHeight"
                  @row-click="rowClick"
                  stripe>
          <vx-table-column min-width="120"
                           v-for="(item,j) in donateTable.columns"
                           :label="item"
                           :key="j"
                           :fixed="j===0 && donateTable.columns.length > 4">
            <template slot-scope="scope">
              <span v-html="scope.row.columns[j]"></span>
            </template>
          </vx-table-column>
        </vx-table>
      </TabPane>
    </Tabs>
  </Page>
</template>
<script>
  import Tabs from '@/components/tab/Tab'
  import TabPane from '@/components/tab/TabPane'
  import Api from '../../api'
  export default {
    components: {
      Tabs,
      TabPane
    },
    data() {
      return {
        donateTable: {
          columns: [],
          datas: []
        },
        lentTable: {
          columns: [],
          datas: []
        },
        maxHeight: 'auto'
      }
    },
    created() {
      Api.loadBooksTable({ queryType: 1, level: 1 }).then(res => {
        if (res.table) {
          this.lentTable = res.table
          this.$nextTick(() => {
            this.maxHeight = this.$refs._page.sh - 40
          })
        }
      })
      Api.loadBooksTable({ queryType: 2, level: 1 }).then(res => {
        if (res.table) {
          this.donateTable = res.table
          this.$nextTick(() => {
            this.maxHeight = this.$refs._page.sh - 40
          })
        }
      })
    },
    methods: {
      rowClick(row) {
        if (row.clickAble == null || row.clickAble === true) {
          this.routePush({
            path: `/vx/user/app/books/detail`,
            query: {
              ...row.params
            }
          })
        }
      }
    }
  }
</script>
