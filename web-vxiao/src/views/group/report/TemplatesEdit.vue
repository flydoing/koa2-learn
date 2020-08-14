<template>
  <Page class="tmp"
        :title="t.name">
    <div slot="top"
         class="step">
      <el-steps :active="active"
                finish-status="success"
                simple>
        <el-step title="数据"></el-step>
        <el-step title="预览"></el-step>
        <el-step title="推送"></el-step>
      </el-steps>
    </div>
    <div>
      <template v-if="active===0">
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
      <template v-else-if="active===1">
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
      <template v-else-if="active===2">
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
    </div>
    <div class="list-button"
         slot="bottom">
      <div class="button"
           @click="active--"
           v-if="active>0">上一步</div>
      <div class="button"
           @click="next">{{active===2?'提交':'下一步'}}</div>
    </div>
  </Page>
</template>
<script>
  import Api from './api'
  import Draggable from 'vuedraggable'
  import Tables from '@/components/table/Table'
  import Check from '@/utils/check'
  export default {
    components: {
      Tables,
      Draggable
    },
    data() {
      return {
        active: this.routeQuery('active') || 0,
        fields: [],
        rules: [],
        preViews: {},
        ranks: [],
        t: {}
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
    created() {
      const that = this
      let _t = this.getStorage('_templet')
      if (Check.isNullObject(_t)) {
        that.routeBack()
      }
      that.t = _t
      that.t.groupId = that.routeQuery('groupId')
      Api.loadTemplateField(that.routeQuery('appType'), that.t.reportType).then(res => {
        if (Check.isRealArray(that.t.fields)) {
          res.reportFields.forEach(r => {
            Check.isRealArray(
              that.t.fields.filter(_r => {
                return _r.id === r.id
              })
            ) && (r.select = true)
          })
        }
        that.fields = res.reportFields
      })
    },
    methods: {
      next() {
        const that = this
        let appType = that.routeQuery('appType')
        let groupId = that.routeQuery('groupId')

        if (that.active === 0) {
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
          this.preViews = {}
        }
        if (that.active++ > 1) {
          that.active = 2
          that.saveTemplate()
          return
        }
        if (that.active === 1) {
          const loading = that.$loading({ target: '.tmp' })
          Api.loadTemplatePreview(appType, groupId, that.codes, that.t.reportType).then(res => {
            that.preViews = res.table || {}
            loading.close()
          })
        } else if (that.active === 2) {
          Api.loadTemplateRule().then(res => {
            if (that.t.allocation) {
              res.categorys.forEach(r => {
                Check.isRealArray(
                  that.t.allocation.categorys.filter(_c => {
                    return _c.id === r.id
                  })
                ) && (r.select = true)
              })
            }
            that.rules = res.categorys
          })
          this.preViews = {}
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
        that.t.allocation = {
          categorys: that.rules.filter(c => {
            return !!c.select
          })
        }
        Api.addTemplate({ templet: that.t }).then(res => {
          that.routeBack()
        })
        // that.$confirm('是否保存修改？', '提示', {
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
    mounted() {}
  }
</script>
