<template>
  <page :title="title"
        hasSubmit
        @submit="handleSubmit">
    <item label="名称"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item label="输入格式"
              :remark="typeTxt">
        </item>
      </div>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item class="menu-item"
                          v-for="(tp,i) in types"
                          :key="i"
                          :command="tp">{{tp.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <template v-if="typeValue === '8'">
      <item label="选择下限"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="form.down" />
      </item>
      <item label="选择上限"
            :hasClick="false">
        <input slot="remark"
               placeholder="必填"
               v-model="form.up" />
      </item>
    </template>
    <template v-if="typeValue === '7' || typeValue === '8'">
      <div class="category-title"></div>
      <div v-for="(op, i) in form.options"
           :key="i">
        <item class="full-input"
              :hasClick="false">
          <input :placeholder="'选项' + (i + 1)"
                 v-model="op.content" />
          <div slot="after"><i class="ico ico-delete"
               @click="handleRemoveOption(i)"></i></div>
        </item>
        <item label="分值"
              :hasClick="false">
          <input slot="remark"
                 placeholder="必填"
                 v-model="op.score" />
        </item>
      </div>
      <item label="新增"
            :hasArrow="false"
            @click="handleAddOption">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </template>
    <div class="button button-common"
         v-if="form.id"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import CategoryApi from '@/api/category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    data() {
      return {
        form: {
          name: '',
          type: null,
          up: 1,
          down: 1,
          options: [
            {
              content: '',
              score: 0
            },
            {
              content: '',
              score: 0
            }
          ]
        },
        types: [],
        cache: null
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.form.id !== undefined ? '编辑' : '新增'
      },
      typeTxt() {
        let tp = this.form.type || {}
        return tp.name || ''
      },
      typeValue() {
        let tp = this.form.type || {}
        return tp.value || ''
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      fetchData() {
        let item = this.obj.signItem
        if (item) {
          this.form = { ...this.form, ...item }
          this.cache = item
        }
        CategoryApi.getCategorysByType('234').then(res => {
          this.types = res.categorys || []
          if (!item) {
            this.form.type = this.types[0]
          }
        })
      },
      handleType(tp) {
        this.form.type = tp
      },
      handleAddOption() {
        this.form.options.push({ content: '', score: 0 })
      },
      handleRemoveOption(i) {
        this.form.options.splice(i, 1)
      },
      handleRemove() {
        this.setCreateObject({ signItem: { ...this.cache, status: 'd' } })
        this.routeBack()
      },
      handleSubmit() {
        let form = this.form
        let tpValue = this.typeValue
        if (Check.isNullString(form.name)) {
          this.$message({ type: 'warning', message: '名称不能为空' })
          return false
        }
        if (tpValue === '8') {
          if (Check.isNullString(form.down)) {
            this.$message({ type: 'warning', message: '选择下限不能为空' })
            return false
          }
          if (Check.isNullString(form.up)) {
            this.$message({ type: 'warning', message: '选择上限不能为空' })
            return false
          }
        }

        let flag = false
        let ops = form.options.filter(v => {
          if (!Check.isNullString(v.content) && Check.isNullString(v.score)) {
            flag = true
          }
          return !Check.isNullString(v.content) && !Check.isNullString(v.score)
        })

        if (tpValue === '7' || tpValue === '8') {
          if (flag) {
            this.$message({ type: 'warning', message: '选项分值不能为空' })
            return false
          }
          if (ops.length < 2) {
            this.$message({ type: 'warning', message: '至少设置两个选项' })
            return false
          }
        }

        let item = {
          id: form.id || void 0,
          type: form.type,
          name: form.name
        }
        if (tpValue === '7') {
          item.options = ops
        } else if (tpValue === '8') {
          item = { ...form, options: ops }
        }
        this.setCreateObject({ signItem: item })
        this.routeBack()
      }
    }
  }
</script>
