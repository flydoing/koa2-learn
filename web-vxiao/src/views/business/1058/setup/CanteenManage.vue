<template>
  <page title="食堂管理" hasSubmit @submit="commitCanteenInfo">
    <item class="full-input" v-if="categorys.length>0&&category.status!=='d'" v-for="(category, i) in categorys" :key="i" :hasClick="false">
      <input type="text" placeholder="食堂名称" v-model="category.name">
      <i class="ico ico-delete" slot="remark" @click="deleteCanteen(category)"></i>
    </item>
    <item @click="addCanteen">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div>新增食堂</div>
    </item>
  </page>
</template>
<script>
  import Api from '../api'
  import G from '@/views/group/mixin'
  export default {
    mixins: [G],
    data() {
      return {
        categorys: [],
        initCategory: {
          name: '',
          type: '31',
          status: '1'
        }
      }
    },
    created() {
      this.initCategory.groupId = this.currentGroup.groupId
      Api.loadCanteenInfo(31, this.currentGroup.groupId).then(res => {
        this.categorys = res.categorys
        this.categorys.push(this.initCategory)
      })
    },
    methods: {
      commitCanteenInfo() {
        let categorys = []
        categorys = this.categorys.filter(c => {
          return c.name !== ''
        })
        this.modifyCanteen({
          categorys: categorys
        })
      },
      modifyCanteen(d) {
        Api.modifyCanteen(d).then(res => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.routeBack()
        })
      },
      deleteCanteen(category) {
        category.status = 'd'
      },
      addCanteen() {
        this.initCategory = {
          name: '',
          type: '31',
          status: '1',
          groupId: this.currentGroup.groupId
        }
        this.categorys.push(this.initCategory)
      }
    }
  }

</script>
