<template>
  <page title="总结对象">
    <label slot="btn"
           @click="handleImport">导入</label>
    <div class="object-list">
      <item v-for="(item,i) in objects"
            :key="i"
            :item="item"
            :hasClick="isEdit(item)"
            @click="handleObject(item)">
        <div slot="before">
          <img class="avatar"
               v-lazy="{src:url(item.avatar),error:Image.ICO_USER}"
               alt='头像' />
        </div>
        <div slot="main"
             v-html="item.name"></div>
        <div slot="remark"
             v-html="item.description"></div>
        <div slot="after"
             v-if="!isEdit(item)"></div>
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
        objects: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        const that = this
        that.msgId = that.routeParam('msgId')
        that.readed = parseInt(that.routeQuery('readed'))
        Api.loadObjectsData(that.msgId).then(res => {
          that.objects = res.details
        })
      },
      isEdit(item) {
        return this.readed === 2 || (item.content && this.readed !== 2)
      },
      handleObject(item) {
        if (!this.isEdit(item)) {
          return false
        }
        this.setCreateObject({ item: item })
        this.routePush({
          name: 'addSummary1222',
          params: {
            msgId: this.msgId
          },
          query: {
            readed: this.readed
          }
        })
      },
      handleImport() {
        this.$import({
          title: '导入评价总结',
          uploadURI: `/commons/file/readExcel`,
          templateUrl: `/business/summary/exportTemplate/${this.msgId}`,
          callback: (res, file) => {
            this.setStorage('summary_import_cache', res.dataGirds[0].data)
            this.routePush({
              name: 'importView1222',
              query: { msgId: this.msgId }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .object-list {
    img {
      margin: rem(5) 0;
    }
  }
</style>
