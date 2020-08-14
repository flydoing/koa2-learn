<template>
  <page :title="title">
    <template v-if="table">
      <vx-table :data="table.datas"
                :height="maxHeight"
                stripe>
        <vx-table-column v-for="(item, i) in table.columns"
                         :key="i"
                         :fixed="i===0 && table.columns.length > 4"
                         :label="item"
                         width="150">
          <template slot-scope="scope">
            <div v-html="scope.row.columns[i]"></div>
          </template>
        </vx-table-column>
      </vx-table>
    </template>
    <template v-else>
      <CardTips text="暂无数据" />
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      CardTips: resolve => require(['@/views/components/card/ui/Tips'], resolve)
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    data() {
      return {
        table: null,
        maxHeight: 0
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        if (this.obj.tableData) {
          this.table = this.obj.tableData
        }
      }
    }
  }
</script>
