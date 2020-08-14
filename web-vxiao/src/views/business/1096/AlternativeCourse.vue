<template>
  <page title="新建选拔"
        closePrompt>
    <label slot="btn"
           @click="handleImport">导入课程信息</label>
    <div slot="top"
         class="tp-steps">
      <div class="step-content">
        <span><b>1</b><br>面向年级</span>
        <span class="active"><b>2</b><br>备选课程</span>
        <span><b>3</b><br>选课数量</span>
        <span><b>4</b><br>规则设定</span>
        <i></i>
      </div>
    </div>
    <div class="alternative-course">
      <template>
        <vx-table :data="courses"
                  style="width: 100%"
                  border
                  @row-click="handleEdit">
          <vx-table-column fixed
                           label="名称"
                           width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.type === 'add'">
                <i class="ico ico-plus"></i>&nbsp;新课程
              </template>
              <template v-else>
                <label v-html="scope.row.name"></label>
              </template>
            </template>
          </vx-table-column>
          <vx-table-column label="关联空间"
                           width="120">
            <template slot-scope="scope">
              <label v-html="propTxt(scope.row.group)"></label>
            </template>
          </vx-table-column>
          <vx-table-column label="老师">
            <template slot-scope="scope">
              <label v-html="propTxt(scope.row.teachers)"></label>
            </template>
          </vx-table-column>
          <vx-table-column prop="description"
                           label="简介"
                           width="200">
          </vx-table-column>
          <vx-table-column label="上课时间"
                           width="150">
            <template slot-scope="scope">
              <label v-html="timeTxt(scope.row.periods)"></label>
            </template>
          </vx-table-column>
          <vx-table-column label="适选班级"
                           width="200">
            <template slot-scope="scope">
              <label v-html="propTxt(scope.row.classes)"></label>
            </template>
          </vx-table-column>
          <vx-table-column prop="upperLimit"
                           label="人数上限">
          </vx-table-column>
          <vx-table-column label="上课地点"
                           width="120">
            <template slot-scope="scope">
              <label v-html="propTxt(scope.row.place)"></label>
            </template>
          </vx-table-column>
        </vx-table>
      </template>
    </div>
    <div slot="bottom"
         class="btm-operate">
      <div class="button button-common"
           @click="handleNext">下一步</div>
    </div>
  </page>
</template>
<script>
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        courses: []
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      })
    },
    methods: {
      ...mapActions(['setSelection']),
      timeTxt(datas) {
        if (Check.isRealArray(datas)) {
          return datas
            .map(v => {
              return `${v.dayName} ${v.sectionName}`
            })
            .join('、')
        }
        return ''
      },
      propTxt(data) {
        if (Check.isRealArray(data)) {
          return data
            .map(v => {
              return v.name || v.userName || v.groupName
            })
            .join('、')
        }
        if (Check.isObject(data)) {
          return data.name
        }
        return ''
      },
      fetchData() {
        Api.getCourses(this.currentGroup.parentId, this.selection.version).then(res => {
          if (Check.isRealArray(res.courses)) {
            this.courses = res.courses.map(v => {
              v.place = { id: v.placeId, name: v.placeName }
              if (v.groupId) {
                v.group = { groupId: v.groupId, name: v.groupName }
              }
              return v
            })
          }
          this.courses.push({
            name: '',
            type: 'add'
          })
        })
      },
      handleImport() {
        const that = this
        let version = that.selection.version
        let schoolId = that.currentGroup.parentId

        let gradeIds = ''
        if (Check.isRealArray(that.selection.grades)) {
          gradeIds = that.selection.grades
            .map(v => {
              return v.groupId
            })
            .join(',')
        }

        that.$import({
          title: '导入课程信息',
          uploadURI: this.uploadURL,
          templateUrl: `/static/templates/assnTemplate.xlsx`,
          callback: (res, file) => {
            let fileId = res.file.id
            Api.importCourses({
              schoolId: schoolId,
              fileId: fileId,
              userId: that.userId,
              version: version,
              gradeGroupIds: gradeIds
            })
              .then(result => {
                that.$message({ type: 'success', message: '操作成功' })
                that.fetchData()
              })
              .catch(result => {
                if (result.commonTable) {
                  let tbl = result.commonTable
                  tbl.datas.splice(0, 1)
                  that.setStorage('_import_receipt', { lines: tbl.datas, headers: tbl.titles })
                  let urlSrc = '/business/optioncourse/import/corporation'
                  that.routePush({
                    path: '/vx/group/import/receipt',
                    query: {
                      uri: `${urlSrc}?schoolId=${schoolId}&userId=${that.userId}&version=${version}&gradeGroupIds=${gradeIds}`,
                      fileId: fileId
                    }
                  })
                }
              })
          }
        })
      },
      handleEdit(row, e, col) {
        if (row.type === 'add') {
          this.setSelection({ courseForm: null })
        } else {
          this.setSelection({ courseForm: { ...row, content: row.description } })
        }
        this.setSelection({ periods: [], teachers: [], place: null, space: null, classes: [] })
        this.routePush({ name: 'courseEdit1096' })
      },
      handleNext() {
        if (this.courses.length < 2) {
          this.$message({ type: 'warning', message: '请添加/导入备选课程' })
          return false
        }
        this.setSelection({ courses: [], courseTotal: this.courses.length - 1, amountForm: null })
        this.routePush({ name: 'courseAmount1096' })
      },
      handleBack() {
        this.setSelection({ version: 0 })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tp-steps {
    padding: rem(20) rem(10);
    text-align: center;
    border-bottom: $border;

    .step-content {
      margin: 0 auto;
      display: inline-block;
      position: relative;

      i {
        position: absolute;
        border-top: $border2;
        top: 50%;
        width: 100%;
        left: 0;
      }

      span {
        display: inline-block;
        margin-left: rem(30);
        color: nth($font-color, 1);
        background: nth($background, 6);
        position: relative;
        text-align: center;
        z-index: 1;

        b {
          font-weight: normal;
          margin-right: rem(5);
          border-radius: rem(18);
          width: rem(18);
          height: rem(18);
          line-height: rem(18);
          text-align: center;
          border: $border2;
          display: inline-block;
          margin-bottom: rem(3);
        }

        &.active {
          @include fc;
        }

        &.active b {
          @include borderColor;
        }

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .btm-operate {
    padding: rem(5) 0;
  }
</style>
