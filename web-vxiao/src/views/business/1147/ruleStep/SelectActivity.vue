<template>
  <page title="固定安排选修活动">
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item)"
          :label="item.name">
      <i slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item, i)"></i>
    </item>
    <div class="category-title"></div>
    <item @click="handleAdd"
          :hasArrow="false"
          label="添加选项">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  import Api from '../api'
  import CategoryApi from '@/api/category'

  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      all() {
        if (Check.isRealArray(this.list)) {
          let items = this.list.filter(v => {
            return v.selected
          })
          return items.length === this.list.length
        }
        return false
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        CategoryApi.getCategorys({ type: '95', groupId: this.groupId }).then(res => {
          this.list = res.categorys || []
        })
      },
      handleSelect(item) {
        let form = this.obj.form
        let data = form.ruleData
        Api.setRuleInfo({
          rule: {
            type: '3',
            scheduleId: form.schedule.id,
            sections: data.rules.map(v => {
              return {
                dayIndex: v.dayIndex,
                sectionIndex: v.sectionIndex
              }
            }),
            datas: [
              {
                extension: item.name,
                key: item.id,
                obj: item.name
              }
            ]
          }
        }).then(res => {
          this.setCreateObject({
            form: {
              ...form,
              ruleData: {
                ...data,
                rules: []
              }
            }
          })
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack(-2)
        })
      },
      handleRemove(item, i) {
        CategoryApi.addCategory([
          {
            id: item.id,
            groupId: this.groupId,
            status: 'd'
          }
        ]).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.list.splice(i, 1)
        })
      },
      handleAdd() {
        this.$prompt(' ', '新增', {
          inputPlaceholder: '活动名称',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '活动名称不能为空', type: 'warning' })
            return false
          }
          CategoryApi.addCategory([
            {
              name: value,
              groupId: this.groupId,
              type: '95',
              status: '1'
            }
          ]).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.list.push(...res.categorys)
          })
        })
      }
    }
  }
</script>
