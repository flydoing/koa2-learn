<template>
  <page title="课室信息"
        closePrompt
        @submit="handleSubmit"
        hasSubmit>
    <!-- 楼宇 -->
    <item :hasClick="false"
          label="楼宇">
      <input slot="remark"
             placeholder="必填"
             v-model="form.floorName" />
    </item>
    <!-- 场所名称 -->
    <item :hasClick="false"
          label="场所名称">
      <input slot="remark"
             placeholder="必填"
             v-model="form.name" />
    </item>
    <!-- 场所类型 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showType">
      <Scroller :height="300">
        <Item v-for="(item, i) in types"
              :key="i"
              @click="selectType(item)"
              :label="item.name">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="场所类型"
            :remark="typeTxt">
      </Item>
    </el-popover>
    <!-- 常驻班级 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showClass">
      <Scroller :height="300">
        <Item v-for="(item, i) in classes"
              :key="i"
              @click="selectClass(item)"
              :label="item.name">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="常驻班级"
            :remark="classTxt">
      </Item>
    </el-popover>
    <!-- 最大上课班数 -->
    <el-popover placement="bottom-end"
                width="400"
                trigger="click"
                v-model="showCount">
      <Scroller :height="300">
        <Item v-for="(item, i) in counts"
              :key="i"
              @click="selectCount(item)"
              :label="item.toString()">
        </Item>
      </Scroller>
      <Item slot="reference"
            label="最大上课班数"
            :remark="countTxt">
      </Item>
    </el-popover>
    <!-- 科目限定 -->
    <item @click="handleSubject"
          label="科目限定">
      <div slot="remark"
           class="ellipsis"
           v-html="subjectTxt"></div>
    </item>
    <div class="button button-common"
         v-if="form.id"
         @click="handleRemove">删除</div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import { mapGetters, mapActions } from 'vuex'
  import CategoryApi from '@/api/category'
  import R from '@/views/group/mixin'
  import PlaceApi from '@/views/business/basice/api'
  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        form: {
          name: '',
          floorName: '',
          type: null,
          group: null,
          maxClass: '',
          subjects: []
        },
        types: [],
        classes: [],
        counts: [],
        showType: false,
        showClass: false,
        showCount: false
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      typeTxt() {
        let type = this.form.type || {}
        return type.name || '必填'
      },
      classTxt() {
        let group = this.form.group || {}
        return group.name || '（无）公共场所'
      },
      subjectTxt() {
        if (Check.isRealArray(this.form.subjects)) {
          let subjects = this.form.subjects.map(v => {
            return v.name
          })
          return subjects.join('、')
        }
        return '不限'
      },
      countTxt() {
        return this.form.maxClass.toString() || '必填'
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      fetchData() {
        let cache = this.obj.roomCache
        if (this.obj.roomForm) {
          this.form = { ...this.obj.roomForm }
          if (this.obj.subjects) {
            this.form.subjects = this.obj.subjects
            this.modifyCreateObjectField('subjects')
          }
          this.modifyCreateObjectField('roomForm')
        } else if (cache) {
          let group = null
          if (cache.groupId) {
            group = {
              groupId: cache.groupId,
              name: cache.groupName
            }
          }
          this.form = {
            ...cache,
            group: group,
            subjects: cache.courses || []
          }
        }
        this.modifyCreateObjectField('roomCache')

        CategoryApi.getCategorysByType('153').then(res => {
          if (res.categorys) {
            this.types = res.categorys
            if (cache) {
              this.form.type = this.types.filter(v => {
                return v.value === cache.type
              })[0]
            }
          }
        })
        PlaceApi.loadCommonGroups(this.currentGroup.parentId).then(res => {
          this.classes = res.groups ? [{ name: '（无）公共场所' }, ...res.groups] : []
        })
        for (let i = 20; i > 0; i--) {
          this.counts.push(i)
        }
      },
      selectType(item) {
        this.showType = false
        this.form.type = item
      },
      selectCount(item) {
        this.showCount = false
        this.form.maxClass = item
      },
      selectClass(item) {
        this.showClass = false
        this.form.group = item
      },
      handleSubject() {
        this.setCreateObject({ roomForm: this.form, subjects: this.form.subjects })
        this.routePush({ path: '/vx/group/business/1147/roomStep/selectSubject' })
      },
      handleSubmit() {
        let form = this.form
        let campus = this.obj.campus
        if (Check.isNullString(form.floorName)) {
          this.$message({ message: '楼宇不能为空', type: 'warning' })
          return false
        }
        if (Check.isNullString(form.name)) {
          this.$message({ message: '场所名称不能为空', type: 'warning' })
          return false
        }
        if (!form.type) {
          this.$message({ message: '请选择场所类型', type: 'warning' })
          return false
        }
        if (!form.maxClass) {
          this.$message({ message: '请选择最大上课班数', type: 'warning' })
          return false
        }

        let subjects = []
        if (Check.isRealArray(form.subjects)) {
          subjects = form.subjects.map(v => {
            return {
              id: v.id,
              name: v.name
            }
          })
        }
        let postData = {
          cid: form.cid || campus.id,
          courses: subjects,
          floorName: form.floorName,
          id: form.id || void 0,
          maxClass: form.maxClass,
          name: form.name,
          schoolId: this.currentGroup.parentId,
          status: '1',
          type: form.type.value
        }
        if (form.group) {
          postData.groupId = form.group.groupId
          postData.groupName = form.group.name
        }
        PlaceApi.modifyPlace({
          places: [postData]
        }).then(res => {
          this.$message({ message: '操作成功', type: 'success' })
          this.routeBack()
        })
      },
      handleRemove() {
        this.$confirm('确认删除该课室？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          PlaceApi.modifyPlace({
            places: [
              {
                id: this.form.id,
                status: 'd'
              }
            ]
          }).then(res => {
            this.$message({ message: '操作成功', type: 'success' })
            this.routeBack()
          })
        })
      }
    }
  }
</script>
