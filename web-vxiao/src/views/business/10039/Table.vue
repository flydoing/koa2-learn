<template>
  <page :hasSubmit="editStatus !=='3' && templateId != 5"
        :title="title"
        @submit="submit">
    <div class="category-title"
         v-show="editStatus ==='3' ">填报已截止，如需修改请与集团管理员联系</div>
    <div class="tableWrapper">
      <vx-table v-if="tableData"
                :data="datas"
                :height="maxHeight"
                border>
        <template v-if="tableData.columns">
          <vx-table-column width="140"
                           v-for="(item,i) in columns"
                           :key="i"
                           :label="item"
                           :fixed="i===0 && columns.length>2">
            <template slot-scope="scope">
              <div v-if="i=== 0">{{scope.row.coumns[i].name}}</div>
              <input type="text"
                     v-else
                     v-model.trim="scope.row.coumns[i].name"
                     :disabled="editStatus === '3'?true:!scope.row.coumns[i].able"
                     :placeholder="editStatus === '3'?'':(scope.row.coumns[i].able?'请输入数字':'')"
                     class="input_from">
            </template>
          </vx-table-column>
        </template>
      </vx-table>
      <div class="commin-btn"
           v-if="!isWeb && editStatus !=='3'">
        <button @click="submit">提交</button>
      </div>
    </div>

  </page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  import Cammand from '@/constant/cammand.js'
  export default {
    mixins: [R],
    data() {
      return {
        editStatus: '',
        templateId: '',
        title: '',
        status: true,
        tableData: null,
        school_Id: '',
        maxHeight: 0
      }
    },
    created() {
      this.editStatus = this.$route.query.status ? this.$route.query.status : ''
      this.templateId = this.$route.query.templateId ? this.$route.query.templateId : ''
      this.school_Id = this.$route.query.schoolId ? this.$route.query.schoolId : ''
      this.title = this.$route.query.name ? this.$route.query.name : ''
      this.getReportDetail()
      this.$web.postJsAction({
        type: Cammand.ACTION_TITLE,
        content: this.title
      })
    },
    computed: {
      isWeb() {
        if (/android/i.test(navigator.userAgent)) {
          return false
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          return false
        }
        return true
      },
      datas() {
        return this.tableData.datas || []
      },
      columns() {
        return this.tableData.columns || []
      }
    },
    methods: {
      formatNum(num) {
        if (num) {
          var reg = num.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
          return num.replace(reg, '$1,')
        }
      },
      forMat(item) {
        if (isNaN(Number(item.name))) {
          this.$message.warning('请输入数字')
          return false
        } else {
          if (item.name) {
            if (item.code === 'target2') {
              if (Number(item.name) < 0) {
                this.$message.warning('平均出勤计费人数只能是正数')
                return false
              } else {
                this.$set(item, 'name', Number(item.name).toFixed(2))
              }
            } else {
              this.$set(item, 'name', Number(item.name).toFixed(2))
            }
          }
          return true
        }
      },
      getReportDetail() {
        let schoolId
        if (this.isWeb) {
          if (this.isEducation) {
            schoolId = this.school_Id
          } else {
            schoolId = this.schoolId
          }
        } else {
          schoolId = this.$route.query.schoolId
        }
        Api.getTemplateDetail(schoolId, this.templateId).then(res => {
          if (res && res.tableData) {
            this.tableData = res.tableData
            this.tableData.datas.forEach(item => {
              item.coumns.forEach(subItem => {
                // if (subItem.code) {
                subItem.name = this.formatNum(subItem.name)
                // }
              })
            })
          }
        })
      },
      submit() {
        let obj = {}
        let status = true
        this.tableData.datas.some(item => {
          let arr = []
          item.coumns.some(subItem => {
            if (subItem.code) {
              if (subItem.name && subItem.name.indexOf('/') === -1) {
                if (subItem.name.indexOf(',') !== -1) {
                  subItem.name = subItem.name.replace(/,/g, '')
                }
                if (!this.forMat(subItem)) {
                  status = false
                  return true
                }
              }

              obj[subItem.code] = arr
              arr.push(subItem.name)
            }
          })
        })
        if (!status) return
        obj = JSON.stringify(obj)
        let query = {
          schoolId: this.isWeb ? (this.isEducation ? this.school_Id : this.schoolId) : this.school_Id,
          templateId: this.templateId,
          data: obj
        }
        Api.saveFormData(query).then(res => {
          if (res.code === '1') {
            this.$message.success('保存成功')
            this.routeBack()
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .category-title {
    text-align: center;
  }
  .tableWrapper {
    position: relative;
    .commin-btn {
      position: absolute;
      bottom: rem(10);
      left: 50%;
      transform: translateX(-50%);
      @include flex;
      button {
        @include bc;
        display: block;
        width: rem(250);
        height: rem(40);
        margin: rem(30) auto;
        line-height: rem(40);
        font-size: rem(14);
        color: nth($font-color, 4);
        border-radius: rem(3);
        cursor: pointer;
        border: none;
        outline: none;
        &:hover {
          @include bch;
        }
      }
    }
  }
</style>
