<template>
  <page title="选择评估对象">
    <div class="student-list">
      <item v-for="(item,i) in objects"
            :key="i"
            :item="item"
            @click="handleObject(item)">
        <div slot="before">
          <img class="avatar"
               v-lazy="{src:toAvatar(item.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="stateTxt(item.type)"></div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        objects: [],
        title: ''
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fetchData() {
        const that = this
        that.msgId = this.routeParam('msgId')
        that.apslUserId = this.routeQuery('uId') || this.userId
        that.joinIn = this.routeQuery('joinIn')
        if (that.msgId) {
          Api.loadObjectsData(that.msgId, that.apslUserId).then(res => {
            that.objects = res.datas
            that.title = res.title
          })
        }
      },
      toAvatar(value) {
        return this.url(value)
      },
      stateTxt(type) {
        return type === '1' ? '已评' : '未评'
      },
      handleObject(item) {
        this.setStudentAppraisal({ user: item })
        this.routePush({
          name: 'apslDetail1196',
          params: {
            msgId: this.msgId
          },
          query: {
            auId: this.apslUserId,
            title: `${this.title} - ${item.name}`,
            joinIn: this.joinIn
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .student-list {
    img {
      margin: rem(5) 0;
    }
  }
</style>
