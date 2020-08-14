<template>
  <div class="vx-table"
       :class="[{
         'vx-table--stripe': stripe,
         'vx-table--border': border
       }, tableSize ? `vx-table--${tableSize}` : '']">
    <div class="
       hidden-columns"
         ref="hiddenColumns">
      <slot></slot>
    </div>
    <div class="vx-table--header"
         ref="headerWrapper">
      <table-header :store="store"
                    :border="border"
                    :style="bodyWidth" />
    </div>
    <div ref="bodyWrapper"
         class="vx-table--body"
         :style="bodyHeight"
         :class="[layout.scrollX ? `is-scrolling-${scrollPosition}` : 'is-scrolling-none']">
      <table-body :store="store"
                  :border="border"
                  :stripe="stripe"
                  :style="bodyWidth" />
      <div class="vx-table--empty"
           v-if="!data || data.length === 0"
           :style="bodyWidth">
        <slot name="empty">{{emptyText || '暂无数据'}}</slot>
      </div>
    </div>
    <div ref="fixedWrapper"
         class="vx-table--fixed"
         v-mousewheel="onFixedMousewheel"
         v-if="fixedColumns.length > 0"
         :style="[fixedStyle]">
      <div class="vx-table--fixed-header">
        <table-header fixed="left"
                      :store="store"
                      :border="border"
                      :style="bodyWidth" />
      </div>
      <div class="vx-table--fixed-body"
           :style="fixedBodyHeight"
           ref="fixedBodyWrapper">
        <table-body fixed="left"
                    :store="store"
                    :stripe="stripe"
                    :style="bodyWidth" />
      </div>
    </div>
    <div ref="rightFixedWrapper"
         class="vx-table--fixed-right"
         v-if="rightFixedColumns.length > 0">
      <div class="vx-table--fixed-header">
        <table-header fixed="right"
                      :store="store"
                      :border="border"
                      :style="bodyWidth" />
      </div>
      <div class="vx-table--fixed-right-body"
           ref="rightFixedBodyWrapper">
        <table-body fixed="left"
                    :store="store"
                    :stripe="stripe"
                    :style="bodyWidth" />
      </div>
    </div>
  </div>
</template>
<script>
  import TableStore from './store'
  import TableLayout from './layout'
  import TableBody from './body'
  import TableHeader from './header'
  import Scrollbar from 'smooth-scrollbar'
  import Mousewheel from '@/directives/mousewheel'
  import Check from '@/utils/check'
  let tableIdSeed = 1
  export default {
    name: 'vx-table',
    components: { TableBody, TableHeader },
    directives: { Mousewheel },
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      },
      border: Boolean,
      cellStyle: [Function],
      cellClassName: [String, Function],
      headerCellClassName: [String, Function],
      headerClassName: [String, Function],
      headerStyle: [Object, Function],
      rowClassName: [String, Function],
      rowStyle: [Object, Function],
      height: [String, Number],
      stripe: { type: Boolean, default: false }, // 是否为斑马纹
      emptyText: String,
      tableSize: String
    },
    data() {
      const store = new TableStore(this)
      const layout = new TableLayout({
        store,
        table: this
      })
      return {
        layout,
        store,
        tableId: 'vx-table--1',
        scroller: null,
        scrollPosition: 'left'
      }
    },
    computed: {
      columns() {
        return this.store.states.columns
      },
      fixedColumns() {
        return this.store.states.fixedColumns
      },
      rightFixedColumns() {
        return this.store.states.fixedRightColumns
      },
      bodyWidth() {
        return {
          width: this.layout.bodyWidth ? `${this.layout.bodyWidth}px` : ''
        }
      },
      bodyHeight() {
        if (Check.isNumber(this.height)) {
          return {
            height: this.layout.bodyHeight ? `${this.layout.bodyHeight}px` : ''
          }
        } else if (this.height) {
          return {
            height: this.height
          }
        }
        return {}
      },
      fixedBodyHeight() {
        let s = {
          top: this.layout.headerHeight ? `${this.layout.headerHeight}px` : ''
        }
        if (this.height) {
          s.height = this.layout.fixedBodyHeight ? `${this.layout.fixedBodyHeight}px` : ''
        }
        return s
      },
      fixedStyle() {
        return {
          width: this.layout.fixedWidth ? `${this.layout.fixedWidth}px` : '',
          height: this.layout.viewportHeight ? `${this.layout.viewportHeight}px` : ''
        }
      }
    },
    created() {
      this.tableId = `vx-table--${tableIdSeed++}`
      this.debouncedUpdateLayout = () => {
        setTimeout(() => {
          this.doLayout()
        }, 50)
      }
    },
    methods: {
      doLayout() {
        this.layout.updateColumnsWidth()
        this.layout.updateElsHeight()
      },
      onFixedMousewheel(event, data) {
        if (this.scroller) {
          const bodyWrapper = this.$refs.bodyWrapper
          if (Math.abs(data.spinY) > 0) {
            const currentScrollTop = this.scroller.offset.y
            if (data.pixelY < 0 && currentScrollTop !== 0) {
              event.preventDefault()
            }
            if (data.pixelY > 0 && bodyWrapper.scrollHeight - bodyWrapper.clientHeight > currentScrollTop) {
              event.preventDefault()
            }
            this.scroller.scrollTop += Math.ceil(data.pixelY / 5)
          } else {
            this.scroller.scrollLeft += Math.ceil(data.pixelX / 5)
          }
        }
      },
      bindEvents() {
        let that = this
        if (this.scroller) {
          this.scroller.addListener(status => {
            let { bodyWrapper, headerWrapper, fixedBodyWrapper, rightFixedBodyWrapper } = that.$refs
            if (headerWrapper) headerWrapper.scrollLeft = status.offset.x
            if (fixedBodyWrapper) fixedBodyWrapper.scrollTop = status.offset.y
            if (rightFixedBodyWrapper) rightFixedBodyWrapper.scrollTop = status.offset.y
            const maxScrollLeftPosition = bodyWrapper.scrollWidth - bodyWrapper.offsetWidth - 1
            const scrollLeft = status.offset.x
            if (scrollLeft >= maxScrollLeftPosition) {
              this.scrollPosition = 'right'
            } else if (scrollLeft === 0) {
              this.scrollPosition = 'left'
            } else {
              this.scrollPosition = 'middle'
            }
          })
        }
      }
    },
    mounted() {
      this.store.updateColumns()
      this.doLayout()
      if (this.height) {
        this.scroller = Scrollbar.init(this.$refs.bodyWrapper, {
          alwaysShowTracks: false,
          damping: 0.2
        })
        this.$nextTick(() => {
          this.bindEvents()
        })
      }
      window.onresize = () => {
        this.doLayout()
      }
    },
    watch: {
      height: {
        immediate: true,
        handler(value) {
          this.layout.setHeight(value)
        }
      },
      data: {
        immediate: true,
        handler(value) {
          this.store.commit('setData', value)
          this.$nextTick(() => {
            this.doLayout()
            if (this.height) {
              this.bindEvents()
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .vx-table {
    position: relative;
    background: #fff;
    table {
      font-size: 14px;
      border: 0;
      background: #fff;
      th {
        background: #fafafa;
        color: #909399;
        padding: 0px 10px;
      }
      th,
      td {
        border: 0;
        height: 40px;
        word-wrap: break-word;
        text-align: left;
        position: relative;
        // border-bottom: 1px solid #ededed;
        .cell {
          padding: 5px 10px;
        }
      }
      tr {
        transition: all 0.2s ease;
      }
    }
    &--body {
      table-layout: fixed;
      border-collapse: separate;
      tr.hover-row {
        background: #f5f7fa !important;
      }
      .scrollbar-track-x {
        opacity: 1 !important;
      }
    }
    &--border {
      border-top: 1px solid #ededed;
      border-left: 1px solid #ededed;
      table {
        th,
        td {
          border-right: 1px solid #ededed;
        }
      }
    }
    &--stripe {
      .vx-table--body {
        tr:nth-child(odd) {
          background: #f8f8f8;
        }
      }
    }
    &--header {
      overflow-x: hidden;
    }
    &--fixed {
      position: absolute;
      top: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
      background: #ffffff;
      &--header,
      &-body {
        position: absolute;
        left: 0;
        top: 0;
        overflow-y: hidden;
      }
    }
    &--body.is-scrolling-left ~ &--fixed,
    &--body.is-scrolling-none ~ &--fixed,
    &--body.is-scrolling-none ~ &--fixed-right,
    &--body.is-scrolling-right ~ &--fixed-right {
      box-shadow: none;
    }
    &--empty {
      line-height: 80px;
      text-align: center;
    }
  }
</style>
