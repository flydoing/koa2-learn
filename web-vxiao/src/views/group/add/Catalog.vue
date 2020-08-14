<template>
  <Page title="目录"
        hasSubmit
        @submit="submit">
    <div style="padding:10px;">
      <el-tree ref="_tree"
               :data="catalogs"
               node-key="id"
               default-expand-all>
        <div class="custom-tree-node"
             slot-scope="{ node, data }">
          <span>{{data.index}} {{data.name}}</span>
          <span>
            <span class="text-color"
                  @click.stop="append(node,data)"
                  v-if="data.type!=='12'">新增</span>
            <span class="text-color"
                  v-if="data.type !== '0'"
                  @click.stop="edit(node,data)">编辑</span>
            <span class="text-color error"
                  v-if="data.type !== '0'"
                  @click.stop="remove(node,data)">删除</span>
          </span>
        </div>
      </el-tree>
    </div>
  </Page>
</template>
<script>
  import http from '@/utils/http'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        loading: true,
        categorys: [
          {
            id: new Date().getTime(),
            name: '一级目录名称',
            type: '11'
          },
          {
            id: new Date().getTime() + 1,
            name: '二级目录名称',
            type: '12'
          }
        ]
      }
    },
    computed: {
      catalogs() {
        let _arr = []
        let i = 1
        let j = 1
        let tmp = {}
        this.categorys.forEach(c => {
          if (c.type === '11') {
            tmp = {
              index: i,
              children: [],
              ...c
            }
            _arr.push(tmp)
            i++
            j = 1
          } else {
            tmp.children.push({
              index: `${tmp.index}.${j}`,
              ...c
            })
            j++
          }
        })
        return [
          {
            type: '0',
            name: '目录',
            children: _arr
          }
        ]
      }
    },
    activated() {
      if (this.routeQuery('vId')) {
        http.get(`/business/practice/query/version/${this.routeQuery('vId')}`).then(res => {
          if (Check.isRealArray(this.categorys)) {
            this.categorys = res.categorys
          }
        })
      }
    },
    methods: {
      submit() {
        let _arr = []
        this.categorys.forEach(c => {
          _arr.push({ name: c.name, type: c.type })
        })
        this.setStorage('_cache_catalog', _arr)
        this.routeBack()
      },
      append(node, data) {
        let serialNumber = 1
        if (data.type === '0') {
          serialNumber = data.children.length + 1
        } else {
          serialNumber = `${data.index}.${data.children.length + 1}`
        }
        this.$prompt(' ', '新增', {
          inputPlaceholder: `${serialNumber} 目录名称`,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.$refs._tree.append(
              {
                id: new Date().getTime(),
                name: `${value}`,
                index: serialNumber,
                children: [],
                type: data.type === '0' ? '11' : '12'
              },
              node
            )
          })
          .catch(() => {})
      },
      edit(node, data) {
        this.$prompt(' ', '修改', {
          inputValue: data.name,
          inputPlaceholder: '目录名称',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            this.$set(data, 'name', value)
          })
          .catch(() => {})
      },
      remove(node, data) {
        this.$refs._tree.remove(node)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
