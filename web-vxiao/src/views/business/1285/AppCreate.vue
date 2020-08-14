<template>
  <page :title="title"
        closePrompt>
    <div slot="btn">
      <label v-if="type"
             @click="handleChangeType">{{type.name}}</label>
    </div>
    <div class="rating-create">
      <div v-if="projects.length>0"
           class="project-list">
        <div v-for="(item,i) in projects"
             :key="i"
             :item="item">
          <div class="category-title text"
               v-if="item.name">{{item.name}}</div>
          <div v-for="(child,j) in item.childs"
               :key="j"
               :child="child">
            <item @click="handleProject(child, j)">
              <div slot="main"
                   v-html="child.name"></div>
              <div slot="remark"
                   class="ellipsis">{{child.description}}</div>
            </item>
          </div>
        </div>
      </div>
      <div v-else-if="dormitories.length>0"
           class="class-list">
        <div v-for="(item,i) in dormitories"
             :key="i"
             :item="item">
          <item @click="handleDormitory(item, i)">
            <div slot="main"
                 v-html="item.name"></div>
            <div slot="remark"
                 class="ellipsis">{{item.description}}</div>
          </item>
        </div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        types: [
          {
            name: '按项目',
            value: '1'
          },
          {
            name: '按宿舍',
            value: '2'
          }
        ],
        dormitories: [],
        projects: [],
        type: null
      }
    },
    activated() {
      let tp = this.types[1]
      if (this.rating.type) {
        tp = this.rating.type
        this.deleteRatingProp('type')
      }
      if (this.rating.project) {
        this.deleteRatingProp('project')
      }
      if (this.rating.dormitory) {
        this.deleteRatingProp('dormitory')
      }
      this.fetchData(tp)
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      title() {
        return this.routeQuery('title') || '新建宿舍评比'
      }
    },
    methods: {
      ...mapActions(['setRating', 'deleteRatingProp']),
      fetchData(tp) {
        const that = this
        that.sDate = that.routeQuery('sDate')
        if (!that.sDate) {
          this.setRating({ isExpire: false })
        }
        if (tp.value === '1') {
          Api.loadRatingProjects(that.groupId, that.sDate).then(res => {
            let sets = res.sets
            if (sets) {
              let pMap = new Map()
              sets.ratingItems.map(v => {
                if (v.childs) {
                  v.childs = v.childs.map(c => {
                    c.active = false
                    return c
                  })
                }

                let p = pMap.get(v.parentId)
                if (p) {
                  p.childs.push(v)
                  pMap.set(v.parentId, p)
                } else {
                  pMap.set(v.parentId, {
                    id: v.parentId,
                    name: v.parentName,
                    childs: [v]
                  })
                }
              })

              let projects = []
              pMap.forEach((p, i) => {
                projects.push(p)
              })

              that.projects = projects
              that.dormitories = []
              that.type = that.types[1]
              that.setRating({
                way: {
                  type: sets.methodMeta.obj,
                  extension: sets.methodMeta.extension
                }
              })
            }
          })
        } else {
          Api.loadRatingDormitories(that.groupId, that.sDate).then(res => {
            that.projects = []
            that.dormitories = res.places
            that.type = that.types[0]
            that.setRating({
              way: {
                type: res.methodMetaData.obj,
                extension: res.methodMetaData.extension
              }
            })
          })
        }
      },
      handleChangeType() {
        this.fetchData(this.type)
      },
      handleDormitory(item, i) {
        this.setRating({
          type: this.type.value === '1' ? this.types[1] : this.types[0],
          dormitory: item
        })
        this.routePush({
          name: 'ratingContent1285',
          query: {
            sDate: this.sDate,
            title: item.name
          }
        })
      },
      handleProject(item, i) {
        this.setRating({
          type: this.type.value === '1' ? this.types[1] : this.types[0],
          project: item
        })
        this.routePush({
          name: 'ratingContent1285',
          query: {
            sDate: this.sDate,
            title: item.name
          }
        })
      }
    },
    watch: {}
  }
</script>
