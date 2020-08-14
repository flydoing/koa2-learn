export default {
  created() {
    this.tableLayout.addObserver(this)
  },
  computed: {
    tableLayout() {
      let layout = this.layout
      if (!layout && this.table) {
        layout = this.table.layout
      }
      if (!layout) {
        throw new Error('Can not find table layout.')
      }
      return layout
    }
  },
  destroyed() {
    this.tableLayout.removeObserver(this)
  },
  mounted() {
    this.onColumnsChange()
  },
  updated() {
    this.$nextTick(() => {
      this.onColumnsChange()
    })
  },
  methods: {
    onColumnsChange() {
      let totalWidth = 0
      const cols = this.$el.querySelectorAll('colgroup > col')
      if (!cols.length) return
      const columnsMap = {}
      this.columns.forEach((column) => {
        columnsMap[column.id] = column
      })
      for (let i = 0, j = cols.length; i < j; i++) {
        const col = cols[i]
        const name = col.getAttribute('name')
        const column = columnsMap[name]
        if (column) {
          totalWidth += column.realWidth || column.width
          col.setAttribute('width', column.realWidth || column.width)
        }
      }
      this.$el.style.width = `${totalWidth}px`
    }
  }
}
