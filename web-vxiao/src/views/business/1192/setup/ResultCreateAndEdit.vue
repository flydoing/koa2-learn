<template>
  <page :title="titleText" hasSubmit @submit="commitEdit">
    <item :hasClick="false">
      <div>标准名称</div>
      <input type="text" placeholder="请输入内容" v-model="cache.obj" slot="remark">
    </item>
    <item :hasClick="false">
      <div>分值下限</div>
      <div slot="remark">
        <input type="text" placeholder="请输入分数" v-model="cache.key">分
      </div>
    </item>
    <div class="list-button" v-if="routeQuery('isEdit')">
      <div class="button" @click="deleteHandle">删除标准</div>
    </div>
  </page>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    data() {
      return {
        cache: {}
      }
    },
    created() {
      this.cacheArr = JSON.parse(JSON.stringify(this.template.metaDatas))
      this.cache = this.routeQuery('isEdit') ? this.cacheArr[this.routeQuery('index')] : {}
    },
    methods: {
      ...mapActions(['saveTemplate']),
      deleteHandle() {
        this.cacheArr.splice(this.routeQuery('index'), 1)
        this.setExtension(this.cacheArr)
        this.commitVuex(this.cacheArr)
      },
      commitEdit() {
        if (this.routeQuery('isEdit')) {
          let index = this.routeQuery('index')
          let caches = this.cacheArr
          caches.splice(index, 1, this.cache)
          caches.sort(this.sortFn('key'))
          this.setExtension(caches)
          this.commitVuex(caches)
        } else {
          this.cacheArr.push({
            obj: this.cache.obj,
            key: this.cache.key,
            extension: 1
          })
          this.cacheArr.sort(this.sortFn('key'))
          this.setExtension(this.cacheArr)
          this.commitVuex(this.cacheArr)
        }
      },
      commitVuex(arr) {
        this.saveTemplate({
          ...this.template,
          metaDatas: [...arr]
        })
        this.routeBack()
      },
      sortFn(key) {
        return (a, b) => {
          let v1 = Number(a[key])
          let v2 = Number(b[key])
          return v2 - v1
        }
      },
      setExtension(arr) {
        arr.forEach((item, i) => {
          item.extension = 1
          if (i === arr.length - 1) {
            item.extension = 0
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        template: 'getPublicCourseTemplate'
      }),
      titleText() {
        return this.routeQuery('isEdit') ? '编辑' : '新建'
      }
    }
  }

</script>
