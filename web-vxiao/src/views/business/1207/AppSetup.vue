<template>
  <Setup appType="'1207'">
    <template slot="others">
      <div @click="universityLibrary(viotStyle)"
           v-for="(viotStyle,i) in viotStyles"
           :key="i">
        <item>
          <div slot="main">{{viotStyle.styleName}}</div>
          <div slot="remark"></div>
        </item>
      </div>
      <item @click="addModel()">
        <div slot="main">新增模式</div>
        <div slot="remark"></div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        viotStyles: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      universityLibrary(viotStyle) {
        let models = {
          status: '1',
          schoolId: this.currentGroup.parentId,
          viotStyle: viotStyle
        }
        console.log(models)
        this.setStorage('_addModel', models)
        this.routePush({ name: 'patternDetails1207' })
      },
      fetchData() {
        let schoolId = this.currentGroup.parentId
        Api.getAllModes(schoolId).then(res => {
          this.viotStyles = res.viotStyles
        })
      },
      addModel() {
        // 传一个0和1作为是不是新增的
        let models = {
          status: '0',
          schoolId: this.currentGroup.parentId
        }
        this.setStorage('_addModel', models)
        this.routePush({ name: 'patternDetails1207' })
      }
    }
  }
</script>
