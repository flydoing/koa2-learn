<template>
  <page :title="title">
    <div class="selection-detail">
      <item @click="handleCourseInfo">
        <div slot="main">信息</div>
      </item>
      <template v-if="enrollRecords.length>0">
        <div class="category-title text">已录取（{{enrollRecords.length}}/{{selection.course.upperLimit}}）</div>
        <item v-for="item in enrollRecords"
              :key="item.id"
              :hasClick="false">
          <div slot="before">
            <img class="avatar small"
                 v-lazy="{src:url(item.userAvatar),error:Image.ICO_USER}"
                 alt='头像' />
          </div>
          <div slot="main">
            <div v-html="item.username"></div>
            <div v-html="item.groupName"></div>
          </div>
          <div slot="remark"
               v-if="item.serial">第{{item.serial}}志愿</div>
        </item>
        <div v-if="isWeb"
             class="button button-common"
             @click="handleExport">导出已录取</div>
      </template>
      <template v-if="joinRecords.length>0">
        <div class="category-title text">申报名单（{{joinRecords.length}}）</div>
        <item @click="handleAll"
              :hasArrow="false"
              label="全选">
          <div slot="before">
            <i class="ico ico-select"
               :class="{'active':all}"></i>
          </div>
        </item>
        <div class="category-title text"></div>
        <item v-for="(item, i) in joinRecords"
              :key="item.id"
              @click="handleSelect(item, i)">
          <div v-if="isStart"
               slot="before">
            <i class="ico ico-select"
               :class="{'active': item.selected}"></i>
          </div>
          <div class="user-avatar">
            <img class="avatar small"
                 v-lazy="{src:url(item.userAvatar),error:Image.ICO_USER}"
                 alt='头像' />
          </div>
          <div slot="main">
            <div v-html="item.username"></div>
            <div v-html="item.groupName"></div>
          </div>
          <div slot="remark"
               v-if="item.serial">第{{item.serial}}志愿</div>
        </item>
      </template>
    </div>
    <div slot="bottom">
      <div class="btm-operate">
        <span>已选{{enrolls.length}}人</span>
        <div class="btn-enroll"
             :class="{'disabled':!isStart}"
             @click="handleEnroll">确定录取</div>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters } from 'vuex'
  import Api from './api'
  import Check from '@/utils/check'

  export default {
    mixins: [R],
    components: {},
    data() {
      return {
        joinRecords: [],
        enrollRecords: [],
        isStart: false
      }
    },
    computed: {
      ...mapGetters({
        selection: 'getSelection'
      }),
      all() {
        return this.joinRecords.length === this.enrolls.length
      },
      enrolls() {
        return this.joinRecords.filter(v => {
          return v.selected
        })
      },
      title() {
        return this.selection.course ? this.selection.course.name : ''
      },
      isWeb() {
        if (/android/i.test(navigator.userAgent)) {
          return false
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          return false
        }
        return true
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let course = this.selection.course
        let publish = this.selection.publish
        Api.getEnrollRecords(publish.id, course.id).then(res => {
          if (res.joinRecords) {
            this.joinRecords = res.joinRecords.map(v => {
              v.selected = false
              return v
            })
          } else {
            this.joinRecords = []
          }
          this.enrollRecords = res.enrollRecords || []
          this.isStart = res.openEnroll
        })
      },
      handleCourseInfo() {
        this.routePush({ name: 'courseInfo1096' })
      },
      handleAll() {
        let value = this.all
        this.joinRecords = this.joinRecords.map(v => {
          v.selected = !value
          return v
        })
      },
      handleSelect(item, index) {
        item.selected = !item.selected
        this.$set(this.joinRecords, index, item)
      },
      handleExport() {
        let courseId = this.selection.course.id
        let publishId = this.selection.publish.id
        this.openBrowser(`/business/optioncourse/export/course?publishId=${publishId}&courseId=${courseId}`)
      },
      handleEnroll() {
        if (!this.isStart) {
          return false
        }

        let course = this.selection.course
        let publish = this.selection.publish
        let es = this.enrolls.map(v => {
          return { id: v.id }
        })
        if (!Check.isRealArray(es)) {
          this.$message({ type: 'warning', message: '请选择录取学生' })
          return false
        }
        if (es.length + this.enrollRecords.length > course.upperLimit) {
          this.$message({ type: 'warning', message: '录取学生数量不能超于录取总数' })
          return false
        }

        let uId = this.routeQuery('userId')
        let sId = this.routeQuery('schoolId')
        Api.saveEnrollStudents({
          joinRecords: es,
          publish: {
            id: publish.id,
            courseId: course.id,
            schoolId: sId || this.currentGroup.parentId,
            userId: uId || this.userId
          }
        }).then(res => {
          if (res.enrollRecords) {
            this.fetchData()
            this.$message({ type: 'success', message: '操作成功' })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .btm-operate {
    position: relative;
    padding-left: rem(10);
    border-top: $border;

    span {
      height: rem(40);
      line-height: rem(40);
    }

    .btn-enroll {
      height: rem(40);
      line-height: rem(40);
      padding: 0 rem(25);
      position: absolute;
      right: 0;
      top: 0;
      @include bc;
      color: #fff;
      cursor: pointer;

      &.disabled {
        background: #ccc;
      }
    }
  }
</style>
