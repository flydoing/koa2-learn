<template>
  <Page :title="title"
        closePrompt
        @submit="handleSubmit"
        hasSubmit
        :showTips="fields.length === 0">
    <template v-if="fields.length > 0">
      <div class="category-title text">由最高级管理机构定义</div>
      <item v-for="(item, i) in fields"
            class="field-item"
            :key="i"
            :hasClick="item.type === '1'"
            @click="handleItem(item)">
        <div slot="main">{{item.name}}&nbsp;<i class="ico ico-help text-color"
             v-if="item.remark"
             @click.stop="handleHelp(item)"></i></div>
        <template slot="remark">
          <template v-if="item.type === '1'">
            <div v-html="optionTxt(item)"></div>
          </template>
          <template v-else-if="item.type === '5'">
            <el-date-picker v-model="item.content"
                            prefix-icon="x"
                            :clearable="false"
                            type="date"
                            :placeholder="item.description"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"></el-date-picker>
          </template>
          <template v-else>
            <input :placeholder="item.description"
                   v-model="item.content" />
          </template>
        </template>
      </item>
    </template>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Check from '@/utils/check'
  import Api from './api'

  export default {
    mixins: [R],
    data() {
      return {
        fields: [],
        loading: false
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      optionTxt(item) {
        return item.content || item.description
      },
      fectchData() {
        let columnId = this.routeQuery('columnId')
        if (this.obj.fields) {
          this.fields = JSON.parse(JSON.stringify(this.obj.fields))
          let field = this.obj.field
          if (field) {
            this.fields = this.fields.map(v => {
              if (v.id === field.id) {
                return field
              }
              return v
            })
            this.modifyCreateObjectField('field')
          }
          this.modifyCreateObjectField('fields')
        } else if (columnId) {
          Api.getFieldsByColumnId(columnId, this.routeQuery('schoolId') || this.schoolId).then(res => {
            if (res.items) {
              this.fields = res.items.map(v => {
                if (v.result) {
                  return { ...v, content: v.result.content, optionId: v.result.optionId || void 0 }
                }
                return { ...v, content: '' }
              })
            }
          })
        }
      },
      handleItem(item) {
        this.setCreateObject({ fields: this.fields, field: item })
        this.routePush({
          name: 'selectOption10038',
          query: { title: item.name }
        })
      },
      isInteger(val) {
        return Math.floor(val) === val
      },
      isFloatFixed2(val) {
        if (val.toString().indexOf('.') === -1) {
          return false
        }
        return /^\d+(\.\d{2})?$/.test(val)
      },
      handleHelp(item) {
        this.$alert(item.remark, item.name)
      },
      handleSubmit() {
        let flag = false
        let results = []
        let warning = ''
        this.fields.forEach(v => {
          if (!flag) {
            if (v.isRequired && Check.isNullString(v.content)) {
              warning = '存在必填项未填写'
              flag = true
            } else if (!Check.isNullString(v.content)) {
              if (v.type === '3' && (!Check.isNumber(v.content) || !this.isInteger(parseFloat(v.content)))) {
                warning = `请输入整数值（${v.name}）`
                flag = true
              } else if (v.type === '4' && (!Check.isNumber(v.content) || !this.isFloatFixed2(v.content))) {
                warning = `请输入浮点两位小数值（${v.name}）`
                flag = true
              }
              let rs = v.result || {}
              results.push({
                id: rs.id || void 0,
                schoolId: this.routeQuery('schoolId') || this.schoolId,
                projectId: v.projectId,
                itemId: v.id,
                itemType: v.type,
                optionId: v.optionId || void 0,
                content: v.content
              })
            }
          }
        })
        if (flag) {
          this.$message({ message: warning, type: 'warning' })
          return false
        }
        Api.saveFieldResult({ results: results }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .field-item {
    .ico-help {
      color: nth($font-color, 2);
      font-size: rem(15);
      line-height: rem(15);
    }
  }
</style>
