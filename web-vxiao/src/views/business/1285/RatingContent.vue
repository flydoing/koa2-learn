<template>
  <page :title="title">
    <div class="rating-content">
      <div v-if="projects.length>0"
           class="project-list">
        <div class="total-score">得分 {{totalScore}} 分</div>
        <div v-for="(item,i) in projects"
             :key="i"
             :item="item">
          <div class="category-title text">{{item.name}}</div>
          <div v-for="(child,j) in item.childs"
               :key="j"
               :child="child">
            <RatingItem :item="child"
                        :way="rating.way"
                        :canEdit="canEdit"
                        @click="handleItem"></RatingItem>
          </div>
        </div>
      </div>
      <div v-if="dormitories.length>0"
           class="dormitory-list">
        <div v-for="(item,j) in dormitories"
             :key="j"
             :item="item">
          <RatingItem :item="item"
                      :way="rating.way"
                      :canEdit="canEdit"
                      @click="handleItem"></RatingItem>
        </div>
      </div>
      <template v-if="rating.way.type != 'point' && remarkItems.length>0">
        <div class="category-title text"></div>
        <item @click="handleAddRemark">
          <div slot="main">添加备注</div>
        </item>
      </template>
      <div class="category-title text"></div>
      <item @click="handleRemarkList">
        <div slot="main">查看备注</div>
      </item>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    components: {
      RatingItem: resolve => require(['@/views/business/1049/RatingItem'], resolve)
    },
    data() {
      return {
        ranks: [
          {
            name: 'excellent',
            score: 4
          },
          {
            name: 'fine',
            score: 3
          },
          {
            name: 'medium',
            score: 2
          },
          {
            name: 'bad',
            score: 1
          }
        ],
        projects: [],
        dormitories: [],
        totalScore: 0
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      }),
      canEdit() {
        let isExpire = this.rating.isExpire
        return !isExpire
      },
      title() {
        let txt = this.sDate ? '评比详情' : '新建评比'
        let title = this.routeQuery('title')
        return title ? `${txt} - ${title}` : txt
      },
      stars() {
        let s = []
        if (this.rating.way) {
          for (let i = 0; i < this.rating.way.extension; i++) {
            s.push({ score: i + 1 })
          }
        }
        return s
      },
      remarkItems() {
        const that = this
        let list = []
        if (Check.isRealArray(that.dormitories)) {
          list = this.dormitories.filter(v => {
            return !Check.isNullObject(v.rating)
          })
        } else if (Check.isRealArray(that.projects)) {
          that.projects.map(v => {
            let cs = v.childs.filter(c => {
              return !Check.isNullObject(c.rating)
            })
            list.push(...cs)
          })
        }
        return list
      }
    },
    methods: {
      ...mapActions(['setRating']),
      // 初始化数据显示
      initData(item, project) {
        const that = this

        item.rating = item.dormitoryRating || {}
        item.score = item.rating.score || ''

        let rJson = item.rating.ratingJson
        if (project) {
          if (project.childs) {
            let childs = JSON.parse(JSON.stringify(project.childs))
            item.childs = childs.map(c => {
              if (rJson && rJson.indexOf(c.id) > -1) {
                c.active = true
                childs.push(c)
              } else {
                c.active = false
              }
              return c
            })
          }
        } else {
          if (item.childs) {
            item.childs = item.childs.map(c => {
              if (rJson && rJson.indexOf(c.id) > -1) {
                c.active = true
              } else {
                c.active = false
              }
              return c
            })
          }
        }

        item.ranks = that.ranks.map(r => {
          let rank = {
            ...r,
            active: false
          }
          if (rank.score === item.score) {
            rank.active = true
          }
          return rank
        })

        item.stars = that.stars.map(s => {
          let star = {
            ...s,
            active: false,
            half: false
          }
          if (star.score <= item.score) {
            star.active = true
          }
          if (star.score - 0.5 === item.score) {
            star.half = true
          }
          return star
        })
        return item
      },
      // 拉取数据
      fetchData() {
        const that = this
        that.sDate = that.routeQuery('sDate')
        if (that.rating.project) {
          let project = that.rating.project
          Api.loadRatingDormitoriesForProject(that.groupId, project.id, that.sDate).then(res => {
            if (res.dormitoryRatingStatistics) {
              that.dormitories = res.dormitoryRatingStatistics.map(c => {
                c = that.initData(c, project)
                c.rule = project.rule
                return c
              })
            }
          })
        } else {
          let dormitory = this.rating.dormitory
          Api.loadRatingProjectsForDormitory(dormitory.id, that.sDate).then(res => {
            if (res.ratingRecord) {
              let pMap = new Map()
              res.ratingRecord.ratingItems.map(v => {
                v = that.initData(v)
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
              that.totalScore = parseFloat(res.ratingRecord.totalScore || 0).toFixed(1)
            }
          })
        }
      },
      commitData(params, item, callback, data) {
        const that = this
        let project = that.rating.project
        let dormitory = that.rating.dormitory
        let postData = {
          ...params,
          userId: that.userId,
          method: that.rating.way.type
        }
        if (project) {
          postData = {
            ...postData,
            groupId: that.groupId,
            typeId: project.id,
            type: project.name,
            parentId: project.parentId,
            placeId: item.placeId
          }
        } else {
          postData = {
            ...postData,
            groupId: that.groupId,
            typeId: item.id,
            type: item.name,
            parentId: item.parentId,
            placeId: dormitory.id
          }
        }
        Api.commitRatingData(postData).then(res => {
          let total = parseFloat(that.totalScore)
          if (item.score !== '') {
            that.totalScore = (total + params.score - item.score).toFixed(1)
          } else {
            that.totalScore = (total + params.score).toFixed(1)
          }

          item.score = params.score
          item.rating = res.dormitoryRating
          if (!params.isDelete) {
            item.rating.name = that.userInfo.name
          }

          callback && callback(item)
          that.$message({ message: '操作成功', type: 'success' })
        })
      },
      handleItem($event, item, data, index) {
        switch (this.rating.way.type) {
          case 'point':
            this.handlePoint(item)
            break
          case 'score':
            this.handleScore(item, data)
            break
          case 'rank':
            this.handleRank(item, data, index)
            break
          case 'star':
            this.handleStar($event, item, data, index)
            break
          case 'self':
            this.handleCustom(item, data, index)
            break
        }
      },
      handleScore(item, data) {
        this.commitData({ score: data.value }, item)
      },
      handlePoint(item) {
        this.setRating({ curItem: item, isRemark: false })
        this.routePush({ name: 'addRating1285' })
      },
      handleRank(item, data, index) {
        let params = { score: data.score }
        if (data.active) {
          params.isDelete = '1'
        }

        this.commitData(params, item, it => {
          let ranks = []
          it.ranks.forEach((r, i) => {
            if (i === index) {
              r.active = !data.active
            } else {
              r.active = false
            }
            ranks.push(r)
          })
          it.ranks = ranks
        })
      },
      handleStar(e, item, data, index) {
        if (index === 0 && e.offsetX < 3) {
          let stars = item.stars.map(s => {
            s.active = false
            s.half = false
            return s
          })
          this.commitData({ score: 0, isDelete: '1' }, item, it => {
            it.stars = stars
          })
        } else {
          let score = 0
          let stars = []
          item.stars.forEach((s, i) => {
            if (i < index) {
              s.active = true
              s.half = false
              score++
            } else if (i > index) {
              s.active = false
              s.half = false
            }
            stars.push(s)
          })
          if (e.offsetX > 8) {
            data.active = true
            data.half = false
            score++
          } else {
            data.half = true
            data.active = false
            score += 0.5
          }
          stars[index] = data
          this.commitData({ score: score }, item, it => {
            it.stars = stars
          })
        }
      },
      handleCustom(item, data, index) {
        let childs = []
        if (this.rating.way.extension === '1') {
          let score = 0
          item.childs.forEach((c, i) => {
            if (i === index) {
              c.active = !data.active
            } else {
              c.active = false
            }
            childs.push(c)
          })
          data.active && (score = parseFloat(data.extension))

          let params = null
          if (!data.active) {
            params = { isDelete: '1' }
          } else {
            params = { ratingJson: data.id }
          }
          this.commitData(
            { score: score, ...params },
            item,
            it => {
              it.childs = childs
            },
            data
          )
        } else {
          let score = 0
          let actives = []
          item.childs.forEach((c, i) => {
            if (i === index) {
              c.active = !data.active
            }
            if (c.active) {
              score += parseFloat(c.extension)
              actives.push(c)
            }
            childs.push(c)
          })

          let params = {
            score: score,
            ratingJson: actives
              .map(c => {
                return c.id
              })
              .join(',')
          }
          if (!data.active && actives.length < 1) {
            params.isDelete = '1'
          }
          this.commitData(
            params,
            item,
            it => {
              it.childs = childs
            },
            data
          )
        }
      },
      handleRemarkList() {
        this.routePush({
          name: `remarkCardList1285`,
          query: {
            sDate: this.sDate
          }
        })
      },
      handleAddRemark() {
        this.setRating({ items: this.remarkItems, curItem: null, isRemark: true })
        this.routePush({ name: 'addRating1285' })
      }
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .rating-content {
    .total-score {
      text-align: center;
      padding: rem(10) 0;
    }
    .rank-items {
      padding: rem(5) 0;
      span {
        width: rem(40);
        height: rem(40);
        display: inline-block !important;
        vertical-align: middle;
        margin-left: rem(10);
        cursor: pointer;
        overflow: hidden;
        &.excellent {
          background: url(~images/ico/ico_excellent_normal.png) no-repeat;
          background-size: 100%;
          &:hover,
          &.active {
            background: url(~images/ico/ico_excellent_press.png) no-repeat;
            background-size: 100%;
          }
        }
        &.fine {
          background: url(~images/ico/ico_fine_normal.png) no-repeat;
          background-size: 100%;
          &:hover,
          &.active {
            background: url(~images/ico/ico_fine_press.png) no-repeat;
            background-size: 100%;
          }
        }
        &.medium {
          background: url(~images/ico/ico_medium_normal.png) no-repeat;
          background-size: 100%;
          &:hover,
          &.active {
            background: url(~images/ico/ico_medium_press.png) no-repeat;
            background-size: 100%;
          }
        }
        &.bad {
          background: url(~images/ico/ico_bad_normal.png) no-repeat;
          background-size: 100%;
          &:hover,
          &.active {
            background: url(~images/ico/ico_bad_press.png) no-repeat;
            background-size: 100%;
          }
        }
      }
    }
    .custom-items {
      padding: rem(5) 0;
      span {
        width: rem(38);
        height: rem(38);
        display: inline-block !important;
        vertical-align: middle;
        margin-left: rem(10);
        overflow: hidden;
        cursor: pointer;
        border-radius: rem(38);
        text-align: center;
        line-height: rem(38);
        color: #909090;
        @include borderColor;
        &:hover,
        &.active {
          @include bc;
          color: nth($font-color, 4);
          @include borderColor;
        }
      }
    }
    .star-items {
      .star {
        display: inline-block;
        width: rem(18);
        height: rem(18);
        margin-left: rem(5);
        vertical-align: middle;
        cursor: pointer;
        background: url(~images/ico/ico_star.png) no-repeat center;
        background-size: 100%;
        &.active {
          background: url(~images/ico/ico_light_star.png) no-repeat center;
          background-size: 100%;
        }
        &.half_active {
          background: url(~images/ico/ico_half_star.png) no-repeat center;
          background-size: 100%;
        }
      }
    }
  }
</style>
