<template>
  <page title="选择类型"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item, i) in list"
          :key="i"
          :hasArrow="false"
          :label="item.name"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

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
        crm: 'getCrm'
      })
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        const that = this
        let tMap = new Map()
        if (Check.isRealArray(that.crm.types)) {
          that.crm.types.map(v => {
            tMap.set(v.id, v)
          })
        }

        CategoryApi.getCategorysByType('52').then(res => {
          if (res.categorys) {
            this.list = res.categorys.map(v => {
              v.selected = Check.isObject(tMap.get(v.id))
              return v
            })
          }
        })
      },
      handleSelect(item) {
        item.selected = !item.selected
      },
      handleSubmit() {
        let form = this.crm.form
        let types = this.list.filter(v => {
          return v.selected
        })
        if (form.id) {
          if (!Check.isRealArray(types)) {
            this.$message({ message: '请选择类型', type: 'warning' })
            return false
          }
          Api.modifyCustomer(
            {
              metaDatas: types.map(v => {
                return {
                  metaType: 'm_category',
                  extension: form.groupId,
                  obj: v.name,
                  userId: v.id
                }
              })
            },
            form.msgId
          ).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        } else {
          this.setCrm({ types: types })
          this.routeBack()
        }
      }
    }
  }
</script>
