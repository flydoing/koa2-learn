<template>
  <Scroller :height="sh"
            style="background:#FFF;">
    <ItemList v-for="column in columns"
              :key="column.id"
              @click="handle(column)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(column.logo,'thumb'),error:Image.ICO_GROUP}"
           alt='LOGO'>
      <span slot="title">{{column.name}}</span>
      <span slot="main">{{column.extension}}</span>
    </ItemList>
  </Scroller>
</template>
<script>
  import R from '../mixin'
  import Api from '@/api/group'
  export default {
    mixins: [R],
    components: {
      School: resolve => require(['../about/School'], resolve)
    },
    data() {
      return {
        columns: [],
        loading: true
      }
    },
    computed: {
      sh() {
        return this.innerHeight - 75 - 40 - 10
      }
    },
    created() {
      Api.getSchoolCategorys(this.groupId)
        .then(res => {
          this.loading = false
          this.columns = res.categorys || []
        })
        .catch(res => {
          this.loading = false
        })
    },
    methods: {
      handle(column) {
        this.setStorage('_message_params_cache', {
          groupId: this.groupId,
          queryType: 'category',
          categoryId: column.id
        })
        this.setStorage('_message_list_refresh', true)
        this.routePush({
          path: '/vx/group/business/message/list',
          query: {
            title: column.name
          }
        })
      }
    }
  }
</script>
