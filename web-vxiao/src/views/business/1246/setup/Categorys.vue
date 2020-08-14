<template>
  <Page title="类型管理">
    <Item v-for="(category,i) in categories"
          :key="category.id">
      <div>{{category.name}}</div>
      <template slot="after"
                v-if="category.extension==='1'"></template>
      <i v-else
         slot="after"
         class="ico ico-delete"
         @click='remove(category,i)'></i>
    </Item>
    <Item @click="add"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div>添加类型</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        categories: []
      }
    },
    created() {
      Api.getScreenTypes(this.currentGroup.parentId).then(res => {
        this.categories = res.categories
      })
    },
    methods: {
      add() {
        this.$prompt(' ', '添加类型', {
          inputPlaceholder: '内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            if (!Check.isNullString(value)) {
              Api.modifyScreenType({
                categories: [
                  {
                    groupId: this.groupId,
                    name: value
                  }
                ]
              }).then(res => {
                this.categories = [...this.categories, ...res.categories]
              })
            }
          })
          .catch(() => {})
      },
      remove(category, index) {
        Api.modifyScreenType({
          categories: [
            {
              id: category.id,
              status: 'd'
            }
          ]
        }).then(res => {
          this.categories.splice(index, 1)
        })
      }
    }
  }
</script>
