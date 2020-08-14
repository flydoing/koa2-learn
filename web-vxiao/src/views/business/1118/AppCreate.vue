<template>
  <Page title="新建友商"
        closePrompt
        hasSubmit
        listenBack
        @submit="handleSubmit"
        @back="handleBack">
    <item label="名称"
          :hasClick="false">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <item label="所在地"
          :hasClick="false">
      <div slot="remark">
        <el-cascader class="es-address"
                     :options="form.provinces"
                     v-model="form.location"
                     @active-item-change="handleLocation"></el-cascader>
      </div>
    </item>
    <item label="代理商政策"
          :hasClick="false">
      <input slot="remark"
             placeholder="选填"
             v-model="form.policy" />
    </item>
    <keep-alive>
      <EditorSimple :store.sync="editorMessage"
                    placeholder="产品优略势、代理商数量及名单、已成单数量及名单"
                    :toolbars="['photo']" />
    </keep-alive>
  </Page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import GroupApi from '@/api/group'
  export default {
    mixins: [R, MixinMessage],
    components: {
      EditorSimple: resolve => require(['@/components/editor/EditorSimple'], resolve)
    },
    data() {
      return {
        form: {
          name: '',
          policy: '',
          area: {},
          provinces: [],
          location: []
        }
      }
    },
    computed: {},
    activated() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        const that = this
        GroupApi.getProvinces().then(res => {
          that.form.provinces = res.provinces.map(v => {
            if (that.form.area[v.provinceId]) {
              return that.form.area[v.provinceId]
            }
            if (v.province.indexOf('市') !== -1) {
              v = { ...v, label: v.province, value: v.provinceId }
              that.form.area[v.provinceId] = v
            } else {
              v = { ...v, label: v.province, value: v.provinceId, children: [] }
              that.form.area[v.provinceId] = v
            }
            return v
          })
        })
      },
      handleLocation(ads) {
        const that = this
        let pv = that.form.area[ads[0]]
        let ct = that.form.area[ads[1]]
        if (ct && ads[1]) {
          GroupApi.getAreas(ads[1]).then(res => {
            that.form.provinces = that.form.provinces.map(v => {
              if (v.value === ct.parentId) {
                v.children = v.children.map(c => {
                  if (c.value === parseInt(ads[1]) && res.areas) {
                    c.children = res.areas.map(a => {
                      a = { ...a, label: a.area, value: a.areaId }
                      that.form.area[a.areaId] = a
                      return a
                    })
                  }
                  return c
                })
              }
              return v
            })
          })
        } else {
          GroupApi.getCities(ads[0]).then(res => {
            that.form.provinces = that.form.provinces.map(v => {
              if (v.value === parseInt(ads[0]) && res.citys) {
                v.children = res.citys.map(c => {
                  c = { ...c, label: c.city, value: c.cityId, children: [] }
                  that.form.area[c.cityId] = c
                  return c
                })
                pv.children = v.children
              }
              return v
            })
          })
        }
        that.form.location = ads
      },
      handleSubmit() {
        const that = this
        let form = this.form
        let editor = this.editorMessage
        if (Check.isNullString(form.name)) {
          that.$message({ message: '名称不能为空', type: 'warning' })
          return false
        }
        if (!Check.isRealArray(form.location)) {
          that.$message({ message: '请选择所在地', type: 'warning' })
          return false
        }
        if (Check.isNullString(editor.content)) {
          that.$message({ message: '内容不能为空', type: 'warning' })
          return false
        }

        let address = form.location.map(v => {
          return form.area[v].label
        })
        let postData = that.constructionMessage({
          ...editor,
          type: '1118',
          groupId: that.groupId,
          msgJson: JSON.stringify({
            city: address.join(' '),
            policy: form.policy,
            title: form.name
          })
        })

        that.addMessage(postData).then(res => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack()
        })
      },
      handleBack() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.routeBack()
        })
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
