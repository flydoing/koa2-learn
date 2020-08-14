<template>
  <page title="体检项目设置"
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
      <template v-if="item.type!='s'">
      </template>
      <template v-else>
        <i slot="after"
           class='ico ico-delete'
           @click.stop="handleRemove(item,i)"></i>
      </template>
    </item>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <i class='ico ico-plus' />
      </div>
      <div slot="main">新建项目</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
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
        physicalExam: 'getPhysicalExam'
      })
    },
    methods: {
      fetchData() {
        const that = this
        let count = 0
        if (that.physicalExam.items) {
          that.list = that.physicalExam.items.map(v => {
            v.selected = v.isFlag !== '0'
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
      handleRemove(item, index) {
        item.status = 'd'
        Api.commitProjects([item]).then(res => {
          this.list.splice(index, 1)
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleAdd() {
        this.$prompt(' ', '新建项目', {
          inputPlaceholder: '项目名称',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            Api.commitProjects([{ name: value, groupId: this.currentGroup.groupId }]).then(res => {
              this.list = res.projects
              this.$message({ message: '操作成功', type: 'success' })
            })
          })
          .catch(() => {})
      },
      handleSubmit() {
        let datas = []
        this.list.forEach((v, i) => {
          v.isFlag = v.selected ? '1' : '0'
          datas.push(v)
        })

        datas = datas.map(v => {
          delete v.selected
          return v
        })

        Api.commitProjects(datas).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
