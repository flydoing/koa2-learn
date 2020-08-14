<template>
  <page :title="title">
    <div slot="btn">
      <el-dropdown trigger="click"
                   @command="handleAdd">
        <div class="el-dropdown-link">
          <i class="ico ico-add add-item"></i>
        </div>
        <el-dropdown-menu class="drop-menu"
                          slot="dropdown">
          <el-dropdown-item class="menu-item"
                            v-for="(item,i) in menus"
                            :key="i"
                            :command="item">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="resume-list">
      <div class="each-item"
           v-for="(item, i) in list"
           :key="i"
           @click="handleItem(item, i)">
        {{dateTxt(item)}}<br>
        <template v-if="item.type!=1">
          工作单位：{{item.workUnit}}<br>
          职务：{{item.job}}
        </template>
        <template v-else>
          毕业院校：{{item.schoolName}}
          <template v-if="item.major">
            <br>专业：{{item.major}}
          </template>
          <template v-if="item.degreeCategoryName">
            <br>学位：{{item.degreeCategoryName}}
          </template>
        </template>
        <template v-if="item.remark">
          <br>备注：{{item.remark}}
        </template>
      </div>
    </div>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import { mapGetters, mapActions } from 'vuex'
  import Api from './api'
  import DateUtils from '@/utils/date'

  export default {
    mixins: [R],
    data() {
      return {
        list: [],
        menus: [
          {
            name: '教育背景',
            value: 1
          },
          {
            name: '工作经历',
            value: 2
          }
        ]
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      ...mapGetters({
        obj: 'getCreateObject'
      }),
      title() {
        return this.routeQuery('title') || ''
      },
      isEdit() {
        return this.obj.isEdit === 1
      }
    },
    methods: {
      ...mapActions(['setCreateObject', 'modifyCreateObjectField']),
      dateTxt(item) {
        if (item.endTime) {
          return `${DateUtils.format(item.startTime, 'yyyy.MM.dd')} - ${DateUtils.format(item.endTime, 'yyyy.MM.dd')}`
        }
        return DateUtils.format(item.startTime, 'yyyy.MM.dd')
      },
      fetchData() {
        if (this.obj.resume) {
          this.modifyCreateObjectField('resume')
        }
        if (this.obj.userId) {
          this.modifyCreateObjectField('userId')
        }
        if (this.obj.type) {
          this.modifyCreateObjectField('type')
        }
        let userId = this.routeQuery('userId') || this.userId
        Api.getResumes(userId).then(res => {
          this.list = res.curriculumVitaes || []
        })
      },
      handleItem(item, index) {
        let userId = this.routeQuery('userId') || this.userId
        this.setCreateObject({ resume: item, userId: userId, type: item.type })
        this.routePush({ name: 'resumeEdit1179' })
      },
      handleAdd(menu) {
        let userId = this.routeQuery('userId') || this.userId
        this.setCreateObject({ userId: userId, type: menu.value })
        this.routePush({
          name: 'resumeEdit1179'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .resume-list {
    .each-item {
      padding: rem(10);
      border-bottom: rem(1) solid #ededed;
      cursor: pointer;
      text-align: justify;
    }
  }
  .add-item {
    margin: 0 !important;
  }
</style>
