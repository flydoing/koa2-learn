<template>
  <div class="model-step">
    <el-collapse accordion
                 v-model="active">
      <el-collapse-item v-for="(item,i) in models"
                        :key="i"
                        :name="i + 1">
        <template slot="title">
          <item :label="item.name"
                :hasArrow="false"></item>
        </template>
        <template v-if="item.datas">
          <item v-for="(data,j) in item.datas"
                :key="j"
                :hasArrow="false"
                :label="data.name"
                @click="handleSelect(item, data, i, j)">
            <div slot="before">
              <i class="ico ico-select"
                 :class="{'active':data.selected}"></i>
            </div>
            <div slot="remark"
                 v-if="item.type === '3'"
                 class="text-color"
                 @click="handleDetail(data)">详情</div>
          </item>
          <div class="import-item"
               v-if="item.type === '3'">
            <span class="text-color is-click"
                  @click='handleImport'>导入选课结果</span></div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from '../api'
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        models: [],
        active: 1
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      datas() {
        let datas = []
        if (Check.isRealArray(this.models)) {
          this.models.map(v => {
            if (v.datas) {
              let ds = v.datas.filter(v => {
                return v.selected
              })
              datas.push(...ds)
            }
          })
        }
        return datas
      },
      curModel() {
        let model = null
        if (Check.isRealArray(this.models)) {
          this.models.map(v => {
            if (v.datas) {
              let ds = v.datas.filter(v => {
                return v.selected
              })
              if (Check.isRealArray(ds)) {
                model = v
              }
            }
          })
        }
        return model
      }
    },
    created() {
      let form = this.obj.form || {}
      let data = form.modelData || {}
      if (Check.isRealArray(data.models)) {
        this.models = JSON.parse(JSON.stringify(data.models))
      } else {
        this.loadModelData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject']),
      loadModelData() {
        let form = this.obj.form || {}
        let data = form.modelData || {}
        Api.getModels(this.currentGroup.parentId).then(res => {
          if (res.interfaces) {
            this.models = res.interfaces.map(v => {
              if (v.datas) {
                v.datas = v.datas.map(d => {
                  return { ...d, selected: false }
                })
              }
              return v
            })
            this.setCreateObject({
              form: {
                ...form,
                modelData: {
                  ...data,
                  models: this.models
                }
              }
            })
          }
        })
      },
      handleDetail(data) {
        this.routePush({
          path: '/vx/group/business/1147/modelStep/detail',
          query: {
            msgId: data.msgId,
            title: data.name
          }
        })
      },
      handleSelect(item, data, i, j) {
        if (item.type === '1') {
          data.selected = !data.selected
          this.models = this.models.map(v => {
            if (item.type === v.type) {
              v.datas = v.datas.map(d => {
                if (d.id === data.id) {
                  return data
                }
                return d
              })
            } else if (v.datas) {
              v.datas = v.datas.map(d => {
                d.selected = false
                return d
              })
            }
            return v
          })
        } else {
          this.models = this.models.map(v => {
            if (item.type === v.type) {
              v.datas = v.datas.map(d => {
                d.selected = d.id === data.id
                return d
              })
            } else if (v.datas) {
              v.datas = v.datas.map(d => {
                d.selected = false
                return d
              })
            }
            return v
          })
        }

        let form = this.obj.form
        this.setCreateObject({
          form: {
            ...form,
            modelData: {
              ...form.modelData,
              models: this.models,
              datas: this.datas,
              curModel: this.curModel
            }
          }
        })
      },
      handleImport() {
        const that = this
        this.$import({
          title: '导入',
          uploadURI: `/commons/file/upload`,
          templateUrl: '/static/templates/selectCourseRes.xlsx',
          callback: (res, file) => {
            Api.importSelectionResult(that.schoolId, file.id)
              .then(result => {
                if (res.code === '1') {
                  that.$message({ message: '操作成功', type: 'success' })
                  that.loadModelData()
                }
              })
              .catch(res => {
                if (res.errors.length < 10) {
                  this.$message({
                    dangerouslyUseHTMLString: true,
                    message: res.errors.join('<br>'),
                    type: 'error'
                  })
                } else {
                  let errors = res.errors.slice(0, 10)
                  this.$message({
                    dangerouslyUseHTMLString: true,
                    message: `${errors.join('<br>')}<br>......`,
                    type: 'error'
                  })
                }
              })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .model-step {
    .vx-item {
      &.is-click:hover {
        background: #fff;
      }
      cursor: pointer;
    }
    .el-collapse {
      border-top: 0 !important;
    }
    .el-collapse-item__content {
      padding-bottom: 0 !important;
      & > div:last-child {
        &:after {
          height: 0;
        }
      }
    }
    .import-item {
      padding: rem(5) rem(10);
    }
  }
</style>
