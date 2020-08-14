<template>
  <Setup appType="'1264'">
    <template slot="others">
      <item @click="whiteList">
        <div slot="main">App白名单</div>
        <div slot="remark"
             v-text="appRelationCount"></div>
      </item>
      <item @click="urlWhiteList">
        <div slot="main">网址白名单</div>
        <div slot="remark"
             v-text="urlCount"></div>
      </item>
      <div class="category-title">桌面应用
      </div>
      <item @click="onDesktop(item)"
            v-for="(item,i) in appSettings"
            :key="i">
        <div slot="before">
          <i class="ico ico-select"
             :class="{'active':item.isSelect}"></i>
        </div>
        <div slot="main">{{item.name}}</div>
        <div slot="after"></div>
      </item>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import CardMixin from '@/views/components/card/mixin'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R, CardMixin],
    props: {
      message: { type: [Object] }
    },
    data() {
      return {
        appSettings: [],
        appRelationCount: '',
        urlCount: ''
      }
    },
    // 引入头部，应用提醒和新建权限
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['modifyMetaData']),
      isSwitched(meta) {
        return meta ? meta.obj === '1' : false
      },
      medalSetting() {
        this.routePush({
          name: 'medalSetting1264'
        })
      },
      handlePrint() {
        this.openBrowser(`/rest/webpage/index?path=rcd-print&name=assess&groupId=${this.currentGroup.groupId}`)
      },
      fetchData() {
        // 查询应用设置
        Api.appSettings(this.currentGroup.parentId).then(res => {
          this.appSettings = res.desktopAppRelations
          this.appRelationCount = res.appRelationCount
          this.urlCount = res.urlCount
        })
      },
      onDesktop(item) {
        // 点击桌面应用
        let active = item.isSelect
        this.$set(item, 'isSelect', !active)
        let desktopAppRelations = {
          desktopAppRelations: [
            {
              appType: item.appType,
              schoolId: this.currentGroup.parentId,
              isSelect: !item.isSelect === true ? '0' : '1'
            }
          ]
        }
        Api.cutState(desktopAppRelations)
          .then(res => {
            this.$message({ type: 'success', message: '修改成功' })
          })
          .catch(res => {
            this.$message({ type: 'warning', message: '修改失败' })
          })
      },
      whiteList() {
        // App白名单
        this.routePush({
          name: 'white1204',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      urlWhiteList() {
        // 网址白名单
        this.routePush({ name: 'internet1204' })
      }
    }
  }
</script>
