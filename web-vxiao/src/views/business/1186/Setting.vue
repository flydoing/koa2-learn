<template>
  <page title="应用设置">
    <item @click="autoPushHandle">
      <div slot="main">诵读推送</div>
    </item>
    <item v-if="isSchool"
          @click="AllowSetScoreHandle()">
      <div slot="main">允许小组长评分</div>
      <div slot="after">
        <i-switch :value="allowSetScore"
                  @click="AllowSetScoreHandle()"></i-switch>
      </div>
    </item>
    <div class="category-title"
         v-if="isSchool">评价方式</div>
    <template v-if="isSchool">
      <item v-for="(scoreWay, i) in defaultScoreWay"
            :key="i"
            @click="selectWayHandle(scoreWay, curScoreType)">
        <div slot="before">
          <i :class="prefixType(scoreWay)"></i>
        </div>
        <div slot="main">{{scoreWay.name}}</div>
        <div slot="remark"
             @click.stop="editSetHandle(scoreWay)"
             :class="{'w100':scoreWay.value==='1'}"
             v-if="scoreWay.groupId"></div>
        <span slot="after"
              v-if="!scoreWay.value || scoreWay.value==='0' || !scoreWay.groupId"></span>
      </item>
    </template>
    <item @click="addScoreWay"
          v-if="isSchool">
      <div slot="before">
        <i class="ico ico-plus" />
      </div>
      <div slot="main">增加</div>
    </item>
  </page>
</template>
<script>
  import Api from './api'
  export default {
    data() {
      return {
        allowSetScore: false,
        defaultScoreWay: [],
        curScoreType: null,
        curStrudeScoreStatus: null,
        isSchool: this.routeQuery('isSchool')
      }
    },
    created() {
      if (this.routeQuery('token')) {
        this.$http.defaults.headers.common['tokenId'] = this.routeQuery('token')
      }
      if (this.routeQuery('clientId')) {
        this.$http.defaults.headers.common['ClientId'] = this.routeQuery('clientId')
      }
      Api.getDefaultSettings(this.routeQuery('groupId'), this.routeQuery('appType')).then(res => {
        if (res && res.code === '1') {
          this.defaultScoreWay = res.categories
          res.metaDatas &&
            res.metaDatas.forEach(mate => {
              if (mate.metaType === 'm_recite_score_type') {
                this.curScoreType = mate
              } else if (mate.metaType === 'm_recite_allow_student_score') {
                this.curStrudeScoreStatus = mate
                mate.obj === '1' ? (this.allowSetScore = true) : (this.allowSetScore = false)
              }
            })
        }
      })
    },
    methods: {
      prefixType(scoreWay) {
        let isSelect = this.curScoreType ? this.curScoreType.obj === scoreWay.id.toString() : false
        return [
          `ico`,
          `ico-select`,
          {
            [`active`]: isSelect
          }
        ]
      },
      selectWayHandle(categoryObj, curScoreeMeta) {
        Api.modifySettings({
          metaDatas: [
            {
              id: curScoreeMeta ? curScoreeMeta.id : void 0,
              obj: categoryObj.id,
              key: categoryObj.value,
              metaType: 'm_recite_score_type',
              userId: this.routeQuery('schoolId')
            }
          ]
        }).then(res => {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          if (res.code === '1') {
            this.curScoreType = res.metaDatas[0]
          }
        })
      },
      editSetHandle(obj) {
        if (obj.value && obj.value === '1') {
          this.routePush({
            name: 'chantAddSetting',
            query: {
              parentId: obj.id,
              groupId: this.routeQuery('groupId'),
              appType: this.routeQuery('appType')
            }
          })
        }
      },
      AllowSetScoreHandle() {
        this.allowSetScore = !this.allowSetScore
        Api.modifySettings({
          metaDatas: [
            {
              id: this.curStrudeScoreStatus ? this.curStrudeScoreStatus.id : void 0,
              obj: this.allowSetScore ? '1' : '0',
              metaType: 'm_recite_allow_student_score',
              status: '1',
              userId: this.routeQuery('schoolId')
            }
          ]
        }).then(res => {
          if (res.code === '1') {
            this.curStrudeScoreStatus = res.metaDatas[0]
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      },
      addScoreWay() {
        this.routePush({
          name: 'chantAddSetting',
          query: {
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType')
          }
        })
      },
      autoPushHandle() {
        this.routePush({
          name: 'chantAutoPush',
          query: {
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType'),
            token: this.routeQuery('token'),
            clientId: this.routeQuery('clientId'),
            isSchool: this.routeQuery('isSchool')
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  @import '~scss/mixin';
  .w100 {
    display: block;
    width: rem(100);
    height: rem(35);
  }
</style>
