<template>
  <Page title="收货信息"
        closePrompt
        hasSubmit
        @submit="handleSubmit">
    <item :hasClick="false"
          label="收件人">
      <input slot="remark"
             placeholder="姓名"
             v-model="form.addressee" />
    </item>
    <item :hasClick="false"
          label="手机号码">
      <input slot="remark"
             placeholder="11位手机号"
             v-model="form.mobile" />
    </item>
    <item :hasClick="false"
          label="地区">
      <div slot="remark">
        <el-cascader class="es-address"
                     :options="form.provinces"
                     v-model="form.selectAreas"
                     @active-item-change="handleAddress"></el-cascader>
      </div>
    </item>
    <item :hasClick="false"
          label="详细信息">
      <input slot="remark"
             placeholder="街道门牌信息"
             v-model="form.address" />
    </item>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          addressee: '',
          mobile: '',
          address: '',
          area: {},
          provinces: [],
          selectAreas: []
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        crm: 'getCrm'
      })
    },
    methods: {
      ...mapActions(['setCrm', 'deleteCrmProp']),
      fetchData() {
        if (this.crm.receive) {
          this.form = JSON.parse(JSON.stringify(this.crm.receive))
        } else {
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
      handleSubmit() {
        const that = this
        let form = this.form
        if (Check.isNullString(form.addressee)) {
          that.$message({ message: '收件人不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.mobile)) {
          that.$message({ message: '手机号码不能为空', type: 'warning' })
          return false
        }
        this.setCrm({ receive: this.form })
        this.routeBack()
      }
    }
  }
</script>
<style lang="scss">
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
</style>
