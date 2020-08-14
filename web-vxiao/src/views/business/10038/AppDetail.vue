<template>
  <AppPage :title="title"
           ref="_page"
           :showTips="showTips"
           :loading="loading">
    <label v-if="isEducation && (isAdmin || isAppAdmin('10038', groupId))"
           slot="btn"
           @click="handleImport">导入</label>
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <AppCommon :app="curApp"
               :hasTemplate="false"
               :hasReport="false" />
    <template v-if="list.length > 0">
      <div class="category-title"></div>
      <template v-if="sid !== undefined || isSchool">
        <item v-for="(item, i) in  list"
              :key="i"
              :label="item.name"
              :remark="item.description"
              @click="handleItem(item)">
        </item>
      </template>
      <template v-else>
        <div v-for="(item, i) in  results"
             :key="i">
          <item :label="item.name"
                :remark="item.remark"
                :hasClick="hasClick(item)"
                @click="handleItem(item)">
          </item>
          <template v-if="item.groups">
            <item v-for="(child, j) in item.groups"
                  :key="j"
                  :label="child.name"
                  :remark="child.remark"
                  :hasClick="hasClick(child)"
                  @click="handleItem(child)">
              <div slot="before">
                <img v-lazy="{src:'/static/ico/ico_angle.png'}">
              </div>
            </item>
          </template>
        </div>
      </template>
    </template>
  </AppPage>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  export default {
    mixins: [R],
    props: { app: Object },
    components: {
      AppCommon: resolve => require(['@/views/group/app/AppCommon'], resolve)
    },
    data() {
      return {
        keyword: '',
        list: [],
        results: [],
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      sid() {
        return this.routeQuery('schoolId')
      },
      title() {
        return this.routeQuery('title') || this.curApp.name
      },
      showTips() {
        return this.list.length === 0
      },
      curApp() {
        return this.currentApp || this.app
      }
    },
    mounted() {
      this.fectchData()
    },
    methods: {
      hasClick(item) {
        return (item.childCount || 0) > 0 || item.extension === 'school'
      },
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fectchData() {
        if (this.sid || this.isSchool) {
          Api.getColumns(this.sid || this.schoolId, 1).then(res => {
            this.list = res.projects || []
          })
        } else {
          Api.getOrgs(this.currentGroup.id).then(res => {
            this.results = this.list = res.groups || []
          })
        }
      },
      iterateGroups(datas, groups) {
        datas.forEach(v => {
          groups.push(v)
          if (v.groups) {
            this.iterateGroups(v.groups, groups)
          }
        })
        return groups
      },
      handleItem(item) {
        if (this.sid || this.isSchool) {
          let query = { title: item.name, columnId: item.id }
          if (this.sid) {
            query.schoolId = this.sid
          }
          this.routePush({
            name: 'columnInfo10038',
            query: query
          })
        } else if (item.extension === 'school') {
          this.routePushModel({
            path: `/vx/group/business/${item.groupId}`,
            query: {
              appType: '10038',
              groupId: item.groupId,
              schoolId: item.parentId,
              title: item.name
            }
          })
        } else {
          this.routePush({
            name: 'subordinate10038',
            query: { title: item.name },
            params: {
              rootId: item.id,
              schoolId: item.parentId
            }
          })
        }
      },
      handleImport() {
        this.$import({
          title: '导入',
          uploadURI: this.uploadURL,
          templateUrl: `/base/institution/import/templet?schoolId=${this.schoolId}`,
          callback: (res, file) => {
            let fileId = res.file.id
            Api.importColumnInfo(this.schoolId, fileId)
              .then(result => {
                this.$message({ type: 'success', message: '操作成功' })
              })
              .catch(result => {
                if (result.commonTable) {
                  let tbl = result.commonTable
                  this.setStorage('_import_receipt', { lines: tbl.datas, headers: tbl.titles })
                  this.routePush({
                    path: '/vx/group/import/receipt',
                    query: {
                      uri: `/base/institution/import?schoolId=${this.schoolId}`,
                      fileId: fileId
                    }
                  })
                }
              })
          }
        })
      }
    },
    watch: {
      keyword(value) {
        let groups = this.iterateGroups(this.list, [])
        this.results = groups.filter(v => {
          return v.name.indexOf(value) !== -1
        })
      },
      '$route.params.groupId'(v) {
        this.fectchData()
      },
      currentApp(v) {
        this.fetchData()
      }
    }
  }
</script>
