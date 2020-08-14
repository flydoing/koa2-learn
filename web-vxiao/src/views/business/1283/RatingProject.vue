<template>
  <page title="评比项目">
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleChangeLevel">
      <div class="el-dropdown-link">
        <item>
          <div slot="main">项目层级</div>
          <div v-if="level"
               slot="remark">{{level.name}}</div>
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(level,i) in levels"
                          :key="i"
                          :level="level"
                          :command="level">{{level.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <item>
      <div slot="main">当日无评分时，默认记为满分</div>
      <div slot="after">
        <i-switch :value="isSwitched"
                  @click="handleSwitch"></i-switch>
      </div>
    </item>
    <div class="category-title text"></div>
    <ProjectList v-if="level"
                 :list="list"
                 :level="level.type"
                 v-on:add="projectAdd"
                 v-on:edit="projectEdit"
                 :remarkHandle="remarkTxt"></ProjectList>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        levels: [
          {
            name: '单级评比',
            type: 1
          },
          {
            name: '二级评比',
            type: 2
          }
        ],
        level: null,
        levelMeta: null,
        sysMeta: null
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      isSwitched() {
        return this.sysMeta ? this.sysMeta.obj === '1' : false
      }
    },
    components: {
      ProjectList: resolve => require(['@/views/components/project/ProjectList'], resolve)
    },
    methods: {
      ...mapActions(['setRating', 'modifyMetaData', 'deleteRatingProp']),
      remarkTxt(project, depth) {
        if (this.level.type === 1 || (this.level.type === 2 && depth === 2)) {
          return project.flag
        }
        return ''
      },
      fetchData(isUpdate) {
        const that = this
        if (this.rating.cache) {
          this.deleteRatingProp('cache')
        }
        if (this.rating.project) {
          this.deleteRatingProp('project')
        }
        Api.loadProjectData(that.groupId, isUpdate).then(res => {
          let sets = res.sets || {}
          that.list = sets.ratingItems || []
          let lm = sets.levelMetaData
          if (lm) {
            that.levelMeta = lm
            that.level = lm.obj === '0' ? that.levels[0] : that.levels[1]
          } else {
            that.level = that.levels[0]
          }
          that.sysMeta = sets.sysRatingMeta
        })
      },
      handleChangeLevel(level) {
        let that = this
        let meta = {
          extension: that.groupId,
          metaType: 'm_school_rating_level',
          obj: level.type === 1 ? '0' : '1'
        }
        that.levelMeta && (meta.id = that.levelMeta.id)

        that.modifyMetaData(meta).then(res => {
          that.level = level
          this.fetchData('1')
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleSwitch() {
        let that = this
        let meta = {
          userId: that.currentGroup.id,
          metaType: 'm_school_rating_by_system_set',
          obj: that.sysMeta ? (that.sysMeta.obj === '1' ? '0' : '1') : '1'
        }

        that.sysMeta && (meta.id = that.sysMeta.id)
        that.modifyMetaData(meta).then(res => {
          that.sysMeta = res.metaDatas[0]
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      projectAdd(parent, list, parentIndex, dp) {
        let index = list ? list.length + 1 : 1
        let title = parentIndex ? `新建${parentIndex}.${index}项目` : `新建${index}项目`
        this.setRating({ parent: parent, title: title, depth: dp, level: this.level })
        this.routePush({ name: 'projectEdit1283' })
      },
      projectEdit(project, parent, index, parentIndex, dp) {
        let title = parentIndex ? `编辑${parentIndex}.${index}项目` : `编辑${index}项目`
        this.setRating({ parent: parent, title: title, depth: dp, cache: project, level: this.level })
        this.routePush({ name: 'projectEdit1283' })
      }
    }
  }
</script>
