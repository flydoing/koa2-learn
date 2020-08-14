<template>
  <Page :title="title"
        :loading="loading"
        ref="_page">
    <div class="title"
         @click="handleTime">{{table.title || ''}}</div>
    <vx-table :data="table.datas"
              stripe
              border
              :height="maxHeight">
      <vx-table-column :label="title"
                       v-for="(title,i) in table.titles"
                       :key="i"
                       :fixed="i===0">
        <template slot-scope="scope">
          <template v-if="!scope.row[i]">
            <span>-</span>
          </template>
          <template v-else>
            <template v-for="key in table.keys">
              <div v-if="!!scope.row[i][key]"
                   :key="key">
                {{scope.row[i][key]}}
              </div>
            </template>
          </template>
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        table: {},
        loading: false,
        maxHeight: 'auto',
        date: null
      }
    },
    computed: {
      title() {
        return this.routeQuery('title') || '课程表'
      }
    },
    created() {
      this.loading = true
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.getTableData(1, () => {})
      },
      getTableData(callback) {
        let placeId = this.routeQuery('placeId')
        let date = this.getStorage('coursetbl_date') || this.date || {}
        if (!Check.isNullObject(date)) {
          this.date = date
        }
        if (placeId) {
          Api.loadPlace(placeId, date.startTime, date.endTime)
            .then(res => {
              this.loading = false
              this.table = res.table || {}
              callback && callback()
            })
            .catch(() => {
              this.loading = false
            })
        }
      },
      handleTime() {
        this.routePush({ path: '/vx/group/business/coursetblTime' })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.maxHeight = this.$refs._page.sh - 30
      })
    }
  }
</script>
<style lang="scss" scoped>
  .title {
    text-align: center;
    max-height: rem(30);
    line-height: rem(30);
    @include fc;
    cursor: pointer;
  }
</style>
