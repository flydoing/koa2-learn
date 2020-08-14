<template>
  <page title="岗位设置">
    <div v-for="(item,i) in list" :key="i">
      <div class="category-title text" v-html="item.name"></div>
      <item v-for="(post,j) in item.categorys" :key="j" :hasClick="false">
        <div slot="main" v-html="post.name"></div>
        <i slot="after" class='ico ico-delete' @click="handleRemove(post, i, j)"></i>
      </item>
      <div class="button button-common" @click="handleAdd(item)">新增岗位</div>
    </div>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import CategoryApi from '@/api/category'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  components: {},
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
      handover: 'getHandover'
    })
  },
  methods: {
    ...mapActions(['setHandover']),
    fetchData() {
      const that = this
      Api.loadPostList(that.currentGroup.groupId).then(res => {
        that.list = res.campus || []
      })
    },
    handleAdd(item) {
      this.setHandover({ campus: item })
      this.routePush({ name: 'addPost1148' })
    },
    handleRemove(item, pIndex, index) {
      item.status = 'd'
      CategoryApi.addCategory([item]).then(res => {
        this.list[pIndex].categorys.splice(index, 1)
        this.$message({ message: '操作成功', type: 'success' })
      })
    }
  }
}

</script>
