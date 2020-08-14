<template>
  <Page :title="title"
        ref="_page"
        :showTips="showTips"
        :loading="loading">
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
    <!-- <item :label="superior.name"
          :remark="superior.remark"
          :hasClick="false">
    </item> -->
    <template v-if="results.length > 0">
      <!-- <div class="category-title"></div> -->
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
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        superior: {},
        results: [],
        keyword: '',
        loading: false
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      showTips() {
        return this.list.length === 0
      }
    },
    methods: {
      ...mapActions(['modifyCreateObjectField']),
      hasClick(item) {
        return (item.childCount || 0) > 0 || item.extension === 'school'
      },
      fectchData() {
        Api.getOrgs(this.routeParam('rootId')).then(res => {
          this.results = this.list = res.groups || []
        })
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
        if (item.extension === 'school') {
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
      }
    },
    watch: {
      '$route.params.rootId'(v) {
        this.fectchData()
      },
      keyword(value) {
        let groups = this.iterateGroups(this.list, [])
        this.results = groups.filter(v => {
          return v.name.indexOf(value) !== -1
        })
      }
    }
  }
</script>
