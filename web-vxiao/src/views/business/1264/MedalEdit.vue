<template>
  <Page :title="title"
        @submit="handleSubmit"
        :hasSubmit="hasSubmit">
    <div class="medal-edit">
      <item :hasClick="false">
        <div slot="main">名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="medal.name" />
      </item>
      <item @click="handleSelectLogo"
            :hasClick="hasSubmit">
        <div slot="main">图标</div>
        <div slot="remark">
          <img class="avatar"
               v-lazy="{src:logo}"
               alt='LOGO' />
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">评价分值<span style="color:#9f9f9f; padding-left:5px; font-size:14px;">限-20至+20整数</span></div>
        <input slot="remark"
               class="align-right"
               placeholder="分值"
               v-model="medal.score" />
      </item>
      <item v-if="medal.type && medal.type.value == 2">
        <div slot="main">是否纳入统计</div>
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="handleSwitch"></i-switch>
        </div>
      </item>
      <item v-if="medal.type && medal.type.value == 2"
            @click="handleDimension"
            :hasClick="hasSubmit">
        <div slot="main">维度统计</div>
        <div slot="remark"
             class="ellipsis">{{medal.dimensionTxt}}</div>
      </item>
      <div v-if="medal.type && medal.type.value == 2">
        <div class="category-title text">颁发条件</div>
        <item v-for="(item,i) in medal.conditions"
              :key="i"
              :item="item"
              :hasArrow="false"
              @click="handleConditionSelect(item, i)"
              :hasClick="hasSubmit">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':item.active}" />
          </div>
          <div slot="main">{{item.name}}</div>
          <div slot="remark"
               v-if="item.value">
            得
            <input class="md-score"
                   placeholder="分值"
                   v-model="item.value"
                   @click.stop />分
          </div>
        </item>
      </div>
      <div>
        <TextInput v-if="hasSubmit"
                   placeholder="勋章备注"
                   v-model="medal.description" />
        <div v-else
             class="md-desc"
             v-html="desc"></div>
      </div>
      <div class="md-show"
           v-if="medal">
        <div class="ms-title">勋章效果展示</div>
        <Medal :medal="medal"></Medal>
      </div>
    </div>
  </Page>
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
        medal: {
          name: '',
          score: 1,
          description: '',
          logo: '',
          flag: '0',
          type: null,
          orgRanges: [],
          ranges: [],
          rangeTxt: '',
          conditions: [],
          dimensions: [],
          dimensionTxt: '',
          userId: 0
        },
        types: [
          {
            name: '常规勋章',
            value: 1
          },
          {
            name: '自动勋章',
            value: 2
          }
        ]
      }
    },
    created() {
      this.fetchData()
    },
    components: {
      Medal: resolve => require(['@/views/components/medal/Medal3'], resolve)
    },
    computed: {
      ...mapGetters({
        teacherDate: 'getTeacherDate'
      }),
      hasSubmit() {
        let dim = this.teacherDate.dimension
        if (this.isClass && !this.medal.userId) {
          return false
        }
        return Check.isNullString(dim.description)
      },
      title() {
        return this.medal.id ? '编辑勋章' : '新建勋章'
      },
      isSwitched() {
        return this.medal.flag === '1'
      },
      logo() {
        return this.medal.logo ? this.url(this.medal.logo) : ''
      },
      desc() {
        let desc = this.medal.description
        return Check.isNullString(desc) ? desc : '暂无备注'
      }
    },
    methods: {
      ...mapActions(['setTeacherDate']),
      fetchData() {
        let that = this
        let medalId = this.routeParam('id')

        if (that.teacherDate.medal) {
          that.medal = that.teacherDate.medal
        } else if (medalId) {
          Api.loadMedalData(medalId).then(res => {
            let md = res.category
            md.type = md.msgCount === 2 ? that.types[1] : that.types[0]

            if (Check.isRealArray(res.useRanges)) {
              md.orgRanges = res.useRanges
              md.ranges = res.useRanges.filter(r => {
                return r.isSelect
              })
              md.rangeTxt = md.ranges
                .map(r => {
                  return r.name
                })
                .join('、')
            }

            if (Check.isRealArray(md.childs)) {
              let i = 0
              md.conditions = md.childs.map(c => {
                i++
                if (c.id) {
                  c.active = true
                } else {
                  c.id = i
                  c.active = false
                }
                return c
              })
            }

            if (Check.isRealArray(md.metaDatas)) {
              md.dimensions = md.metaDatas.map(m => {
                return {
                  id: parseInt(m.key),
                  name: m.obj
                }
              })
              md.dimensionTxt = md.dimensions
                .map(m => {
                  return m.name
                })
                .join('、')
            }
            that.medal = md
          })
        } else {
          that.medal.type = that.types[0]
          if (that.isClass) {
            that.medal.userId = that.userId
          }
          Api.loadConditionData().then(res => {
            let i = 0
            that.medal.conditions = res.categorys.map(c => {
              i++
              c.id = i
              c.active = false
              return c
            })
          })
        }
      },
      handleSwitch() {
        this.medal.flag = this.medal.flag === '1' ? '0' : '1'
      },
      handleType(type) {
        this.medal.type = type
      },

      handleDimension() {
        this.setTeacherDate({ medal: this.medal })
        this.routePush({
          name: 'selectDimension1264',
          query: { mId: this.medal.id }
        })
      },
      handleSelectLogo() {
        this.setTeacherDate({ medal: this.medal })
        this.routePush({ name: 'selectLogo1264' })
      },
      handleConditionSelect(item, index) {
        this.medal.conditions = this.medal.conditions.map(c => {
          if (c.id === item.id) {
            c.active = !item.active
          } else {
            c.active = false
          }
          return c
        })
      },
      handleSubmit() {
        let that = this
        let md = this.medal
        let dim = this.teacherDate.dimension

        if (!Check.isString(md.name)) {
          that.$message({ message: '勋章名称不能为空', type: 'warning' })
          return false
        }
        if (!Check.isString(md.logo)) {
          that.$message({ message: '请选择勋章图标', type: 'warning' })
          return false
        }
        if (isNaN(md.score) || md.score > 20 || md.score < -20) {
          that.$message({ message: '请输入正确的分值', type: 'warning' })
          return false
        }

        let postData = null
        let category = {
          name: md.name,
          logo: md.logo,
          groupId: that.currentGroup.groupId,
          extension: dim.extension,
          parentId: dim.id,
          parentName: dim.name,
          value: md.score,
          type: '4',
          description: md.description,
          userId: !that.isSchool ? that.userId : 0
        }
        md.id && (category.id = md.id)

        let ranges = []
        if (md.type.value === 1) {
          let rMap = new Map()
          md.ranges.map(v => {
            rMap.set(v.grade, v)
            ranges.push({ ...v, isSelect: '1' })
          })
          if (Check.isRealArray(md.orgRanges)) {
            md.orgRanges.map(r => {
              if (!rMap.get(r.grade) && r.isSelect === 1) {
                ranges.push({ ...r, status: 'd' })
              }
            })
          }
          postData = {
            category: category,
            useRanges: ranges.map(v => {
              delete v.active
              return v
            })
          }
        } else {
          let conditions = md.conditions.filter(c => {
            return c.active
          })
          if (conditions.length < 1) {
            this.$message({ message: '请选择颁发条件', type: 'warning' })
            return false
          }

          let dimensions = md.dimensions
          if (dimensions.length < 1) {
            this.$message({ message: '请选择维度统计', type: 'warning' })
            return false
          }

          category.msgCount = '2'
          category.childs = conditions
          category.flag = md.flag
          category.metaDatas = dimensions.map(d => {
            return {
              key: d.id,
              obj: d.name
            }
          })
          postData = { category: category }
        }

        Api.commitMedalData(postData).then(res => {
          if (res.code === '1') {
            this.$message({ message: '操作成功', type: 'success' })
            that.routeBack()
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .medal-edit {
    .md-score {
      padding: 0 rem(5);
      width: 50px;
      min-width: 50px;
      text-align: center !important;
    }
    .md-show {
      padding: rem(40) 0;
      .ms-title {
        text-align: center;
        margin-bottom: rem(10);
      }
      .medal-03 {
        float: none;
        margin: 0 auto !important;
      }
    }
    .md-desc {
      padding: rem(10);
    }
  }
</style>
