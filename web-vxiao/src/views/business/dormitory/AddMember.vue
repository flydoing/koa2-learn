<template>
  <page :title="title"
        listenBack
        @back="handleBack">
    <item v-for="(item, i) in users"
          :hasClick="false"
          :key="i">
      <div slot="before">
        <img class="avatar small"
             v-lazy="{src:url(item.avatar),error:Image.ICO_USER}"
             alt='头像' />
      </div>
      <div slot="main"
           v-html="item.name">
      </div>
      <div slot="remark"
           v-html="item.groupName"></div>
      <i slot="after"
         class='ico ico-delete'
         @click.stop="handleRemove(item, i)"></i>
    </item>
    <div v-if="users.length>0"
         class="category-title"></div>
    <item @click="handleAdd"
          :hasArrow="false">
      <div slot="before">
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">添加</div>
    </item>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        users: []
      }
    },
    mounted() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      fetchData() {
        Api.getDormitoryMember(this.routeQuery('dId')).then(res => {
          this.users = res.dormitoryUserRelations || []
        })
      },
      handleAdd() {
        this.setStorage('_dormitory_member_filter', this.users)
        this.getStorage('_dormitory_objects')
        this.routePush({
          path: '/vx/group/business/dormitory/selectGroup',
          query: { cId: this.routeQuery('cId') }
        })
      },
      handleRemove(item, i) {
        Api.removeDormitoryMember(item.id).then(res => {
          this.users.splice(i, 1)
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleBack() {
        this.getStorage('_dormitory_cache')
        this.routeBack()
      }
    }
  }
</script>
