<template>
  <Setup :hasSubmit="isSort"
         @submit="handleSubmit">
    <template slot="btns">
      <label @click="handleSort"
             v-if="editAble && !isSort">排序</label>
    </template>
    <template slot="others">
      <template v-if="isSort">
        <draggable v-model="list">
          <item v-for="(item, i) in list"
                :key="i"
                @click="handleItem(item)"
                :label="item.name"
                :remark="item.childCount">
            <div slot="before"><i class="ico ico-vs-sort"></i></div>
          </item>
        </draggable>
      </template>
      <template v-else>
        <item v-for="(item, i) in list"
              :key="i"
              @click="handleItem(item)"
              :label="item.name"
              :remark="item.childCount">
        </item>
      </template>
      <item label="新增栏目"
            v-if="editAble"
            :hasArrow="false"
            @click="handleAdd">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import Draggable from 'vuedraggable'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve),
      Draggable
    },
    data() {
      return {
        list: [],
        editAble: false,
        isSort: false
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      if (this.obj.column) {
        this.modifyCreateObjectField('column')
      }
      Api.getColumns(this.schoolId).then(res => {
        this.list = res.projects || []
        this.editAble = res.editAble || false
      })
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      handleItem(item) {
        this.setCreateObject({ column: item, editAble: this.editAble })
        this.routePush({
          name: 'fields10038'
        })
      },
      handleAdd() {
        this.$prompt(' ', '新增栏目', {
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '内容不能为空', type: 'warning' })
            return false
          }
          Api.modifyColumn({
            project: {
              schoolId: this.schoolId,
              name: value
            }
          }).then(res => {
            this.list.push(res.project)
            this.$message({ message: '操作成功', type: 'success' })
          })
        })
      },
      handleSort() {
        this.isSort = !this.isSort
      },
      handleSubmit() {
        Api.commitColumnSort({
          projects: this.list.map(v => {
            return { id: v.id }
          })
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.isSort = !this.isSort
        })
      }
    }
  }
</script>
