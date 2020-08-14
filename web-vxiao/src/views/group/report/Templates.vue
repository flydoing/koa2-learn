<template>
  <Page class="tmp"
        closePrompt
        title="新建模板">
    <div slot="top"
         class="step">
      <el-steps :active="active"
                finish-status="success"
                simple>
        <el-step title="模板"></el-step>
        <el-step title="数据"></el-step>
        <el-step title="预览"></el-step>
        <el-step title="推送"></el-step>
      </el-steps>
    </div>
    <template>
      <template v-if="active===0">
        <div class="box-card"
             v-for="(type,i) in reportTypes"
             :key="i">
          <el-card :body-style="bodyStyle"
                   v-if="type==='1'">
            <div slot="header"
                 class="clearfix">
              <span>榜单</span>
              <i-switch :value.sync="t.reportType"
                        trueValue="1"
                        falseValue="2"
                        style="float: right;" />
            </div>
            <img v-lazy="{src:rankImg}"
                 class="image" />
          </el-card>
          <el-card :body-style="bodyStyle"
                   v-else-if="type==='2'">
            <div slot="header"
                 class="clearfix">
              <span>报表</span>
              <i-switch :value.sync="t.reportType"
                        trueValue="2"
                        falseValue="1"
                        style="float: right;" />
            </div>
            <img v-lazy="{src:reportImg}"
                 class="image" />
          </el-card>
        </div>
      </template>
      <template v-else-if="active===1">
        <item class="full-input"
              :hasClick="false">
          <input slot="main"
                 placeholder="输入模板名称"
                 v-model="t.name" />
        </item>
        <div class="category-title text">字段</div>
        <draggable v-model="fields">
          <item class="it"
                v-for="(field,i) in fields"
                :key="i"
                @click="handleField(field)">
            <div slot="before"><i class="ico ico-vs-sort"></i></div>
            <div slot="main">{{field.name}}</div>
            <div slot="after">
              <i class="ico ico-select"
                 :class="{'active':field.select}"></i>
            </div>
          </item>
        </draggable>
      </template>
      <template v-else-if="active===2">
        <template v-if="t.reportType==='1'">
          <i-show :item="itemRule(item,i)"
                  v-for="(item,i) in preViews.datas"
                  :key="i" />
        </template>
        <template v-else>
          <vx-table :data="preViews.datas"
                    :height="maxHeight"
                    stripe>
            <vx-table-column width="120"
                             v-for="(item,i) in preViews.columns"
                             :label="item"
                             :key="i"
                             :fixed="i===0 && preViews.columns.length > 4">
              <template slot-scope="scope">
                <span v-html="scope.row.columns[i]"></span>
              </template>
            </vx-table-column>
          </vx-table>
        </template>
      </template>
      <template v-else-if="active===3">
        <div v-for="(rule,i) in templateRules"
             :key="i"
             id="r.id">
          <div class="category-title text">{{rule.title}}</div>
          <item class="it"
                v-for="(item,j) in rule.r"
                :key="j"
                :hasArrow="false"
                @click="handleRule(item)">
            <div slot="before">
              <i class="ico ico-select"
                 :class="{'active':item.select}" />
            </div>
            <div slot="main">{{item.name}}</div>
            <div slot="remark"
                 class="ellipsis">{{item.extension}}</div>
          </item>
        </div>
      </template>
    </template>
    <div class="list-button"
         slot="bottom">
      <div class="button"
           @click="active--"
           v-if="active>0">上一步</div>
      <div class="button"
           @click="next">{{active===3?'提交':'下一步'}}</div>
    </div>
  </Page>
</template>
<script>
  import Api from './api'
  import Draggable from 'vuedraggable'
  import Tables from '@/components/table/Table'
  import ReportImg from 'images/template/report.png'
  import RankImg from 'images/template/rank.png'
  import Check from '@/utils/check'
  export default {
    components: {
      Tables,
      Draggable
    },
    data() {
      return {
        reportTypes: [],
        active: this.routeQuery('active') || 0,
        reportImg: ReportImg,
        rankImg: RankImg,
        fields: [],
        rules: [],
        preViews: {},
        ranks: [],
        t: {
          groupId: this.routeQuery('groupId'),
          appType: this.routeQuery('appType'),
          reportType: '1',
          name: '',
          fields: [],
          allocation: { pushSpaces: '', pushPeriods: '', pushRoles: '' }
        }
      }
    },
    computed: {
      bodyStyle() {
        return {
          padding: '0px'
        }
      },
      sh() {
        let h = this.innerHeight - 46
        return `${h}px`
      },
      codes() {
        let codes = []
        this.fields.some(field => {
          if (field.select) {
            codes.push(field.code)
          }
        })
        return codes.join(',')
      },
      templateRules() {
        const that = this
        let obj = [{ id: '179', title: '推送周期', r: [] }, { id: '180', title: '推送范围', r: [] }, { id: '181', title: '身份可见', r: [] }]
        if (that.rules.length > 0) {
          that.rules.forEach(r => {
            obj[r.type === '179' ? 0 : r.type === '180' ? 1 : 2]['r'].push(r)
          })
        }
        return obj
      }
    },
    created() {},
    methods: {
      next() {
        const that = this
        let appType = that.routeQuery('appType')
        let groupId = that.routeQuery('groupId')
        if (that.active === 1) {
          if (that.t.name === '') {
            this.$message({ type: 'warning', message: '模板名称不能为空' })
            return
          }
          that.t.fields = (fields => {
            let fs = []
            fields.forEach((f, i) => {
              if (f.select) {
                fs.push({ fieldId: f.id, name: f.name, sort: i + 1 })
              }
            })
            return fs
          })(that.fields)
          if (!Check.isRealArray(that.t.fields)) {
            this.$message({ type: 'warning', message: '字段不能为空' })
            return
          }
        }
        if (that.active++ > 2) {
          that.active = 3
          that.saveTemplate()
          return
        }
        if (that.active === 1) {
          Api.loadTemplateField(appType, that.t.reportType).then(res => {
            that.fields = res.reportFields
          })
        } else if (that.active === 2) {
          const loading = that.$loading({ target: '.tmp' })
          Api.loadTemplatePreview(appType, groupId, that.codes, that.t.reportType).then(res => {
            that.preViews = res.table || {}
            loading.close()
          })
        } else if (that.active === 3) {
          Api.loadTemplateRule().then(res => {
            that.rules = res.categorys
          })
        }
      },
      handleField(field) {
        this.$set(field, 'select', !field.select)
      },
      handleRule(rule) {
        this.$set(rule, 'select', !rule.select)
      },
      itemRule(item, i) {
        const columns = item.columns
        return {
          type: 'avatar',
          i: columns[0],
          number: columns[0],
          avatar: `${this.$store.state.FILE_URL}/${columns[1]}?thumb`,
          text: columns[2],
          placeholder: columns[4] ? `<span class='href-text'>${columns[3]} ${columns[4]}</span>` : `<span class='href-text'>${columns[3]}</span>`
        }
      },
      saveTemplate() {
        const that = this
        that.t.fields = (fields => {
          let fs = []
          fields.forEach((f, i) => {
            if (f.select) {
              fs.push({ fieldId: f.id, name: f.name, sort: i + 1 })
            }
          })
          return fs
        })(that.fields)
        // that.t.allocation = that.t.allocation = {
        //   categorys: that.rules.filter(c => {
        //     return !!c.select
        //   })
        // }
        Api.addTemplate({ templet: that.t }).then(res => {
          that.routeBack()
        })
        // that.$confirm('是否保存？', '提示', {
        //   type: 'warning',
        //   beforeClose: (action, instance, done) => {
        //     instance.confirmButtonLoading = true
        //     if (action === 'confirm') {
        //       instance.confirmButtonText = '执行中...'
        //       Api.addTemplate({ templet: that.t }).then(res => {
        //         done()
        //         instance.confirmButtonLoading = false
        //         that.routeBack()
        //       }).then(() => done())
        //     } else {
        //       instance.confirmButtonLoading = false
        //       done()
        //     }
        //   }
        // }).catch(() => {})
      }
    },
    mounted() {
      const that = this
      Api.loadTemplateList(this.routeQuery('groupId'), this.routeQuery('appType')).then(res => {
        that.reportTypes = res.reportTypes
      })
    }
  }
</script>
<style lang="scss">
  .tmp {
    .step {
      border-bottom: $border;
    }
    .box-card {
      margin-top: rem(-1);
      padding-bottom: rem(20);
    }

    .image {
      max-width: rem(668);
    }
    .button {
      min-width: rem(120);
    }
  }
</style>
