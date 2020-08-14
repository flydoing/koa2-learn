<template>
  <page title="学科评价详情"
        v-if="appraisal">
    <div class="subject-apsl-detail">
      <item :hasClick="false">
        <div slot="main"
             v-html="appraisal.name"></div>
        <div slot="remark"
             class="ellipsis"
             v-html="appraisal.remark"></div>
      </item>
      <div v-for="(item,i) in appraisal.details"
           :key="i"
           :item="item">
        <div class="category-title text"
             v-html="item.name"></div>
        <item v-for="(child,j) in item.datas"
              :key="j"
              :hasArrow="false"
              :child="child">
          <div slot="before">
            <img class="avatar"
                 v-lazy="{src:toAvatar(child.avatar),error:Image.ICO_USER}"
                 alt='头像' />
          </div>
          <div slot="main"
               v-html="child.name"></div>
          <div slot="remark">
            <div class="star-items"
                 v-if="child.stars">
              <span v-for="(s,k) in child.stars"
                    :key="k"
                    :s="s"
                    class="star"
                    :class="{'active':s.active, 'half-active':s.half}"></span>
            </div>
          </div>
        </item>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'

  export default {
    mixins: [R],
    props: {},
    computed: {
      stars() {
        let s = []
        for (let i = 0; i < 5; i++) {
          s.push({ score: i + 1 })
        }
        return s
      }
    },
    data() {
      return {
        appraisal: null
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        let msgId = that.routeParam('msgId')
        Api.loadSubjectApslDetail(msgId).then(res => {
          let details = []
          res.details.forEach((dt, i) => {
            if (i === 0) {
              dt.datas = dt.datas.map(d => {
                d.stars = that.stars.map(s => {
                  let star = {
                    ...s,
                    active: false,
                    half: false
                  }
                  if (star.score <= parseFloat(d.value)) {
                    star.active = true
                  }
                  if (star.score - 0.5 === parseFloat(d.value)) {
                    star.half = true
                  }
                  return star
                })
                return d
              })
            }
            details.push(dt)
          })
          that.appraisal = {
            name: res.categoryName,
            remark: res.sumDetail,
            details: details
          }
        })
      },
      toAvatar(value) {
        return this.url(value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .subject-apsl-detail {
    padding-bottom: rem(8);
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
        &.half-active {
          background: url(~images/ico/ico_half_star.png) no-repeat center;
          background-size: 100%;
        }
      }
    }
    img {
      margin: rem(5) 0;
    }
  }
</style>
