<template>
  <page :title="title">
    <ItemList v-if="group"
              @click="onGroup(group)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(group.logo),error:Image.ICO_GROUP}">
      <span slot="title">{{group.name}}</span>
      <span slot="main">{{group.remark}}</span>
    </ItemList>
    <template v-if="list.length > 0">
      <div class="category-title text">下级</div>
      <template v-for="g in list">
        <ItemList @click="onGroup(g)"
                  :key="g.groupId">
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:url(group.logo),error:Image.ICO_GROUP}">
          <span slot="title">{{g.name}}</span>
          <span slot="main">{{g.remark}}</span>
        </ItemList>
        <ItemList v-for="c in g.groups"
                  :key='c.groupId'
                  @click="onSubordinate(c)">
          <div slot="before">
            <img class="angle"
                 v-lazy="{src:'/static/ico/ico_angle.png'}">
          </div>
          <img slot="avatar"
               class="avatar"
               v-lazy="{src:url(c.logo),error:Image.ICO_GROUP}">
          <span slot="title">{{c.name}}</span>
          <span slot="main">{{c.remark}}</span>
        </ItemList>
      </template>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapActions } from 'vuex'
  import GroupApi from '@/api/group'

  export default {
    mixins: [R],
    data() {
      return {
        group: null,
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      ...mapActions(['modifyBranchId']),
      fetchData() {
        let group = this.getStorage(`_cache_root_group_${this.routeParam('id')}`, true)
        GroupApi.getTreeGroups(this.schoolId, group.id).then(res => {
          this.list = res.treeGroups || []
        })
        this.group = group
      },
      onGroup(g) {
        this.modifyBranchId(g.groupId)
        this.routePush({
          name: 'groupBranch',
          params: {
            branchId: g.groupId
          }
        })
      },
      onSubordinate(g) {
        if (g.childCount > 0) {
          this.setStorage(`_cache_root_group_${g.id}`, g)
          this.routePush({
            name: 'groupTree',
            params: { id: g.id },
            query: { title: g.name }
          })
        } else {
          this.modifyBranchId(g.groupId)
          this.routePush({
            name: 'groupBranch',
            params: {
              branchId: g.groupId
            }
          })
        }
      }
    },
    watch: {
      '$route.param.id'(val) {
        if (val) {
          this.fetchData()
        }
      }
    }
  }
</script>
<style lang="scss">
  .angle {
    margin-left: rem(14);
  }
</style>
