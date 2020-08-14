<template>
  <Page :title="title"
        :loading="loading"
        ref="_page">
    <div v-for="(table,i) in tables"
         :key="i">
      <div class="category-title"
           v-if="i!==0"></div>
      <vx-table :data="table.datas"
                stripe
                :key="i">
        <vx-table-column :label="title"
                         v-for="(title,j) in table.titles"
                         :key="j">
          <template slot-scope="scope">
            <template v-if="!scope.row[j]">
              <span>-</span>
            </template>
            <template v-else>
              <template v-for="key in table.keys">
                <div v-if="!!scope.row[j][key]"
                     :key="key">
                  {{scope.row[j][key]}}
                </div>
              </template>
            </template>
          </template>
        </vx-table-column>
      </vx-table>
    </div>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        tables: [],
        loading: false,
        maxHeight: 'auto'
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || '课表'
      }
    },
    created() {
      this.loading = true
      let userId = this.routeQuery('userId') || this.USER.id
      Api.loadCourseTable(userId)
        .then(res => {
          this.loading = false
          this.tables = res.tables
          this.$nextTick(() => {
            this.maxHeight = this.$refs._page.sh
          })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
</script>
