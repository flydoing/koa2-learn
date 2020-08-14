<template>
  <page title="任教科目"
        @submit="handleSubmit"
        hasSubmit>
    <item v-for="(item,i) in list"
          :key="i"
          :hasArrow="false"
          @click="handleSelect(item, i)">
      <div slot="before">
        <i class="ico ico-select"
           :class="{'active':item.selected}"></i>
      </div>
      <div slot="main"
           v-html="item.name"></div>
    </item>
  </page>
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
        that.caches = that.getStorage('_cache_group_user_subjects')
        let sMap = new Map()
        if (Check.isRealArray(that.caches)) {
          that.caches.map(v => {
            sMap.set(parseInt(v.key), v)
          })
        }

        CategoryApi.getCategorys({ type: '1', groupId: that.groupId }).then(res => {
          that.list = res.categorys.map(v => {
            v.selected = Check.isObject(sMap.get(v.id))
            return v
          })
        })
      },
      handleSubmit() {
        let id = this.routeQuery('relationId')
        let userId = this.routeQuery('userId')

        let sMap = new Map()
        let cMap = new Map()
        if (Check.isRealArray(this.caches)) {
          this.caches.map(v => {
            cMap.set(parseInt(v.key), v)
          })
        }

        let subjects = this.list.filter(v => {
          return v.selected
        })
        if (Check.isRealArray(subjects)) {
          subjects = subjects.map(v => {
            let sub = {
              key: v.id,
              obj: v.name,
              status: '1',
              userId: userId,
              metaType: MetaData.TEACH_COURSE
            }
            sMap.set(v.id, v)
            cMap.get(v.id) && (sub.id = cMap.get(v.id).id)
            return sub
          })
        }

        if (Check.isRealArray(this.caches)) {
          this.caches.map(v => {
            if (!sMap.get(parseInt(v.key))) {
              subjects.push({ ...v, status: 'd' })
            }
          })
        }

        Api.modifyGroupUser({
          id: id,
          userId: userId,
          groupId: this.currentGroup.groupId,
          metaDatas: subjects
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
