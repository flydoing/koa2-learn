<template>
  <div class="teacher-step">
    <vx-table :data="teachers"
              :height="maxHeight"
              stripe
              @row-click="onRowClick">
      <vx-table-column label="序号"
                       fixed
                       width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.type === 'add'">
            <div>
              <i class="el-icon-plus plus-icon"></i>
              <span>新增</span>
            </div>
          </template>
          <template v-else>
            {{scope.$index + 1}}
          </template>
        </template>
      </vx-table-column>
      <vx-table-column label="姓名"
                       fixed
                       width="120">
        <template slot-scope="scope">
          <label v-html="scope.row.name"></label>
          <template v-if="scope.row.priority">
            <span class="star"></span>
          </template>
        </template>
      </vx-table-column>
      <vx-table-column label="校区"
                       width="150">
        <template slot-scope="scope">
          {{scope.row.campus | arrayNameToString}}
        </template>
      </vx-table-column>
      <vx-table-column label="手机号码"
                       prop="mobile"
                       width="120" />
      <vx-table-column label="任教科目">
        <template slot-scope="scope">
          {{scope.row.courses | arrayNameToString}}
        </template>
      </vx-table-column>
    </vx-table>
  </div>
</template>
<script>
  import R from '@/views/group/mixin'
  import Check from '@/utils/check'
  import Api from '../api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {
      maxHeight: { type: [String, Number] },
      timeStamp: { type: [String, Number] }
    },
    components: {},
    data() {
      return {
        teachers: []
      }
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      })
    },
    created() {
      let form = this.obj.form || {}
      let data = form.teacherData || {}
      if (data.teachers) {
        this.teachers = JSON.parse(JSON.stringify(data.teachers))
      } else {
        this.loadTeacherData()
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      loadTeacherData() {
        let form = this.obj.form || {}
        let data = form.subjectData || {}
        Api.getTeacherInfo(this.currentGroup.parentId).then(res => {
          if (Check.isRealArray(res.teachers)) {
            this.teachers = [...res.teachers, { type: 'add' }]
            this.setCreateObject({
              form: {
                ...form,
                teacherData: {
                  ...data,
                  teachers: this.teachers
                }
              }
            })
          }
        })
      },
      onRowClick(row, i) {
        this.setCreateObject({ teacherCache: row })
        this.routePush({ path: '/vx/group/business/1147/teacherStep/edit' })
      }
    },
    watch: {
      timeStamp(val) {
        this.loadTeacherData()
      }
    }
  }
</script>
<style  lang="scss" scoped>
  .teacher-step {
    label {
      vertical-align: middle;
    }
    .star {
      display: inline-block;
      width: rem(18);
      height: rem(18);
      margin-left: rem(5);
      background: url(~images/ico/ico_light_star.png) no-repeat center;
      background-size: 100%;
      vertical-align: middle;
    }
  }
</style>
