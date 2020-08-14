<template>
  <page title="宿舍"
        @add="handleAdd"
        hasAdd>
    <vx-table :data="tableData.datas"
              :height="maxHeight"
              @row-click="rowClick"
              stripe>
      <vx-table-column minWidth="120"
                       label="校区"
                       prop="campusName"
                       :fixed="true">
      </vx-table-column>
      <vx-table-column minWidth="120"
                       label="宿舍楼"
                       prop="building">
      </vx-table-column>
      <vx-table-column minWidth="120"
                       label="楼层"
                       prop="floorName">
      </vx-table-column>
      <vx-table-column minWidth="120"
                       label="名称"
                       prop="name">
      </vx-table-column>
      <!-- <vx-table-column width="120"
                         v-for="(item,j) in tableData.columns"
                         :label="item"
                         :key="j"
                         :fixed="j===0 && tableData.columns.length > 4">
          <template slot-scope="scope">
            <span v-html="scope.row.columns[j]"></span>
          </template>
        </vx-table-column> -->
    </vx-table>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        tableData: {
          datas: [
            {
              id: 1,
              campusName: '本部',
              building: '女宿舍楼',
              floorName: '/',
              name: '101室'
            },
            {
              id: 2,
              campusName: '本部',
              building: '男宿舍楼',
              floorName: '/',
              name: '101室'
            },
            {
              id: 3,
              campusName: '本部',
              building: '女宿舍楼',
              floorName: '一层',
              name: '102室'
            },
            {
              id: 4,
              campusName: '本部',
              building: '男宿舍楼',
              floorName: '一层',
              name: '102室'
            }
          ]
        },
        maxHeight: 200
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {},
      handleAdd() {
        this.routePush({
          name: 'basiceDormitoryEdit'
        })
      },
      rowClick(row) {
        this.setStorage('_dormitory_cache', row)
        this.routePush({
          name: 'basiceDormitoryEdit'
        })
      }
    }
  }
</script>
