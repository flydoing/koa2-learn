<template>
  <page title="课程"
        :showTips="results.length === 0">
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
    <ItemList v-for="(g, i) in results"
              :key="i"
              @click="handleGroup(g)">
      <img slot="avatar"
           class="avatar"
           v-lazy="{src:url(g.logo),error:Image.ICO_GROUP}">
      <span slot="title">{{g.name}}</span>
      <span slot="main">{{g.remark}}</span>
      <template slot="after"></template>
    </ItemList>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  import { mapActions } from 'vuex'
  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        results: [],
        keyword: ''
      }
    },
    computed: {},
    created() {
      GroupApi.getGroupsByType({
        schoolId: this.schoolId,
        type: '23'
      }).then(res => {
        this.results = this.list = res.groups || []
      })
    },
    methods: {
      ...mapActions(['modifyBranchId']),
      handleGroup(g) {
        this.modifyBranchId(g.groupId)
        this.routePush({
          name: 'groupBranch',
          params: {
            branchId: g.groupId
          }
        })
      }
    },
    watch: {
      keyword(value) {
        if (Check.isNullString(value)) {
          this.results = [...this.list]
          return false
        }
        if (Check.isRealArray(this.list)) {
          this.results = this.list.filter(v => {
            return v.name.indexOf(value) !== -1
          })
        }
      }
    }
  }
</script>
