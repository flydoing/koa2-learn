<!-- 志愿设置 -->
<template>
  <div class="volunteer-step">
    <item label="标题"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.title" />
    </item>
    <el-dropdown class="block-element"
                 trigger="click"
                 @command="handleType">
      <div class="el-dropdown-link">
        <item label="类型"
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
    <template v-if="typeValue === '1'">
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
    <template v-for="(item, i) in form.items">
      <div v-if="item.status !== 'd'"
           :key="i">
        <div class="category-title text">
          <span v-html="item.name"></span>
          <span class="right"
                @click="handleItem(item)">编辑&#12288;<i class="ico ico-delete"
               @click.stop="handleRemove(item, i)"></i></span>
        </div>
        <template v-for="(qst, j) in filterQuestions(item.questions)">
          <item :key="j"
                @click="handleQst(item, qst)"
                :label="(j + 1) + '、' + qst.title"
                :remark="remarkTxt(qst)">
          </item>
        </template>
        <item label="新增评估题目"
              :hasArrow="false"
              @click="handleAddQst(item)">
          <div slot="before"><i class="ico ico-plus"></i></div>
        </item>
      </div>
    </template>
    <div class="category-title"></div>
    <item label="新增志愿选项"
          :hasArrow="false"
          @click="handleAddItem">
      <div slot="before"><i class="ico ico-plus"></i></div>
    </item>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    props: {
      timeStamp: { type: [String, Number] }
    },
    data() {
      return {
        form: {
          title: '',
          type: null,
          up: 1,
          down: 1,
          items: []
        },
        types: [
          {
            name: '单选',
            value: '0'
          },
          {
            name: '多选',
            value: '1'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      typeTxt() {
        let tp = this.form.type || {}
        return tp.name || ''
      },
      typeValue() {
        let tp = this.form.type || {}
        return tp.value || ''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      remarkTxt(qst) {
        let tp = qst.type || {}
        return tp.name || ''
      },
      filterQuestions(datas) {
        return datas.filter(v => {
          return v.status !== 'd'
        })
      },
      fetchData() {
        let form = this.obj.form || {}
        let vData = form.volunteerData
        if (vData) {
          this.form = JSON.parse(JSON.stringify(vData))
          if (this.obj.vltrItem) {
            let item = JSON.parse(JSON.stringify(this.obj.vltrItem))
            let qst = this.obj.question || {}
            if (qst.status === 'd' && !Check.isNumber(qst.id)) {
              item.questions = item.questions.filter(v => {
                return v.id !== qst.id
              })
            } else if (qst.id) {
              item.questions = item.questions.map(v => {
                if (v.id === qst.id) {
                  return qst
                }
                return v
              })
            } else if (!Check.isNullObject(qst)) {
              item.questions.push({ ...qst, id: `new${Math.random(1, 999)}` })
            }
            this.form.items = this.form.items.map(v => {
              if (v.id === item.id) {
                return item
              }
              return v
            })
            this.saveData()
            this.modifyCreateObjectField('question')
            this.modifyCreateObjectField('vltrItem')
          }
        } else {
          this.form.type = this.types[0]
          this.saveData()
        }
      },
      saveData() {
        let form = this.obj.form || {}
        this.setCreateObject({
          form: {
            ...form,
            volunteerData: this.form
          }
        })
      },
      handleType(tp) {
        this.form.type = tp
      },
      commitItem(item, cback) {
        this.$prompt(' ', item ? '编辑志愿选项' : '新增志愿选项', {
          inputValue: item ? item.name : '',
          inputPlaceholder: '输入内容',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (Check.isNullString(value)) {
            this.$message({ message: '内容不能为空', type: 'warning' })
            return false
          }
          cback && cback(value)
        })
      },
      handleItem(item) {
        this.commitItem(item, value => {
          this.$set(item, 'name', value)
        })
      },
      handleRemove(item, i) {
        this.$confirm('确认删除该志愿选项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (!Check.isNumber(item.id)) {
            this.form.items.splice(i, 1)
          } else {
            this.$set(item, 'status', 'd')
          }
        })
      },
      handleAddItem() {
        this.commitItem(null, value => {
          this.form.items.push({
            id: `new${Math.random(1, 999)}`,
            name: value,
            questions: []
          })
        })
      },
      handleQst(item, qst) {
        this.setCreateObject({ vltrItem: item, question: qst })
        this.routePush({ path: '/vx/group/business/1300/questionEdit' })
      },
      handleAddQst(item) {
        this.setCreateObject({ vltrItem: item })
        this.routePush({ path: '/vx/group/business/1300/questionEdit' })
      }
    },
    watch: {
      'form.title'(val) {
        this.saveData()
      },
      'form.up'(val) {
        this.saveData()
      },
      'form.down'(val) {
        this.saveData()
      },
      timeStamp(val) {
        this.fetchData()
      }
    }
  }
</script>
<style lang="scss">
  .category-title {
    .ico {
      vertical-align: middle;
      display: inline-block;
      margin-top: rem(-1);
    }
  }
</style>
