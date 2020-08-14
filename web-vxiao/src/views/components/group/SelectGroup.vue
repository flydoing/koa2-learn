<template>
  <div class="vx-group-select">
    <Item @click="onAll"
          :hasArrow="false"
          v-if="multiselect">
      <div slot="before">
        <i :class="prefixClsAll"></i>
      </div>
      <div>全选</div>
    </Item>
    <Item v-for="(g,i) in groups"
          :key="i"
          @click="onClickGroup(g)">
      <div v-if="multiselect"
           slot="before">
        <i :class="prefixCls(g.groupId)"></i>
      </div>
      <div>{{g.name}}</div>
      <div slot="remark"
           v-if="g.groupName">常驻：{{g.groupName}}</div>
      <template slot="after"
                v-if="multiselect"></template>
    </Item>
  </div>
</template>
<script>
  export default {
    props: {
      groups: {
        type: Array,
        default: () => {
          return []
        }
      },
      cache: {
        type: [Array, Object],
        default: () => {
          return []
        }
      },
      multiselect: {
        type: [String, Boolean],
        default: false
      }
    },
    created() {
      this.initData()
    },
    data() {
      return {
        isAll: false,
        checkList: {}
      }
    },
    computed: {
      prefixClsAll() {
        return [
          `ico ico-select`,
          {
            [`active`]: this.isAll
          }
        ]
      }
    },
    methods: {
      initData() {
        this.checkList = {}
        if (this.cache && this.cache.length > 0) {
          this.cache.forEach(g => {
            this.$set(this.checkList, g.groupId, g)
          })
        }
        // 去掉全选
        this.isAll = Object.values(this.checkList).length === this.groups.length
      },
      onAll() {
        this.isAll = !this.isAll
        if (this.isAll) {
          this.checkList = {}
          this.groups.forEach(g => {
            this.$set(this.checkList, g.groupId, g)
          })
        } else {
          this.checkList = {}
        }
        let values = Object.values(this.checkList)
        let keys = Object.keys(this.checkList)
        this.$emit('change', values, keys)
      },
      // handleSubmit() {
      //   if (Object.keys(this.checkList).length === 0) {
      //     this.$message({ type: 'warning', message: '还未选择任何群组' })
      //     return
      //   }
      //   this.$emit('submit', Object.values(this.checkList), Object.keys(this.checkList))
      // },
      onClickGroup(g) {
        if (this.multiselect) {
          this.checkList[g.groupId] ? this.$delete(this.checkList, g.groupId) : this.$set(this.checkList, g.groupId, g)
          let values = Object.values(this.checkList)
          let keys = Object.keys(this.checkList)
          this.$emit('change', values, keys, g, !!this.checkList[g.groupId])
          // 去掉全选
          this.isAll = values.length === this.groups.length
        } else {
          this.checkList = {}
          this.$set(this.checkList, g.groupId, g)
          this.$emit('change', g, !!this.checkList[g.groupId])
        }
      },
      getGroups() {
        return this.getValues()
      },
      getValues() {
        return Object.values(this.checkList)
      },
      getKeys() {
        return Object.keys(this.checkList)
      },
      prefixCls(groupId) {
        return [
          `ico ico-select`,
          {
            [`active`]: !!this.checkList[groupId]
          }
        ]
      }
    },
    beforeDestroy() {
      if (this.$route.path.indexOf('pages') > -1) {
        this.$emit('submit', Object.values(this.checkList))
      }
    },
    watch: {
      groups(gs) {
        this.groups = gs
      },
      cache(g) {
        this.initData()
      }
    }
  }
</script>
