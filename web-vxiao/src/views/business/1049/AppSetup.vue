<template>
  <Setup>
    <template slot="others">
      <div v-if=" isSchool && (isSuperAdmin || isAdmin || isAppAdmin('1049'))">
        <el-dropdown class="block-element"
                     trigger="click"
                     @command="handleChangeWay">
          <div class="el-dropdown-link">
            <item>
              <div slot="main">评比方式</div>
              <div v-if="way"
                   slot="remark">{{way.showTxt}}</div>
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
        <item @click="ratingHonor">
          <div slot="main">班级荣誉</div>
        </item>
        <item @click="reportSetting">
          <div slot="main">报表设置</div>
        </item>
        <item @click="dutySetting">
          <div slot="main">值日设置</div>
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
    created() {
      const that = this
      Api.loadRatingWays(that.currentGroup.groupId).then(res => {
        that.ways = res.categorys
        that.wayMeta = res.methodMetaData

        that.ways.forEach((w, i) => {
          w.value ? that.wayMap.set(w.extension.concat(w.value), w) : that.wayMap.set(w.extension, w)
        })

        if (that.wayMeta.extension) {
          that.way = that.wayMap.get(`${that.wayMeta.obj}${that.wayMeta.extension}`)
        } else {
          that.way = that.wayMap.get(that.wayMeta.obj)
        }

        if (that.way.extension === 'point') {
          var json = JSON.parse(that.way.categoryJson)
          that.way.showTxt = `${that.way.name}（${json.basePointDescription}${json.basePoint}）`
        } else {
          that.way.showTxt = that.way.name
        }
      })
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      ratingProject() {
        this.setRating({ way: this.way })
        this.routePush({ name: 'projectList1049' })
      },
      ratingHonor() {
        this.routePush({ name: 'honorList1049' })
      },
      reportSetting() {
        this.routePush({ name: 'reportSetting1049' })
      },
      dutySetting() {
        this.routePush({ name: 'dutySetting1049' })
      },
      handleChangeWay(way) {
        const that = this
        if (way.extension === 'point') {
          that.setRating({ way: way })
          let obj = { name: 'pointEdit1049' }
          that.wayMeta && (obj.query = { mId: that.wayMeta.id })
          that.routePush(obj)
        } else {
          let meta = {
            userId: that.currentGroup.id,
            metaType: 'm_rating_method',
            obj: way.extension,
            extension: way.value || ''
          }
          that.wayMeta && (meta.id = that.wayMeta.id)

          Api.commitRatingWayMeta(meta).then(res => {
            that.way = way
            that.way.showTxt = way.name
            that.wayMeta = res.metaDatas[0]
            that.$message({ message: '操作成功', type: 'success' })
          })
        }
      }
    }
  }
</script>
