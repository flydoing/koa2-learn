<template>
  <page title="应用设置">
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
             class="ellipsis"
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
        <i class="ico ico-plus"></i>
      </div>
      <div slot="main">增加</div>
    </item>
  </page>
</template>
<script>
  import Api from '@/views/business/1186/api'
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
              if (mate.metaType === 'm_homework_score_type') {
                this.curScoreType = mate
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
              id: curScoreeMeta.id,
              obj: categoryObj.id,
              key: categoryObj.value,
              metaType: 'm_homework_score_type',
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
      addScoreWay() {
        this.routePush({
          name: 'chantAddSetting',
          query: {
            groupId: this.routeQuery('groupId'),
            appType: this.routeQuery('appType')
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
