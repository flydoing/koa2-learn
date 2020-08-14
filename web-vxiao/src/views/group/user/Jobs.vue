<template>
  <Page title="选择职位"
        @submit="handleSubmit"
        hasSubmit>
    <Item v-for="(item,i) in list"
          :key="i"
          :label="item.name"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <template slot="after">&nbsp;</template>
    </Item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import CategoryApi from '@/api/category'
  import MetaData from '@/constant/metaData'
  import Api from '@/api/group'
  export default {
    mixins: [R],
    data() {
      return {
        list: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {},
    methods: {
      fetchData() {
        const that = this
        that.caches = that.getStorage('_cache_group_user_jobs')
        let jMap = new Map()
        if (Check.isRealArray(that.caches)) {
          that.caches.map(v => {
            jMap.set(parseInt(v.key), v)
          })
        }
        let type = this.routeQuery('isStudent') ? '92' : '106'
        CategoryApi.getGroupCategoryByType(this.currentGroup.groupId, type).then(res => {
          that.list = res.categorys.map(v => {
            v.selected = Check.isObject(jMap.get(v.id))
            return v
          })
        })
      },
      handleSubmit() {
        let id = this.routeQuery('relationId')
        let userId = this.routeQuery('userId')
        let jMap = new Map()
        let cMap = new Map()
        if (Check.isRealArray(this.caches)) {
          this.caches.map(v => {
            cMap.set(parseInt(v.key), v)
          })
        }

        let jobs = this.list.filter(v => {
          return v.selected
        })
        if (Check.isRealArray(jobs)) {
          jobs = jobs.map(v => {
            let job = {
              key: v.id,
              obj: v.name,
              status: '1',
              userId: userId,
              metaType: MetaData.JOB
            }
            jMap.set(v.id, v)
            cMap.get(v.id) && (job.id = cMap.get(v.id).id)
            return job
          })
        }

        if (Check.isRealArray(this.caches)) {
          this.caches.map(v => {
            if (!jMap.get(parseInt(v.key))) {
              jobs.push({ ...v, status: 'd' })
            }
          })
        }

        Api.modifyGroupUser({
          id: id,
          userId: userId,
          groupId: this.currentGroup.groupId,
          metaDatas: jobs
        }).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.routeBack()
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
      }
    }
  }
</script>
