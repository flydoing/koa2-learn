<template>
  <Page :title="title"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <item :hasClick="false"
          label="名称">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
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
    <item label="必填">
      <div slot="after">
        <i-switch :value="isFill"
                  @click="handleFill"></i-switch>
      </div>
    </item>
    <template v-if="isChoice">
      <div class="category-title"></div>
      <template v-for="(op, i) in form.options">
        <item v-if="op.status !=='d'"
              :key="i"
              :hasClick="false"
              class="full-input">
          <input :placeholder="optionTxt(i)"
                 v-model="op.content" />
          <i class="ico ico-delete"
             v-if="i>1"
             @click="handleOptionRemove(op, i)"></i>
        </item>
      </template>
      <item label="新选项"
            :hasArrow="false"
            @click="handleOptionAdd">
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
  import { mapGetters, mapActions } from 'vuex'
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
          options: [{ content: '' }, { content: '' }]
        },
        types: []
      }
    },
    created() {
      this.fectchData()
    },
    computed: {
      ...mapGetters({
        meeting: 'getMeeting'
      }),
      title() {
        return this.form.id ? '编辑签到项目' : '新增签到项目'
      },
      isChoice() {
        let type = this.form.type || {}
        return type.value === '2' || type.value === '3'
      },
      typeTxt() {
        let type = this.form.type || {}
        return type.name || ''
      },
      isFill() {
        return this.form.fill === 1
      }
    },
    methods: {
      ...mapActions(['setMeeting', 'deleteMeetingProp']),
      optionTxt(index) {
        return `选项${index + 1}`
      },
      fectchData() {
        if (this.meeting.item) {
          this.form = {
            ...this.form,
            ...this.meeting.item
          }
        }
        CategoryApi.getCategorys({ type: '233' }).then(res => {
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
        this.form.options.splice(index, 1)
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
        if (form.type.value !== '1') {
          ops = form.options.filter(v => {
            return !Check.isNullString(v.content)
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

        this.setMeeting({
          item: {
            ...form,
            options: ops
          }
        })
        this.routeBack()
      },
      handleRemove() {
        this.$confirm('确认删除该项目？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setMeeting({ item: { ...this.form, status: 'd' } })
          this.routeBack()
        })
      }
    }
  }
</script>
