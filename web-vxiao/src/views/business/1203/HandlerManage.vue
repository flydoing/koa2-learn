<template>
  <page title="负责人管理"
        :loading="loading">
    <div class="handler-manage">
      <vx-table v-if="table"
                :data="table.datas"
                :height="maxHeight"
                border>
        <template v-if="table">
          <vx-table-column v-for="(item, i) in table.titles"
                           :key="i"
                           :fixed="i===0 && table.titles.length > 4"
                           :label="item"
                           width="150">
            <template slot-scope="scope">
              <template v-if="i>0">
                <div class="tbl-column-content"
                     v-html="scope.row.datas[i].value"></div>
                <div :class="{'tbl-column-item': i > 0}"
                     @click="cellClick(scope.row.datas[i], scope.$index, i)">
                  <span v-html="scope.row.datas[i].value"></span>
                </div>
              </template>
              <template v-else>
                <div v-html="scope.row.datas[i].value"></div>
              </template>
            </template>
          </vx-table-column>
        </template>
      </vx-table>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    data() {
      return {
        table: null,
        maxHeight: 0,
        loading: false
      }
    },
    activated() {
      let refresh = this.getStorage('_handler_manage_refresh')
      if (refresh) {
        this.fetchData()
        this.modifyCreateObjectField('refresh')
      } else if (this.obj.item) {
        let item = this.obj.item
        this.$set(this.table.datas[item.rIndex].datas, item.cIndex, item.cell)
        this.modifyCreateObjectField('item')
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        this.loading = true
        Api.getHandlerTable(this.groupId)
          .then(res => {
            if (res.titles) {
              this.table = {
                titles: res.titles,
                datas: res.datas || []
              }
            }
            this.loading = false
          })
          .catch(res => {
            this.loading = false
          })
      },
      cellClick(cell, rIndex, cIndex) {
        if (cIndex > 0) {
          this.setCreateObject({
            item: { cell: cell, rIndex: rIndex, cIndex: cIndex }
          })
          this.routePush({
            path: '/vx/group/business/1203/addHandler',
            query: { appId: cell.id, terminalId: cell.categoryId }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .handler-manage {
    .tbl-column-content {
      visibility: hidden;
    }
    .tbl-column-item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: pointer;
      span {
        display: inline-block;
        vertical-align: middle;
        padding: 0 rem(10);
      }

      &:after {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
      }
    }
  }
</style>
