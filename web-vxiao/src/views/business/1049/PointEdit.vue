<template>
  <page :title="rating.way.name" @submit="handleSubmit" hasSubmit :hasClose="false">
    <item v-for="(item,i) in list" :key="i" :item="item" @click="handleSelect(item)">
      <div slot="before">
        <i class="ico ico-select" :class="{'active':item.active}"></i>
      </div>
      <div slot="main">{{item.name}}</div>
      <div slot="after">
        <input class="align-right" placeholder="分值" v-model="item.score" @click.stop/>
      </div>
    </item>
  </page>
</template>
<script>
import R from '@/views/group/mixin'
import CategoryApi from '@/api/category'
import Api from './api'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [R],
  data() {
    return {
      list: []
    }
  },
  created() {
    this.fectchData()
  },
  computed: {
    ...mapGetters({
      rating: 'getRating'
    })
  },
  methods: {
    ...mapActions(['setRating']),
    fectchData() {
      const that = this
      let way = that.rating.way
      that.metaId = that.routeQuery('mId')

      CategoryApi.getCategorys({ type: '155' }).then(res => {
        if (way.categoryJson) {
          let json = JSON.parse(way.categoryJson)
          that.list = res.categorys.map(c => {
            c.score = (json.basePointType === c.extension ? json.basePoint : '')
            c.active = json.basePointType === c.extension
            return c
          })
        } else {
          that.list = res.categorys.map(c => {
            c.score = ''
            c.active = false
            return c
          })
        }
      })
    },
    handleSelect(item) {
      item.active = !item.active
      this.list = this.list.map(v => {
        if (v.id !== item.id) {
          v.active = false
        }
        return v
      })
    },
    handleSubmit() {
      const that = this
      let way = that.rating.way
      
      let datas = that.list.filter(c => { return c.active })
      if (datas.length < 1) {
        that.$message({ message: '请选择分数类型', type: 'warning' })
        return false
      }
      if (datas[0].score === '') {
        that.$message({ message: '分值不能为空', type: 'warning' })
        return false
      }

      let meta = {
        key: JSON.stringify({
          basePoint: datas[0].score,
          basePointType: datas[0].extension,
          basePointDescription: `${way.name}（${datas[0].name}${datas[0].score}）`
        }),
        userId: that.currentGroup.id,
        metaType: 'm_rating_method',
        obj: way.extension,
        extension: ''
      }

      that.metaId && (meta.id = that.metaId)
      Api.commitRatingWayMeta(meta).then(res => {
        that.$message({ message: '操作成功', type: 'success' })
        that.routeBack()
      })
    }
  }
}

</script>
<style scoped></style>
