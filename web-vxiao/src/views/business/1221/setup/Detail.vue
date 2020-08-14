<template>
  <Page :title="title"
        v-if="viewType==='new'">
    <item :hasClick="false">
      <div slot="main">设备名称</div>
      <input slot="remark"
             placeholder="必填"
             v-model="box.name" />
    </item>
    <item :hasClick="false">
      <div slot="main">设备序列号</div>
      <input slot="remark"
             placeholder="必填"
             v-model="box.boxcode" />
    </item>
    <item @click="clickPlace">
      <div slot="main">场所</div>
      <div slot="remark"
           class="ellipsis">{{box.placeName}}</div>
    </item>
    <el-dropdown @command="clickCategory"
                 v-if="!isEdit">
      <item v-if="!isEdit">
        <div slot="main">类型</div>
        <div slot="remark"
             class="ellipsis">{{category.name}}</div>
      </item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, i) in categorys"
                          :key="i"
                          :command="item">{{item.name}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="clickTotal"
                 v-if="category.value !== '4' && value !== '4'">
      <item v-if="category.value !== '4' && value !== '4'">
        <div slot="main">容量</div>
        <div slot="remark"
             class="ellipsis">{{box.totalCount}} 门</div>
      </item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="12">12 门</el-dropdown-item>
        <el-dropdown-item command="24">24 门</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div v-if="category.value !== '4' && value !== '4'">
      <Box v-if="isEdit"
           :allots="ruleAllots(allots)"
           :value="value"
           :count="box.totalCount"
           @click="clickBox"></Box>
    </div>
    <div class="list-button">
      <el-button type="primary"
                 icon="el-icon-upload"
                 size="medium"
                 @click="clickSubmit()">提交</el-button>
      <el-button type="danger"
                 icon="el-icon-delete"
                 size="medium"
                 @click="clickRemove()"
                 v-if="isEdit">移除</el-button>
    </div>
  </Page>
  <Page v-else-if="viewType==='placeList'"
        title="群组选择">
    <SelectGroup @change="selectPlace"
                 :groups="places"
                 :cache="cachePlace" />
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import GroupApi from '@/api/group'
  export default {
    components: {
      Box: resolve => require(['./Box'], resolve),
      SelectGroup: resolve => require(['@/views/components/group/SelectGroup'], resolve)
    },
    data() {
      return {
        title: '新增柜子',
        viewType: 'new',
        box: { totalCount: 24 },
        allots: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        places: [],
        cachePlace: {},
        schoolId: '',
        storageId: '',
        categorys: [],
        category: {
          name: ''
        },
        value: '', // 寄存柜1,器材柜2,储物柜3
        groupId: ''
      }
    },
    computed: {
      isEdit() {
        return !Check.isNull(this.storageId)
      }
    },
    created() {
      this.groupId = this.routeQuery('groupId')
      this.storageId = this.routeQuery('id')
      this.schoolId = this.routeQuery('schoolId')
      this.title = this.routeQuery('title') || '新增柜子'
      this.value = this.routeQuery('value')
    },
    mounted() {
      this.loadStorageDetail()
      this.getCategorys()
    },
    methods: {
      loadStorageDetail() {
        if (this.storageId) {
          Api.loadStorageDetail(this.storageId).then(res => {
            this.box = res.box
            // this.allots = res.allots
            // this.allots = res.allots ? res.allots : res.storageEquipmentAllots ? res.storageEquipmentAllots : res.storageDepositAllots
            if (res.allots) {
              this.allots = res.allots
            }
            if (res.storageEquipmentAllots) {
              this.allots = res.storageEquipmentAllots
            }
            if (res.storageDepositAllots) {
              this.allots = res.storageDepositAllots
            }
          })
        }
      },
      getCategorys() {
        const that = this
        that.loading = true
        Api.getCategorys().then(res => {
          if (res.code === '1') {
            this.categorys = res.categorys
          } else {
            this.$message.warning({ message: res.msg })
          }
        })
      },
      clickBox(b) {
        b.value = this.value
        if (b.readonly) {
          this.$message({ message: '不可编辑', type: 'warning' })
          return
        }
        if (this.value === '3') {
          this.routePush({
            name: 'boxDetail', // 储物柜
            query: b
          })
        }
        if (this.value === '2') {
          b.groupId = this.groupId
          this.routePush({
            name: 'BoxDetailEquipment', // 器材柜
            query: b
          })
        }
        if (this.value === '1') {
          // 寄存柜，置空
          const that = this
          let tips = b.boxStatus === '1' ? '确定要重置为空？' : '确定要重置为非空？'
          this.$confirm(tips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.updateDepositBoxSetNull(b)
          })
        }
      },
      updateDepositBoxSetNull(b) {
        let storageDepositAllot = {
          boxcode: b.boxcode,
          boxnum: b.boxnum
        }
        Api.updateDepositBoxSetNull({ storageDepositAllot })
          .then(res => {
            if (res.code === '1') {
              this.$message({ message: '操作成功', type: 'success' })
              this.loadStorageDetail()
            } else {
              this.$message({ message: res.msg, type: 'error' })
            }
          })
          .catch(res => {
            this.$message({ message: res.msg, type: 'error' })
          })
      },
      clickSubmit() {
        const that = this
        let box = that.box
        if (Check.isNullString(box.name)) {
          this.$message.warning({ message: '设备名称不能为空' })
          return null
        }
        if (Check.isNullString(box.boxcode)) {
          this.$message.warning({ message: '设备序列号不能为空' })
          return null
        }

        let category = that.category
        if (!this.isEdit) {
          if (Check.isNullString(category.value)) {
            this.$message.warning({ message: '类型不能为空' })
            return null
          }
        }

        const loading = that.$loading({ text: '提交中' })
        Api.saveOrUpdateStorage({
          boxs: [
            {
              ...box,
              totalCount: category.value === '4' ? '21' : box.totalCount,
              ...{
                status: '1',
                schoolId: that.schoolId,
                boxType: category.value
              }
            }
          ]
        })
          .then(res => {
            loading.close()
            if (Check.isRealArray(res.boxs)) {
              that.$message.success({ message: that.isEdit ? '修改成功' : '添加成功' })
              that.routeBack()
            }
          })
          .catch(res => loading.close())
      },
      clickPlace() {
        const that = this
        that.viewType = 'placeList'
        const loading = that.$loading({ target: this.$el })
        GroupApi.getPlacesBySchooId({ schoolId: this.schoolId })
          .then(res => {
            this.places = res.places
            loading.close()
          })
          .catch(res => loading.close())
      },
      clickTotal(count) {
        this.$set(this.box, 'totalCount', Number(count))
      },
      clickCategory(item) {
        this.category = item
      },
      clickRemove() {
        const that = this
        this.$confirm('确定移除储物柜？', '提示', {
          type: 'warning',
          title: '提示',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              Api.saveOrUpdateStorage({
                boxs: [
                  {
                    ...that.box,
                    ...{ status: 'd' }
                  }
                ]
              }).then(res => {
                done()
                if (Check.isRealArray(res.boxs)) {
                  that.$message.success({ message: '移除成功' })
                }
              })
            } else {
              done()
            }
          }
        })
      },
      ruleAllots(allots) {
        const that = this
        return allots.map((item, i) => {
          if (item.boxStatus === '0' || item.boxStatus === '1') {
            return {
              ...{
                boxnum: i + 1,
                active: item.boxStatus === '1',
                boxcode: that.box.boxcode,
                boxName: that.box.name,
                schoolId: this.schoolId
              },
              ...item
            }
          } else {
            return {
              ...{
                boxnum: i + 1,
                active: !Check.isNull(item.id),
                boxcode: that.box.boxcode,
                boxName: that.box.name,
                schoolId: this.schoolId
              },
              ...item
            }
          }
        })
      },
      selectPlace(place) {
        this.viewType = 'new'
        this.$set(this.box, 'placeId', place.id)
        this.$set(this.box, 'placeName', place.name)
        this.cachePlace = [place]
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-dropdown {
    display: block;
  }
</style>
