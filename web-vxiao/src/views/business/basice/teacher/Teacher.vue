<!-- 老师信息 -->
<template>
  <Page title="老师信息"
        :loading="loading">
    <label slot="btn"
           @click="importTeacher">导入老师信息</label>
    <Item :hasClick="false"
          fullInput
          slot="top"
          class="search">
      <div slot="before">
        <i class="ico ico-search"></i>
      </div>
      <input placeholder="搜索"
             v-model="keyword" />
    </Item>
    <vx-table :data="results"
              :height="maxHeight"
              stripe
              @row-click="onRowClick">
      <vx-table-column label="序号"
                       fixed
                       width="50">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </vx-table-column>
      <vx-table-column label="姓名"
                       prop="name"
                       fixed
                       width="120" />
      <vx-table-column label="校区"
                       width="150">
        <template slot-scope="scope">
          {{scope.row.campus | arrayNameToString}}
        </template>
      </vx-table-column>
      <vx-table-column label="手机号码"
                       prop="mobile"
                       width="120" />
      <vx-table-column label="人脸信息"
                       width="150">
        <template slot-scope="scope">
          <img class="avatar big"
               v-lazy="{src:url(scope.row.face || scope.row.avatar),error:Image.ICO_AVATAR}">
        </template>
      </vx-table-column>
      <vx-table-column label="任教科目"
                       width="150">
        <template slot-scope="scope">
          {{scope.row.courses | arrayNameToString}}
        </template>
      </vx-table-column>
      <vx-table-column label="职务"
                       width="150">
        <template slot-scope="scope">
          {{scope.row.jobs | arrayNameToString}}
        </template>
      </vx-table-column>
      <vx-table-column label="所在群组"
                       width="200">
        <template slot-scope="scope">
          {{scope.row.groups | arrayNameToString}}
        </template>
      </vx-table-column>
    </vx-table>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  export default {
    name: 'TeacherInfo',
    activated() {
      this.init()
    },
    data() {
      return {
        maxHeight: 100,
        loading: true,
        teachers: [],
        keyword: [],
        results: []
      }
    },
    methods: {
      init() {
        this.schoolId = this.routeQuery('schoolId') || this.routeQuery('extension')
        Api.loadTeacherInfo(this.schoolId).then(res => {
          this.results = this.teachers = res.teachers
          this.loading = false
        })
      },
      importTeacher() {
        let that = this
        let userId = this.USER.id
        that.$import({
          title: '导入老师信息',
          uploadURI: this.uploadURL,
          receiptUrl: `/base/school/teacher/import?schoolId=${this.schoolId}&userId=${userId}`,
          templateUrl: '/static/templates/basice_teacher.xlsx',
          callback: (res, file) => {
            this.$message({ type: 'success', message: res.msg })
            this.init()
          },
          receiptBack: (res, file) => {
            if (res.commonTable) {
              let lines = []
              res.commonTable.lines.map((l, i) => {
                lines.push(l.slice(0, 5))
              })
              that.setStorage('_import_receipt', {
                headers: ['校区', '姓名', '性别', '手机号码', '任教科目', '所在群组'],
                lines: lines
              })
              that.routePush({
                path: '/vx/group/import/receipt',
                query: {
                  uri: `/base/school/teacher/import?schoolId=${this.schoolId}&userId=${userId}`,
                  fileId: res.fileId
                }
              })
            }
          }
        })
      },
      onRowClick(t, i) {
        this.setStorage('_cache_teacher', t)
        this.routePush({
          name: 'basiceTeacherEdit',
          query: {
            schoolId: this.routeQuery('schoolId')
          }
        })
      }
    },
    watch: {
      keyword(value) {
        if (!Check.isNullString(value)) {
          this.results = this.teachers.filter(v => {
            return v.name.indexOf(value) !== -1
          })
        } else {
          this.results = this.teachers
        }
      }
    }
  }
</script>
