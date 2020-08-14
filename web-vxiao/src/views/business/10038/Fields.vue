<template>
  <Page :title="title"
        :showTips="!editAble && list.length === 0"
        hasSubmit
        @submit="handleSubmit">
    <template slot="btn">
      <label v-if="editAble"
             @click="handleEdit">编辑栏目</label>
    </template>
    <template v-if="editAble">
      <draggable v-model="list">
        <item v-for="(item, i) in list"
              :key="i"
              @click="handleItem(item)"
              :label="item.name"
              :remark="item.description">
          <div slot="before"><i class="ico ico-vs-sort"></i></div>
        </item>
      </draggable>
      <item label="新增字段"
            :hasArrow="false"
            @click="handleAdd">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
      <div class="button button-common"
           @click="handleRemove">删除栏目</div>
    </template>
    <template v-else>
      <item v-for="(item, i) in list"
            :key="i"
            @click="handleItem(item)"
            :label="item.name"
            :remark="item.description">
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import Draggable from 'vuedraggable'
  import Check from '@/utils/check'
  export default {
    mixins: [R],
    components: { Draggable },
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.column.name || ''
      },
      column() {
        return this.obj.column || {}
      },
      editAble() {
        return this.obj.editAble || false
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fectchData() {
        if (this.obj.column) {
          Api.getFieldsByColumnId(this.obj.column.id).then(res => {
            this.list = res.items || []
          })
        }
      },
      handleSubmit() {
        Api.commitFieldSort({
          items: this.list.map(v => {
            return { id: v.id }
          })
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.isSort = !this.isSort
        })
      },
      handleItem(item) {
        this.setCreateObject({ field: item })
        this.routePush({
          name: 'fieldEdit10038'
        })
      },
      handleAdd() {
        this.routePush({
          name: 'fieldEdit10038'
        })
      },
      handleEdit() {
        this.$prompt(' ', '编辑栏目', {
          inputValue: this.column.name,
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '内容不能为空', type: 'warning' })
            return false
          }
          let _column = {
            ...this.column,
            name: value
          }
          Api.modifyColumn({ project: _column }).then(res => {
            this.setCreateObject({ column: _column })
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleRemove() {
        this.$confirm('确认删除该栏目？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyColumn({
            project: { ...this.column, status: 'd' }
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
