<template>
  <Page title="新建排考"
        hasSubmit
        closePrompt
        listenBack
        @back="back"
        @submit="handleSubmit">
    <div class="normal-arrange">
      <item :hasClick="false">
        <div slot="main">考试名称</div>
        <input slot="remark"
               class="align-right"
               placeholder="必填"
               v-model="form.name" />
      </item>
      <item :hasClick="false">
        <div slot="main">开始时间</div>
        <div slot="after">
          <el-date-picker v-model="form.startTime"
                          prefix-icon="x"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"
                          :clearable="false"></el-date-picker>
        </div>
      </item>
      <item :hasClick="false">
        <div slot="main">结束时间</div>
        <div slot="after">
          <el-date-picker v-model="form.endTime"
                          prefix-icon="x"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm"
                          format="yyyy-MM-dd HH:mm"
                          :clearable="false"></el-date-picker>
        </div>
      </item>
      <div v-for="(campus, i) in form.list"
           :key="i">
        <template v-if="campus.datas">
          <div class="category-title text"
               v-html="campus.name"></div>
          <el-dropdown v-for="(place,j) in campus.datas"
                       :key="j"
                       class="block-element"
                       trigger="click"
                       @command="handleType">
            <div class="el-dropdown-link">
              <item>
                <div slot="main"
                     v-html="place.name"></div>
                <div slot="remark"
                     v-html="remarkTxt(place)"></div>
              </item>
            </div>
            <el-dropdown-menu class="drop-menu"
                              slot="dropdown">
              <el-dropdown-item class="menu-item"
                                v-for="(type,k) in types"
                                :key="k"
                                :command="{'place': place, 'type': type, 'cIndex': i, 'pIndex': j}">
                <template v-if="type.value==='1'">
                  <el-upload action="/commons/file/upload"
                             :show-file-list="false"
                             :on-success="uploadSuccess"
                             :before-upload="beforeUpload">
                    {{type.name}}
                  </el-upload>
                </template>
                <template v-else>
                  {{type.name}}
                </template>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
    </div>
  </Page>
</template>
<script>
  import R from '@/views/group/mixin'
  import MixinMessage from '@/views/group/mixinMessage'
  import Check from '@/utils/check'
  import DateUtils from '@/utils/date'
  import Api from '../api'

  export default {
    mixins: [R, MixinMessage],
    components: {},
    data() {
      return {
        form: {
          name: '',
          startTime: '',
          endTime: '',
          list: []
        },
        curItem: null,
        types: [
          {
            value: '1',
            name: '上传图片',
            text: '【图片】'
          },
          {
            value: '2',
            name: '上传Excel',
            text: '【表格】'
          },
          {
            value: '3',
            name: '清空'
          }
        ]
      }
    },
    computed: {},
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        Api.getPlaces(this.currentGroup.groupId).then((res) => {
          if (Check.isRealArray(res.datas)) {
            this.form.list = res.datas
          }
        })
      },
      remarkTxt(item) {
        return item.type ? item.type.text : ''
      },
      handleType(item) {
        if (item.type.value === '1') {
          this.curItem = item
        } else if (item.type.value === '2') {
          this.$import({
            title: '上传Excel',
            uploadURI: `/commons/file/readExcel`,
            callback: (res, file) => {
              this.$set(this.form.list[item.cIndex].datas, item.pIndex, { ...item.place, type: item.type, excel: res.dataGirds[0].data })
            }
          })
        } else {
          this.$set(this.form.list[item.cIndex].datas, item.pIndex, { ...item.place, type: null })
        }
      },
      uploadSuccess(res, file, fileLlist) {
        let item = this.curItem
        let place = this.form.list[item.cIndex].datas[item.pIndex]
        this.$set(this.form.list[item.cIndex].datas, item.pIndex, { ...place, type: item.type, image: res.file.id })
      },
      beforeUpload(file) {
        let flag = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        if (!flag) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
        this.loading = true
      },
      handleSubmit() {
        const that = this
        let form = that.form
        if (Check.isNullString(form.name)) {
          that.$message({ message: '考试名称不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.startTime) || Check.isNullString(form.endTime)) {
          that.$message({ message: '考试时间不能为空', type: 'warning' })
          return false
        }

        let places = []
        form.list.forEach((v, i) => {
          if (Check.isRealArray(v.datas)) {
            v.datas.forEach((k, j) => {
              if (k.type) {
                let data = {
                  campusId: v.id,
                  examPlaceId: k.extension,
                  groupId: k.groupId
                }
                if (k.image) {
                  places.push({
                    ...data,
                    fileId: k.image
                  })
                } else if (k.excel) {
                  places.push({
                    ...data,
                    seat: JSON.stringify(k.excel)
                  })
                }
              }
            })
          }
        })

        if (!Check.isRealArray(places)) {
          that.$message({ message: '至少设置一个考场信息', type: 'warning' })
          return false
        }

        let postData = that.constructionMessage({
          type: '1164',
          groupId: that.groupId,
          content: form.name,
          startTime: DateUtils.format_0800(form.startTime),
          endTime: DateUtils.format_0800(form.endTime),
          msgJson: JSON.stringify(places)
        })

        that.addMessage(postData).then((res) => {
          that.$message({ message: '操作成功', type: 'success' })
          that.routeBack(-2)
        })
      },
      back() {
        this.$confirm('是否取消当前操作？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$router.go(-2)
        })
      }
    }
  }
</script>
