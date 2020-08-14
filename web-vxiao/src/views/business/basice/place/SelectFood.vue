<template>
  <Page title="选择食堂"
        :showTips="showTips">
    <label slot="btn"
           @click="add">新增</label>
    <label slot="btn"
           @click="showDelete = !showDelete">管理食堂</label>
    <Item v-for="(food,i) in foods"
          :key="food.id"
          @click="handle(food)">
      <div>{{food.name}}</div>
      <div slot="after"
           v-if="showDelete"
           @click.stop="remove(food,i)">
        <i class="ico ico-delete" />
      </div>
    </Item>
  </Page>
</template>
<script>
import Api from '@/api/category'
export default {
  data() {
    return {
      foods: [],
      showDelete: false
    }
  },
  computed: {
    showTips() {
      return this.foods.length === 0
    }
  },
  created() {
    Api.getCategorys({ type: 31, groupId: this.routeQuery('groupId') }).then(res => {
      this.foods = res.categorys
    })
  },
  methods: {
    add() {
      this.$prompt(' ', '添加', {
        inputPlaceholder: '食堂名称',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          Api.addCategory([
            {
              groupId: this.routeQuery('groupId'),
              name: value,
              type: '31',
              status: '1'
            }
          ]).then(res => {
            if (res.categorys) {
              res.categorys.forEach(c => {
                this.foods.push(c)
              })
            }
          })
        })
        .catch(() => {})
    },
    handle(food) {
      if (!this.showDelete) {
        this.setStorage('_cache_food', food)
        this.routeBack()
      }
    },
    remove(food, i) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        Api.addCategory([{ id: food.id, status: 'd' }]).then(res => {
          this.$message({ type: 'success', message: '删除成功' })
          this.foods.splice(i, 1)
        })
      })
    }
  }
}
</script>
