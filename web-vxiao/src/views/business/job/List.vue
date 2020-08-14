<template>
  <page title="职位信息">
    <template v-if="isSchool">
      <div v-for="(item, i) in list"
           :key="i">
        <div class="category-title text"
             v-html="item.title"></div>
        <item v-for="(job, j) in item.categorys"
              :key="j"
              :label="job.name"
              :hasClick="item.editAble"
              :hasArrow="false"
              @click="handleEdit(job, item.categoryType)">
          <i class="ico ico-delete"
             v-if="item.editAble"
             slot="after"
             @click.stop="handleRemove(job, i, j)"></i>
        </item>
        <item label="新职位"
              :hasArrow="false"
              v-if="item.editAble"
              @click="handleEdit(false, item.categoryType, i)">
          <div slot="before"><i class="ico ico-plus"></i></div>
        </item>
      </div>
    </template>
    <template v-else>
      <div class="category-title center"
           v-if="!editAble">由最高一级管理机构定义</div>
      <item v-for="(item, i) in list"
            :key="i"
            :label="item.name"
            :hasClick="editAble"
            :hasArrow="false"
            @click="handleEdit(item, false, i)">
        <i class="ico ico-delete"
           v-if="editAble"
           slot="after"
           @click.stop="handleRemove(item, i)"></i>
      </item>
      <item label="新职位"
            :hasArrow="false"
            v-if="editAble"
            @click="handleEdit">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </template>

  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import CategoryApi from '@/api/category'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        editAble: false,
        type: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    components: {},
    methods: {
      fetchData() {
        GroupApi.getJobs(this.schoolId).then(res => {
          if (res.positions) {
            if (this.isSchool) {
              this.list = res.positions
            } else {
              this.list = res.positions[0].categorys || []
              this.type = res.positions[0].categoryType
              this.editAble = res.positions[0].editAble
            }
          }
        })
      },
      handleEdit(item, type, i) {
        this.$prompt(' ', item ? '编辑' : '新增', {
          inputValue: item ? item.name : '',
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '内容不能为空', type: 'warning' })
            return false
          }
          let c = {
            ...(item || {}),
            type: type || this.type,
            groupId: this.groupId,
            name: value
          }
          CategoryApi.addCategory([c]).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            if (item) {
              this.$set(item, 'name', value)
            } else {
              if (this.isSchool) {
                this.list[i].categorys.push(...(res.categorys || []))
              } else {
                this.list.push(...(res.categorys || []))
              }
            }
          })
        })
      },
      handleRemove(item, i, j) {
        CategoryApi.addCategory([{ ...item, status: 'd' }]).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          if (this.isSchool) {
            this.list[i].categorys.splice(j, 1)
          } else {
            this.list.splice(i, 1)
          }
        })
      }
    }
  }
</script>
