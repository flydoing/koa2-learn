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
          <div class="category-title text">{{item.name}}</div>
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
      <div v-else-if="classes.length>0"
           class="class-list">
        <div v-for="(item,i) in classes"
             :key="i"
             :item="item">
          <item @click="handleClass(item, i)">
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
            name: '按班级',
            value: '2'
          }
        ],
        classes: [],
        projects: [],
        type: null
      }
    },
    activated() {
      this.fetchData(this.rating.type ? this.rating.type : this.types[1])
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      title() {
        return this.routeQuery('title') || '新建评比'
      }
    },
    methods: {
      ...mapActions(['setRating']),
      fetchData(tp) {
        const that = this
        that.sDate = that.routeQuery('sDate')
        if (!that.sDate) {
          this.setRating({ isExpire: false })
        }
        if (tp.value === '1') {
          Api.loadRatingProjects(that.currentGroup.groupId, that.sDate).then((res) => {
            let sets = res.sets
            if (sets) {
              let pMap = new Map()
              sets.ratingItems.map((v) => {
                if (v.childs) {
                  v.childs = v.childs.map((c) => {
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
              that.classes = []
              that.type = that.types[1]
              that.setRating({
                way: {
                  type: sets.methodMeta.obj,
                  extension: sets.methodMeta.extension
                },
                hasAuth: res.hasAuth
              })
            }
          })
        } else {
          Api.loadRatingClasses(that.currentGroup.groupId, that.sDate).then((res) => {
            that.projects = []
            that.classes = res.groups
            that.type = that.types[0]
            that.setRating({
              way: {
                type: res.methodMetaData.obj,
                extension: res.methodMetaData.extension
              },
              hasAuth: res.hasAuth
            })
          })
        }
      },
      handleChangeType() {
        this.fetchData(this.type)
      },
      handleClass(item, i) {
        this.setRating({
          type: this.type.value === '1' ? this.types[1] : this.types[0],
          cls: item,
          project: null
        })
        this.routePush({
          name: 'ratingContent1049',
          query: {
            sDate: this.sDate
          }
        })
      },
      handleProject(item, i) {
        this.setRating({
          type: this.type.value === '1' ? this.types[1] : this.types[0],
          cls: null,
          project: item
        })
        this.routePush({
          name: 'ratingContent1049',
          query: {
            sDate: this.sDate
          }
        })
      }
    },
    watch: {}
  }
</script>
