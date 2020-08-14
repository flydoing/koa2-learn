<template>
  <page :title="title">
    <div class="arrange-seat-info">
      <template v-if="image">
        <img :src="image" />
      </template>
      <template v-else-if="arrange.seats">
        <div class="category-title text">讲台</div>
        <Table :tableData="table" />
      </template>
      <template v-else>
        <Table :tableData="table" />
      </template>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Table: resolve => require(['@/components/table/Table'], resolve)
    },
    props: {},
    computed: {
      ...mapGetters({
        arrange: 'getArrangeExam'
      }),
      title() {
        return this.routeQuery('title') || '排考详情'
      },
      image() {
        return this.arrange.image ? this.url(this.arrange.image) : ''
      }
    },
    data() {
      return {
        table: {
          columns: [],
          datas: [],
          lockRows: 1,
          lockColumns: 0
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        that.placeId = that.routeQuery('pId')
        if (that.placeId) {
          Api.loadSeatsByPlaceId(that.placeId).then(res => {
            that.table.columns = res.data.columns
            that.table.datas = res.data.datas
          })
        } else if (that.arrange.seats) {
          that.arrange.seats.forEach((v, i) => {
            that.table.datas.push({
              clickAble: false,
              columns: v
            })
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .arrange-seat-info {
    img {
      display: block;
      margin: 0 auto;
      max-width: 90%;
      margin-top: rem(30) !important;
    }
    .category-title {
      text-align: center;
    }
  }
</style>
