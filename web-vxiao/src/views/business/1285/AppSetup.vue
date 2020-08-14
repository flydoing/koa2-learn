<template>
  <Setup>
    <template slot="others">
      <div v-if=" isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1285'))">
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleChangeWay">
          <div class="el-dropdown-link">
            <item>
              <div slot="main">评比方式</div>
              <div v-if="way"
                   slot="remark">{{wayTxt}}</div>
            </item>
          </div>
          <el-dropdown-menu class="drop-menu"
                            slot="dropdown">
            <el-dropdown-item class="menu-item"
                              v-for="(way,i) in ways"
                              :key="i"
                              :way="way"
                              :command="way">{{way.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <item @click="ratingProject">
          <div slot="main">评比项目</div>
        </item>
      </div>
    </template>
  </Setup>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {
      Setup: resolve => require(['@/views/group/app/Default'], resolve)
    },
    data() {
      return {
        ways: [],
        wayMeta: null,
        wayMap: new Map(),
        way: null
      }
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      wayTxt() {
        let way = this.way || {}
        if (way.extension === 'point') {
          let json = JSON.parse(way.categoryJson)
          return `${way.name}（${json.basePointDescription}${json.basePoint}）`
        }
        return way.name
      }
    },
    created() {
      const that = this
      if (this.rating.way) {
        this.deleteRatingProp('way')
      }
      Api.loadRatingWays(that.groupId).then(res => {
        that.ways = res.categorys
        that.wayMeta = res.methodMetaData

        that.ways.forEach((w, i) => {
          w.value ? that.wayMap.set(`${w.extension}${w.value}`, w) : that.wayMap.set(w.extension, w)
        })

        if (that.wayMeta.extension) {
          that.way = that.wayMap.get(`${that.wayMeta.obj}${that.wayMeta.extension}`)
        } else {
          that.way = that.wayMap.get(that.wayMeta.obj)
        }
      })
    },
    methods: {
      ...mapActions(['setRating', 'deleteRatingProp', 'modifyMetaData']),
      ratingProject() {
        this.setRating({ way: this.way })
        this.routePush({ name: 'projectList1285' })
      },
      handleChangeWay(way) {
        const that = this
        if (way.extension === 'point') {
          that.setRating({ way: way })
          let obj = { name: 'pointEdit1285' }
          that.wayMeta && (obj.query = { mId: that.wayMeta.id })
          that.routePush(obj)
        } else {
          let meta = {
            userId: that.currentGroup.id,
            metaType: 'm_dormitory_rating_method',
            obj: way.extension,
            extension: way.value || ''
          }
          that.wayMeta && (meta.id = that.wayMeta.id)

          that.modifyMetaData(meta).then(res => {
            that.way = way
            that.wayMeta = res.metaDatas[0]
            that.$message({ message: '操作成功', type: 'success' })
          })
        }
      }
    }
  }
</script>
