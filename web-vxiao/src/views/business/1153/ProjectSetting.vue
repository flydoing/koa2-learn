<template>
  <page title="体测项目设置"
        @submit="handleSubmit"
        hasSubmit>
    <item @click="handleAll"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':all}"></i>
      </div>
      <div slot="main">全部</div>
    </item>
    <div class="category-title"></div>
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        all: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        physicalTest: 'getPhysicalTest'
      })
    },
    methods: {
      fetchData() {
        const that = this
        let count = 0
        if (that.physicalTest.items) {
          that.list = that.physicalTest.items.map(v => {
            v.selected = v.extension !== '0'
            if (v.selected) {
              count++
            }
            return v
          })
          that.all = that.list.length === count
        }
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.list, index, item)

        let ps = this.list.filter(v => {
          return v.selected
        })
        this.all = ps.length === this.list.length
      },
      handleAll() {
        this.all = !this.all
        this.list = this.list.map(v => {
          v.selected = this.all
          return v
        })
      },
      handleSubmit() {
        let datas = []
        this.list.forEach((v, i) => {
          v.extension = v.selected ? '1' : '0'
          datas.push(v)
        })

        datas = datas.map(v => {
          delete v.selected
          return v
        })

        CategoryApi.addCategory(datas).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
