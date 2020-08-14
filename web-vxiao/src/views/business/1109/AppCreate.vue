<template>
  <page title="新建报销"
        closePrompt
        @back="handleBack"
        listenBack>
    <div slot="btn">
      <el-dropdown trigger="click"
                   @command="handleSubmit">
        <div class="el-dropdown-link">
          <img class="img-submit"
               v-lazy="{src:'/static/ico/ico_submit.png'}"
               alt='Submit' />
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in menus"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="expense-create">
      <item @click="handleType">
        <div slot="main">类型</div>
        <div slot="remark"
             v-html="typeTxt"></div>
      </item>
      <template v-if="form.type && form.type.extension == '1'">
        <item class="es-time"
              :hasClick="false">
          <div slot="main">开始时间</div>
          <div slot="after">
            <el-date-picker v-model="form.startTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            @change="handleStartTime"
                            :clearable="false"></el-date-picker>
          </div>
        </item>
        <item class="es-time"
              :hasClick="false">
          <div slot="main">结束时间</div>
          <div slot="after">
            <el-date-picker v-model="form.endTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            @change="handleEndTime"
                            :clearable="false"></el-date-picker>
          </div>
        </item>
      </template>
      <template v-else-if="form.type">
        <item class="es-time"
              :hasClick="false">
          <div slot="main">时间</div>
          <div slot="after">
            <el-date-picker v-model="form.startTime"
                            prefix-icon="x"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            @change="handleStartTime"
                            :clearable="false"></el-date-picker>
          </div>
        </item>
      </template>
      <item :hasClick="false">
        <div slot="main">所在地</div>
        <div slot="remark">
          <el-cascader class="es-address"
                       :options="form.provinces"
                       v-model="form.selectAreas"
                       @active-item-change="handleAddress"></el-cascader>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">金额</div>
        <input slot="remark"
               placeholder="必填"
               v-model="form.amount" />
      </item>
      <keep-alive>
        <EditorSimple :store.sync="editorMessage"
                      placeholder="说明及发票"
                      :toolbars="['photo','open']" />
      </keep-alive>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import DateUtils from '@/utils/date'
  import GroupApi from '@/api/group'

  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          startTime: null,
          endTime: '',
          address: '',
          amount: '',
          type: null,
          area: {},
          provinces: [],
          selectAreas: []
        },
        menus: [
          {
            name: '提交',
            value: '1'
          },
          {
            name: '继续添加',
            value: '2'
          }
        ]
      }
    },
    activated() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        expense: 'getExpense'
      }),
      typeTxt() {
        return this.form.type ? this.form.type.name : ''
      }
    },
    methods: {
      ...mapActions(['setExpense']),
      fetchData() {
        if (this.expense.form) {
          this.form = JSON.parse(JSON.stringify(this.expense.form))
        } else {
          this.editorMessage.isPrivate = '1'
          GroupApi.getProvinces().then(res => {
            this.form.provinces = res.provinces.map(v => {
              if (v.province.indexOf('市') !== -1) {
                v = { ...v, label: v.province, value: v.provinceId }
                this.form.area[v.provinceId] = v
              } else {
                v = { ...v, label: v.province, value: v.provinceId, children: [] }
                this.form.area[v.provinceId] = v
              }
              return v
            })
          })
        }
      },
      handleType() {
        this.setExpense({ form: this.form })
        this.routePush({ name: 'selectType1109' })
      },
      checkTime(time) {
        if (new Date(time).getTime() > new Date().getTime()) {
          this.$message({ message: '日期不能超过今天', type: 'warning' })
          return false
        }
        return true
      },
      handleStartTime(time) {
        if (!this.checkTime(time)) {
          this.form.startTime = ''
        }
      },
      handleEndTime(time) {
        if (!this.checkTime(time)) {
          this.form.endTime = ''
        }
      },
      handleAddress(ads) {
        const that = this
        let pv = that.form.area[ads[0]]
        if (Check.isRealArray(pv.children)) {
          that.form.provinces = that.form.provinces.map(v => {
            if (v.value === parseInt(ads[0])) {
              v.children = pv.children
            }
            return v
          })
        } else {
          GroupApi.getCities(ads[0]).then(res => {
            that.form.provinces = that.form.provinces.map(v => {
              if (v.value === parseInt(ads[0]) && res.citys) {
                v.children = res.citys.map(c => {
                  c = { ...c, label: c.city, value: c.cityId }
                  that.form.area[c.cityId] = c
                  return c
                })
                pv.children = v.children
              }
              return v
            })
          })
        }
        that.form.selectAreas = ads
      },
      handleSubmit(menu) {
        const that = this

        let form = this.form
        if (!form.type) {
          that.$message({ message: '请选择报销类型', type: 'warning' })
          return false
        }

        if (form.type.extension === '1') {
          if (Check.isNullString(form.startTime)) {
            that.$message({ message: '开始时间不能为空', type: 'warning' })
            return false
          }

          if (Check.isNullString(form.endTime)) {
            that.$message({ message: '结束时间不能为空', type: 'warning' })
            return false
          }

          if (new Date(form.startTime).getTime() > new Date(form.endTime).getTime()) {
            that.$message({ message: '开始时间不能大于结束时间', type: 'warning' })
            return false
          }
        } else {
          if (Check.isNullString(form.startTime)) {
            that.$message({ message: '时间不能为空', type: 'warning' })
            return false
          }
        }

        let address = form.selectAreas
          .map(v => {
            return form.area[v].label
          })
          .join(' ')
        if (Check.isNullString(address)) {
          that.$message({ message: '所在地不能为空', type: 'warning' })
          return false
        }

        if (Check.isNullString(form.amount)) {
          that.$message({ message: '报销金额不能为空', type: 'warning' })
          return false
        }

        let mJson = {
          applyAmount: form.amount,
          wipedStartDate: DateUtils.format_0800(form.startTime),
          address: address
        }
        form.type.extension === '1' && (mJson.wipedEndDate = DateUtils.format_0800(form.endTime))
        let postData = that.constructionMessage({
          ...this.editorMessage,
          type: '1109',
          groupId: that.currentGroup.groupId,
          categoryId: form.type.id,
          categoryName: form.type.name,
          msgJson: JSON.stringify(mJson)
        })

        this.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          this.editorMessage = {}
          menu.value === '1' && that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.editorMessage = {}
          this.routeBack()
        })
      }
    }
  }
</script>
<style lang="scss">
  .img-submit {
    margin-top: rem(5) !important;
    margin-right: rem(-5) !important;
  }
  .expense-create {
    .vx-item {
      .es-address {
        line-height: rem(45) !important;
        .el-cascader__label {
          text-align: right !important;
          padding-right: 0;
        }
        .el-input__suffix {
          display: none;
        }
      }
      .el-input input {
        padding-right: 0;
      }
    }

    .es-time input {
      min-width: initial !important;
    }
  }
</style>
