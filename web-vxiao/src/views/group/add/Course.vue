<template>
  <Page title="创建课程"
        hasSubmit
        @submit="submit">
    <Avatar @success="logo">
      <Item>
        <div>封面</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item :hasClick="false">
      <div>名称</div>
      <input slot="remark"
             placeholder="12个汉字以内"
             v-model="group.name" />
    </Item>
    <el-dropdown class="block-element"
                 trigger="click"
                 placement="bottom-end"
                 @command="onSchool">
      <Item>
        <div>所属</div>
        <div slot="remark">{{school.name}}</div>
      </Item>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="s in schools"
                          :key="s.id"
                          :command="s">{{s.name}} {{s.campusName}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <Item @click="tag">
      <div>标签</div>
      <div slot="remark">{{tagText}}</div>
    </Item>
    <Item @click="catalog">
      <div>目录</div>
      <div slot="remark">{{catalogText}}</div>
    </Item>
    <el-dropdown class="block-element"
                 trigger="click"
                 placement="bottom-end"
                 @command="courseType">
      <Item>
        <div>类别</div>
        <div slot="remark">{{group.courseType==='2'?'校本课程':'国家课程'}}</div>
      </Item>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item command="1">国家课程</el-dropdown-item>
        <el-dropdown-item command="2">校本课程</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="category-title"></div>
    <el-dropdown class="block-element"
                 trigger="click"
                 placement="bottom-end"
                 @command="open">
      <Item>
        <div>开放范围</div>
        <div slot="remark">{{group.isOpen==='0'?'不公开':group.isOpen==='1'?'校内公开':'公开'}}</div>
      </Item>
      <el-dropdown-menu class="drop-menu"
                        slot="dropdown">
        <el-dropdown-item command="0">不公开</el-dropdown-item>
        <el-dropdown-item command="1">校内公开</el-dropdown-item>
        <el-dropdown-item command="2">公开</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <Item :hasClick="false">
      <div>教学时间</div>
      <input slot="remark"
             placeholder="选填"
             v-model="group.sessionTime" />
    </Item>
    <Item :hasClick="false">
      <div>教学地点</div>
      <input slot="remark"
             placeholder="选填"
             v-model="group.address" />
    </Item>
    <TextInput placeholder="课程介绍"
               :max="100"
               v-model="group.description" />
  </Page>
</template>
<script>
  import Api from '@/api/group'
  import { mapActions } from 'vuex'
  import Check from '@/utils/check'
  export default {
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve),
      TextInput: resolve => require(['@/components/TextInput'], resolve)
    },
    data() {
      return {
        schools: [],
        tagText: '必填',
        catalogText: '必填',
        school: {},
        category: {},
        group: {
          name: '',
          description: '',
          courseType: '1',
          isOpen: '2',
          gradeId: ''
        }
      }
    },
    created() { },
    methods: {
      ...mapActions(['addCourse']),
      submit() {
        if (Check.isNullString(this.group.name)) {
          this.$message({ type: 'warning', message: '名称不能为空' })
          return
        }
        if (Check.isNullString(this.group.parentId)) {
          this.$message({ type: 'warning', message: '所属不能为空' })
          return
        }
        if (!Check.isRealArray(this.group.categorys)) {
          this.$message({ type: 'warning', message: '标签和目录不能为空' })
          return
        }
        this.addCourse({ course: this.group }).then(res => {
          this.$message({
            type: 'success',
            message: `${this.group.name} 添加成功`
          })
          this.routeBack(-2)
        })
      },
      logo(file) {
        this.$set(this.group, 'logo', file.id)
      },
      tag() {
        this.routePush({
          path: '/vx/group/add/tag'
        })
      },
      catalog() {
        // if (Check.isNullString(this.group.gradeId)) {
        //   this.$message({
        //     type: 'warning',
        //     message: '请先选择适用范围'
        //   })
        //   return
        // }
        this.routePush({
          path: '/vx/group/add/catalog',
          query: {
            vId: this.group.versionId
          }
        })
      },
      open(command) {
        this.$set(this.group, 'isOpen', command)
      },
      courseType(command) {
        this.$set(this.group, 'courseType', command)
      },
      onSchool(school) {
        this.school = school
        this.group.parentId = school.id
        this.group.campusId = school.campusId
      }
    },
    activated() {
      Api.getJoinSchool().then(res => {
        this.schools = res.schools
      })
      let tag = this.getStorage('_cache_tag')
      if (tag) {
        this.tagText = tag.text
        this.group = { ...this.group, ...tag, text: void 0 }
      }
      let catalogs = this.getStorage('_cache_catalog')
      if (Check.isRealArray(catalogs)) {
        this.catalogText = catalogs[0].name
        this.group = {
          ...this.group,
          categorys: catalogs
        }
      }
    }
  }
</script>
