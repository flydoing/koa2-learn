<template>
  <Page :title="$route.query.title"
        :loading="loading"
        ref="_page">
    <label slot="btn"
           @click="add">新增</label>
    <vx-table :data="baseTable.datas"
              stripe
              @row-click="rowClick"
              :height="maxHeight">
      <vx-table-column :fixed="i===0"
                       :prop="k"
                       :label="baseTable.titles[i]"
                       v-for="(k,i) in baseTable.keys"
                       :key="k" />
    </vx-table>
  </Page>
</template>
<script>
  import Api from '../api'
  export default {
    data() {
      return {
        maxHeight: 100,
        loading: true,
        baseTable: { keys: [], titles: [], datas: [] }
      }
    },
    created() {
      Api.loadPlaceDetail(this.routeQuery('schoolId'), this.routeQuery('type')).then(res => {
        this.loading = false
        this.baseTable = res.baseTable || this.baseTable
      })
    },
    methods: {
      edit(data) {
        if (data) {
          this.setStorage('_cache_place_', data)
        }
        let type = this.routeQuery('type')
        console.log(type, 'type=====')
        if (type === '6') {
          this.routePush({
            name: 'basicePlaceAddFood',
            query: this.$route.query
          })
        } else if (type === '2' || type === '1') {
          // 办公室和课室
          this.routePush({
            name: 'basicePlaceCourse',
            query: this.$route.query
          })
        } else if (type === '8') {
          this.routePush({
            name: 'basiceDormitoryEdit',
            query: this.$route.query
          })
        } else {
          this.routePush({
            name: 'basicePlaceAdd',
            query: this.$route.query
          })
        }
      },
      add() {
        this.edit()
      },
      rowClick(row, event, column) {
        this.edit(row)
      }
    }
  }
</script>
