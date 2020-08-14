<template>
  <page :title="titleText">
    <item v-for="(grade, i) in defaultGrade"
          :key="i">
      <div slot="main">分值{{defaultGrade.length - i}}</div>
      <div slot="remark">
        <div v-if="i === defaultGrade.length-1"
             class="default-grade">{{grade.name}}</div>
        <input v-else
               type="text"
               v-model="grade.name"
               class="level-input"
               placeholder="输入内容">
      </div>
      <span slot="after"></span>
    </item>
    <div v-if="!isEdit"
         class="list-button">
      <div class="button"
           @click="addCommit">添加</div>
    </div>
    <div v-else
         class="list-button">
      <div class="button"
           @click="editCommit">确定</div>
      <div class="button error"
           @click="handleRemove">删除</div>
    </div>
  </page>
</template>
<script>
  import Api from './api'
  import Categrory from '@/constant/category'
  import Check from '@/utils/check'
  export default {
    data() {
      return {
        isEdit: this.routeQuery('parentId'),
        defaultGrade: [
          {
            name: ''
          },
          {
            name: ''
          },
          {
            name: ''
          },
          {
            name: ''
          },
          {
            name: this.routeQuery('appType') === '1186' ? '未读' : '缺交'
          }
        ],
        titleText: ''
      }
    },
    created() {
      this.titleText = this.isEdit ? '编辑' : '增加'
      if (this.routeQuery('parentId')) {
        Api.getCetagoryChildren(Categrory.SCORESHOW_CHILD, this.routeQuery('parentId'), 0).then(res => {
          if (res && res.code === '1') {
            this.defaultGrade = res.categorys
            this.defaultGrade.length < 5 &&
              this.defaultGrade.push({
                name: this.routeQuery('appType') === '1186' ? '未读' : '缺交'
              })
          }
        })
      }
    },
    methods: {
      addCommit() {
        let keyStr = ''
        this.defaultGrade.forEach((grade, i) => {
          grade.value = 100 - i * 25
          grade.type = 34
          grade.groupId = this.routeQuery('groupId')
        })
        this.defaultGrade.some((grade, i) => {
          if (Check.isNullString(grade.name)) {
            keyStr = '分值' + (this.defaultGrade.length - i)
          }
          return Check.isNullString(grade.name)
        })
        if (!Check.isNullString(keyStr)) {
          this.$message({
            tyep: 'warning',
            message: keyStr + '不能为空'
          })
          return false
        }
        Api.modifySettings({
          category: {
            type: this.routeQuery('appType') === '1186' ? '171' : '33',
            groupId: this.routeQuery('groupId'),
            value: '1',
            childs: this.defaultGrade
          }
        }).then(res => {
          if (res && res.code === '1') {
            this.routeBack()
          }
        })
      },
      handleRemove() {
        Api.modifySettings({
          category: {
            id: this.routeQuery('parentId'),
            status: 'd'
          }
        }).then(res => {
          if (res && res.code === '1') {
            this.routeBack()
          }
        })
      },
      editCommit() {
        let keyStr = ''
        this.defaultGrade.forEach((grade, i) => {
          grade.value = 100 - i * 25
          grade.type = 34
          grade.groupId = this.routeQuery('groupId')
        })
        this.defaultGrade.some((grade, i) => {
          if (Check.isNullString(grade.name)) {
            keyStr = '分值' + (this.defaultGrade.length - i)
          }
          return Check.isNullString(grade.name)
        })
        if (!Check.isNullString(keyStr)) {
          this.$message({
            tyep: 'warning',
            message: keyStr + '不能为空'
          })
          return false
        }
        Api.modifySettings({
          category: {
            id: this.routeQuery('parentId'),
            type: this.routeQuery('appType') === '1186' ? '171' : '33',
            groupId: this.routeQuery('groupId'),
            value: '1',
            childs: this.defaultGrade
          }
        }).then(res => {
          if (res && res.code === '1') {
            this.routeBack()
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .default-grade {
    padding-right: rem(8);
    color: #444;
  }
  .level-input {
    text-align: right !important;
  }
</style>
