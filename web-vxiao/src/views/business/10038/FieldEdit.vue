<template>
  <Page :title="title"
        :closePrompt="editAble"
        @submit="handleSubmit"
        :hasSubmit="editAble">
    <template v-if="editAble">
      <item :hasClick="false"
            label="名称">
        <input slot="remark"
               placeholder="必填"
               v-model="form.name" />
      </item>
    </template>
    <template v-else>
      <item :hasClick="false"
            label="名称"
            :remark="form.name">
      </item>
    </template>
    <template v-if="form.id">
      <item label="类型"
            :hasClick="false"
            :remark="typeTxt"></item>
    </template>
    <template v-else>
      <el-dropdown class="block-element"
                   trigger="click"
                   @command="handleType">
        <div class="el-dropdown-link">
          <item label="类型"
                :remark="typeTxt"></item>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(type,i) in types"
                            :key="i"
                            :command="type">{{type.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template v-if="isChoice">
      <template v-for="(op, i) in form.options">
        <item v-if="op.status !=='d'"
              :key="i"
              :hasClick="false"
              class="full-input">
          <template v-if="editAble">
            <input :placeholder="optionTxt(i)"
                   v-model="op.content" />
          </template>
          <template v-else>
            <div slot="main"
                 v-html="op.content"></div>
          </template>
          <i class="ico ico-delete"
             v-if="i>1 && editAble"
             @click="handleOptionRemove(op, i)"></i>
        </item>
      </template>
      <item label="新选项"
            v-if="editAble"
            :hasArrow="false"
            @click="handleOptionAdd">
        <div slot="before"><i class="ico ico-plus"></i></div>
      </item>
    </template>
    <TextInput placeholder="字段说明（200字以内，选填）"
               :max="150"
               v-model="form.remark" />
    <div class="category-title"></div>
    <item label="必填">
      <div slot="after">
        <i-switch :value="isFill"
                  @click="handleFill"></i-switch>
      </div>
    </item>
    <div class="button button-common"
         v-if="form.id && editAble"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import CategoryApi from '@/api/category'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    data() {
      return {
        form: {
          name: '',
          type: null,
          fill: 1,
          options: [{ content: '' }, { content: '' }],
          remark: ''
        },
        types: []
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
        return this.form.id ? (this.editAble ? '编辑字段' : '字段详情') : '新增字段'
      },
      isChoice() {
        let type = this.form.type || {}
        return type.value === '1'
      },
      typeTxt() {
        let type = this.form.type || {}
        return type.name || ''
      },
      isFill() {
        return this.form.fill === 1
      },
      editAble() {
        return this.obj.editAble || false
      }
    },
    methods: {
      ...mapActions(['modifyCreateObjectField']),
      optionTxt(index) {
        return `选项${index + 1}`
      },
      fectchData() {
        let field = this.obj.field
        if (field) {
          this.form = {
            id: field.id || void 0,
            name: field.name,
            type: {
              name: field.typeName,
              value: field.type
            },
            fill: field.isRequired,
            options: field.options || [],
            remark: field.remark
          }
          this.modifyCreateObjectField('field')
        }
        CategoryApi.getCategorys({ type: '232' }).then(res => {
          this.types = res.categorys || []
        })
      },
      handleType(item) {
        this.form.type = item
      },
      handleOptionAdd() {
        this.form.options.push({ content: '' })
      },
      handleOptionRemove(op, index) {
        if (op.id) {
          this.$set(op, 'status', 'd')
        } else {
          this.form.options.splice(index, 1)
        }
      },
      handleFill() {
        let fill = this.form.fill
        this.form.fill = fill === 1 ? 0 : 1
      },
      handleSubmit() {
        let form = this.form
        if (Check.isNullString(form.name)) {
          this.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }
        if (!form.type) {
          this.$message({ message: '请选择类型', type: 'warning' })
          return false
        }

        let ops = []
        if (form.type.value === '1') {
          ops = form.options.filter(v => {
            return !Check.isNullString(v.content) && v.status !== 'd'
          })
          if (!Check.isRealArray(ops)) {
            this.$message({ message: '选项不能为空', type: 'warning' })
            return false
          }
          if (ops.length < 2) {
            this.$message({ message: '至少设置两个选项', type: 'warning' })
            return false
          }
        }

        let column = this.obj.column
        let field = {
          id: form.id || void 0,
          name: form.name,
          type: form.type.value,
          typeName: form.type.name,
          projectId: column.id,
          isRequired: form.fill,
          remark: form.remark
        }
        if (form.type.value === '1') {
          field.options = form.options.filter(v => {
            return !Check.isNullString(v.content)
          })
        }
        Api.modifyField({ item: field }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该字段？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.modifyField({
            item: {
              id: this.form.id,
              status: 'd'
            }
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
