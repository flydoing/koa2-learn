<template>
  <Page title="目录"
        :hasSubmit="isEditMode"
        @submit="submit">
    <label slot="btn"
           v-if="isAdmin"
           @click="isEditMode = !isEditMode">{{isEditMode ? '取消编辑' : '编辑'}}</label>
    <div style="padding:10px;">
      <el-tree :data="catalogs"
               default-expand-all>
        <div class="custom-tree-node"
             slot-scope="{ node, data }">
          <span>{{data.name}}</span>
          <span v-if="isEditMode">
            <span class="text-color"
                  @click.stop="append(node,data)"
                  v-if="data.type !=='12'">新增</span>
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
  export default {
    data() {
      return {
        loading: true,
        categorys: [],
        isEditMode: false,
        isAdmin: false
      }
    },
    computed: {
      catalogs() {
        let _arr = []
        let tmp = {}
        this.categorys.forEach(c => {
          if (c.type === '11') {
            tmp = {
              children: [],
              ...c
            }
            _arr.push(tmp)
          } else {
            tmp.children.push({ ...c })
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
      this.isAdmin = this.routeQuery('isAdmin')
      http.get(`/business/course/query/chapter/${this.routeQuery('groupId')}?isSerial=1`).then(res => {
        this.categorys = res.categorys || []
      })
    },
    methods: {
      submit() {
        let _arr = []
        this.catalogs.forEach(c => {
          if (c.type !== '0') {
            _arr.push({
              id: c.id || void 0,
              type: `${c.type}`,
              name: c.name.replace(`${c.serialNumber}`, '').trim()
            })
          }
          c.children.forEach(_c => {
            _arr.push({
              id: _c.id || void 0,
              type: `${_c.type}`,
              name: _c.name.replace(`${_c.serialNumber}`, '').trim()
            })
            _c.children.forEach(__c => {
              _arr.push({
                id: __c.id || void 0,
                type: `${__c.type}`,
                name: __c.name.replace(`${__c.serialNumber}`, '').trim()
              })
            })
          })
        })
        http
          .post('/business/course/add', {
            course: {
              categorys: _arr,
              groupId: this.routeQuery('groupId'),
              id: this.routeQuery('id')
            }
          })
          .then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.isEditMode = false
          })
          .catch(res => {
            this.$message({
              type: 'warning',
              message: '修改失败'
            })
          })
      },
      append(node, data) {
        let serialNumber = 1
        if (data.type === '0') {
          serialNumber = data.children.length + 1
        } else {
          serialNumber = `${data.index || data.serialNumber}.${data.children.length + 1}`
        }
        this.$prompt(' ', '新增', {
          inputPlaceholder: `${serialNumber} 目录名称`,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            data.children.push({
              name: `${serialNumber} ${value}`,
              serialNumber: serialNumber,
              groupId: this.routeQuery('groupId'),
              children: [],
              type: data.type === '0' ? '11' : '12'
            })
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
        if (data.id) {
          http
            .post('/business/course/delete/outline', {
              course: {
                categoryId: data.id,
                action: 1
              }
            })
            .then(res => {
              this.$message({ type: 'success', message: '删除成功' })
            })
        }
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
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
