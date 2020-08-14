<template>
  <page :title="title"
        @submit="handleSubmit"
        :hasSubmit="joinIn!=1">
    <div class="student-apsl-detail">
      <div v-for="(item,i) in form.list"
           :key="i"
           :item="item">
        <div class="category-title text"
             v-html="item.name"></div>
        <div v-for="(child,j) in item.childs"
             :key="j"
             :child="child">
          <template v-if="child.type == '3'">
            <item>
              <div slot="main"
                   v-html="child.name"></div>
              <div slot="remark">
                <div class="star-items">
                  <span v-for="(s,k) in child.stars"
                        :key="k"
                        :s="s"
                        class="star"
                        :class="{'active':s.active, 'half-active':s.half}"
                        @click="handleStar(child, s, k, $event)"></span>
                </div>
              </div>
              <div slot="after"></div>
            </item>
          </template>
          <template v-else-if="child.type == '6'">
            <item :hasClick="false">
              <div slot="main"
                   v-html="child.name"></div>
              <template v-if="joinIn != 1">
                <input slot="remark"
                       class="align-right"
                       :placeholder="scorePlaceHolder(child)"
                       v-model="child.score" />
              </template>
              <template v-else>
                <div slot="remark"
                     class="ellipsis"
                     v-html="scoreTxt(child)"></div>
              </template>
            </item>
          </template>
          <template v-else-if="child.type == '5'">
            <item @click="handleContent(child)"
                  :hasClick="(child.appraisalComment!=undefined&&child.appraisalComment!='')||joinIn!=1">
              <div slot="main"
                   v-html="child.name"></div>
              <div slot="remark"
                   class="ellipsis"
                   v-html="child.appraisalComment"></div>
            </item>
          </template>
          <template v-else>
            <template v-if="joinIn!=1">
              <el-dropdown class="block-element"
                           trigger="click"
                           @command="handleScore">
                <div class="el-dropdown-link">
                  <item>
                    <div slot="main"
                         v-html="child.name"></div>
                    <div slot="remark"
                         class="ellipsis"
                         v-html="scoreTxt(child)"></div>
                  </item>
                </div>
                <el-dropdown-menu class="drop-menu"
                                  slot="dropdown">
                  <template v-if="child.scores">
                    <el-dropdown-item class="menu-item"
                                      v-for="(s,k) in child.scores"
                                      :key="k"
                                      :s="s"
                                      :command="s">{{s.score}}{{child.unit}}</el-dropdown-item>
                  </template>
                  <template v-else-if="child.unitScore">
                    <el-dropdown-item class="menu-item"
                                      v-for="(s,d,k) in child.unitScore"
                                      :key="k"
                                      :s="s"
                                      :command="s">{{d}}</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template v-else>
              <item :hasClick="false">
                <div slot="main"
                     v-html="child.name"></div>
                <div slot="remark"
                     class="ellipsis"
                     v-html="scoreTxt(child)"></div>
              </item>
            </template>
          </template>
        </div>
      </div>
      <template v-if="joinIn!=1">
        <div>
          <TextInput placeholder="评语内容（限500字）"
                     v-model="form.comment"></TextInput>
        </div>
      </template>
      <template v-else>
        <div class="apsl-content"
             v-html="contentTxt"></div>
      </template>
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
    data() {
      return {
        form: {
          list: [],
          apsl: null,
          comment: ''
        }
      }
    },
    created() {
      this.fetchData()
    },
    components: {},
    computed: {
      ...mapGetters({
        appraisal: 'getStudentAppraisal'
      }),
      stars() {
        let s = []
        for (let i = 0; i < 5; i++) {
          s.push({ score: i + 1 })
        }
        return s
      },
      contentTxt() {
        return this.form.comment || '暂无评语'
      }
    },
    methods: {
      ...mapActions(['setStudentAppraisal']),
      fetchData() {
        const that = this
        that.title = this.routeQuery('title')
        that.msgId = this.routeParam('msgId')
        that.apslUserId = this.routeQuery('auId') || this.userId
        that.joinIn = parseInt(this.routeQuery('joinIn'))

        if (that.appraisal.form) {
          that.form = JSON.parse(JSON.stringify(that.appraisal.form))
          let item = that.appraisal.item
          if (Check.isObject(item)) {
            that.form.list = that.form.list.map(v => {
              v.childs = v.childs.map(c => {
                return c.contentId === item.contentId ? item : c
              })
              return v
            })
          }
        } else {
          let user = that.appraisal.user
          Api.loadStudentApslDetailData(that.msgId, user.userId, that.apslUserId).then(res => {
            if (res.appraisal) {
              that.form.apsl = res.appraisal
              that.form.comment = res.appraisal.appraisalComment
            }

            that.form.list = res.appraisals.map(v => {
              v.childs = v.childs.map(c => {
                if (c.type === '3') {
                  c.stars = that.stars.map(s => {
                    let star = {
                      ...s,
                      active: false,
                      half: false
                    }
                    if (star.score <= c.score) {
                      star.active = true
                    }
                    if (star.score - 0.5 === c.score) {
                      star.half = true
                    }
                    return star
                  })
                }
                if (c.scores) {
                  c.scores = c.scores.map(s => {
                    return { score: s, itemId: c.contentId }
                  })
                }
                if (c.unitScore) {
                  let obj = {}
                  for (let key in c.unitScore) {
                    obj[key] = { score: c.unitScore[key], itemId: c.contentId }
                  }
                  c.unitScore = obj
                }
                c.secondLevelName = v.name
                return c
              })
              return v
            })
          })
        }
      },
      scoreTxt(item) {
        if (item.unitScore) {
          let txt = ''
          for (let key in item.unitScore) {
            if (parseInt(item.unitScore[key].score) === item.score) {
              txt = key
              break
            }
          }
          return txt
        }
        return item.score ? `${item.score}${item.unit}` : ''
      },
      scorePlaceHolder(item) {
        return `0~${item.maxScore}分`
      },
      handleScore(s) {
        if (this.joinIn === 1) {
          return false
        }
        this.form.list = this.form.list.map(v => {
          v.childs = v.childs.map(c => {
            c.contentId === s.itemId && (c.score = parseInt(s.score))
            return c
          })
          return v
        })
      },
      handleStar(item, data, index, e) {
        let stars = []
        let score = 0

        if (this.joinIn === 1) {
          return false
        }

        if (index === 0 && e.offsetX < 3) {
          stars = item.stars.map(s => {
            s.active = false
            s.half = false
            return s
          })
        } else {
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
        }

        item.score = score
        item.stars = stars
      },
      handleContent(item) {
        this.setStudentAppraisal({ form: this.form, item: item })
        this.routePush({ name: 'addContent1196' })
      },
      handleContentConfirm(content) {
        const that = this
        that.list = that.list.map(v => {
          v.childs = v.childs.map(c => {
            c.contentId === that.curItem.contentId && (c.appraisalComment = content)
            return c
          })
          return v
        })
      },
      handleSubmit() {
        const that = this
        let appraisals = []
        let flag = true

        let txt = ''
        let items = []
        that.form.list.map(v => {
          items.push(...v.childs)
        })
        if (Check.isRealArray(items)) {
          items.forEach((v, i) => {
            if (flag) {
              if (v.type === '6' && Check.isNullString(v.score)) {
                txt = v.secondLevelName
                flag = false
              }

              let item = {
                contentId: v.contentId,
                score: v.score,
                secondLevelId: v.secondLevelId,
                firstLevelId: v.firstLevelId
              }
              v.id && (item.id = v.id)
              item.weight = v.weight || 1

              if (v.type === '5' && v.appraisalComment) {
                item.appraisalComment = v.appraisalComment
                appraisals.push(item)
              } else {
                item.score = v.score
                appraisals.push(item)
              }
            }
          })
        }

        if (!flag) {
          that.$message({ message: `存在未评项目（${txt}）`, type: 'warning' })
          return false
        }

        if (that.form.comment.length > 500) {
          that.$message({ message: '评语内容仅限500字', type: 'warning' })
          return false
        }

        let apsl = that.form.apsl || {}
        let postData = {
          appraisals: appraisals,
          appraisal: {
            ...apsl,
            appraisalComment: that.form.comment,
            contentId: 0,
            secondLevelId: 0,
            firstLevelId: 0
          }
        }

        let user = that.appraisal.user
        Api.commitStudentApslResult(that.msgId, user.userId, that.apslUserId, postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .student-apsl-detail {
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
    textarea {
      height: rem(150);
    }
    .apsl-content {
      padding: rem(8) rem(10);
      text-align: justify;
    }
  }
</style>
