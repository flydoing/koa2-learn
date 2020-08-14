<template>
  <page title="选择类型">
    <template v-for="(item,i) in list">
      <div class="category-title text"
           v-html="item.name"
           :key="i"></div>
      <item v-for="(child,j) in item.childs"
            @click="handleSelect(child)"
            :hasArrow="false"
            :key="j">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active': child.selected}"></i>
        </div>
        <div slot="main"
             v-html="child.name"></div>
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

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
        expense: 'getExpense'
      })
    },
    methods: {
      ...mapActions(['setExpense']),
      fetchData() {
        const that = this
        let type = that.expense.form.type || {}
        CategoryApi.getCategorysByTypes('74_75').then(res => {
          res.categorys.map(v => {
            if (v.type === '74') {
              let childs = res.categorys.filter(c => {
                c.selected = type.id === c.id
                return c.parentId === v.id
              })
              that.list.push({ ...v, childs: childs })
            }
          })
        })
      },
      handleSelect(item) {
        this.setExpense({ form: { ...this.expense.form, type: item } })
        this.routeBack()
      }
    }
  }
</script>
