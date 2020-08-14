<template>
  <Page :title="category.name">
    <label slot="btn"
           @click="newCustom">新增自定义应用</label>
    <el-row>
      <el-col :span="6">
        <div class="vs-block"
             @click="templet">
          <div><i class="ico ico-vs-templet"></i></div>
          <div>模板设置</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block"
             @click="pattern">
          <div><i class="ico ico-vs-templet"></i></div>
          <div>模式管理</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block"
             @click="bright">
          <div><i class="ico ico-vs-time"></i></div>
          <div>亮屏时间</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block"
             @click="close">
          <div><i class="ico ico-vs-close"></i></div>
          <div>定期关机</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block">
          <div>
            <i-switch @click="voice"
                      :value="vscreenSets.voiceBroadcast"
                      trueValue="1"
                      falseValue="0"></i-switch>
          </div>
          <div>语音播报</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block">
          <div>
            <i-switch @click="kq"
                      :value="vscreenSets.attendanceTakePhoto"
                      trueValue="1"
                      falseValue="0"></i-switch>
          </div>
          <div>考勤抓拍</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block">
          <div>
            <i-switch @click="face"
                      :value="vscreenSets.faceDetectState"
                      trueValue="1"
                      falseValue="0"></i-switch>
          </div>
          <div>人脸识别</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block"
             @click="appSort">
          <div><i class="ico ico-vs-sort"></i></div>
          <div>应用排序</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="vs-block">
          <i-switch @click="enter"
                    :value="vscreenSets.attendanceEnterSchool"
                    trueValue="1"
                    falseValue="0"></i-switch>
          <div>进校考勤</div>
        </div>
      </el-col>
    </el-row>
    <div class="category-title"></div>
    <Item v-for="(app,i) in schoolScreenApps"
          :key="app.type"
          @click="handleApp(app,i)">
      <div slot="before"
           v-if="app.appType !== '9019'"
           @click.stop="handleAppSelect(app,i)">
        <i class="ico ico-select"
           :class="{'active':!!app.id & app.status==='1'}"></i>
      </div>
      <div>{{app.appName}}</div>
      <div slot="remark">{{app | filterAppReamrk}}</div>
    </Item>
  </Page>
</template>
<script>
  import Api from '../api'
  import Check from '@/utils/check'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        category: {},
        schoolTemplet: {},
        periods: [],
        schoolScreenApps: [],
        vscreenSets: {}
      }
    },
    created() {
      this.category = this.$route.query
      Api.getScreenManager(this.currentGroup.parentId, this.category.id).then(res => {
        this.periods = res.defaultPeriods
        this.schoolScreenApps = res.schoolScreenApps
        this.schoolTemplet = res.schoolTemplet || { schoolId: this.currentGroup.parentId, categoryId: this.category.id }
        this.vscreenSets = res.vscreenSets || { groupId: this.groupId, categoryId: this.category.id }
      })
    },
    methods: {
      handleApp(app, i) {
        this.setStorage('_cache_app', app)
        this.setStorage('_cache_periods', this.periods)
        this.routePush({
          path: '/vx/group/business/1246/setup/app',
          query: {
            schoolId: this.currentGroup.parentId
          }
        })
      },
      handleAppSelect(app, i) {
        Api.modifyScreenApp({
          schoolScreenApps: [
            {
              ...app,
              ...{
                id: app.status === '1' ? app.id : void 0,
                status: app.hasOwnProperty('id') && app.status === '1' ? 'd' : '1'
              }
            }
          ]
        }).then(res => {
          if (Check.isRealArray(res.schoolScreenApps)) {
            res.schoolScreenApps.forEach(a => {
              this.$set(this.schoolScreenApps, i, a)
            })
            this.$message({ type: 'success', message: '修改成功' })
          }
        })
      },
      templet() {
        this.setStorage('_cache_templets', this.schoolTemplet)
        this.routePush({
          path: '/vx/group/business/1246/setup/templet',
          query: { id: this.category.id }
        })
      },
      pattern() {
        this.routePush({
          path: '/vx/group/business/1246/setup/pattern',
          query: {
            categoryId: this.category.id,
            schoolId: this.currentGroup.parentId
          }
        })
      },
      bright() {
        this.setStorage('_cache_periods', this.periods)
        this.setStorage('_cache_sets', this.vscreenSets)
        this.routePush({
          path: '/vx/group/business/1246/setup/bright',
          query: { id: this.category.id }
        })
      },
      close() {
        this.setStorage('_cache_periods', this.periods)
        this.setStorage('_cache_sets', this.vscreenSets)
        this.routePush({
          path: '/vx/group/business/1246/setup/close',
          query: { id: this.category.id }
        })
      },
      modify() {
        Api.modifyScreenSet({
          vscreenSets: this.vscreenSets
        })
          .then(res => {
            this.$message({ type: 'success', message: '修改成功' })
          })
          .catch(res => {})
      },
      voice() {
        this.$set(this.vscreenSets, 'voiceBroadcast', this.vscreenSets.voiceBroadcast === '1' ? '0' : '1')
        this.modify()
      },
      kq() {
        this.$set(this.vscreenSets, 'attendanceTakePhoto', this.vscreenSets.attendanceTakePhoto === '1' ? '0' : '1')
        this.modify()
      },
      enter() {
        this.$set(this.vscreenSets, 'attendanceEnterSchool', this.vscreenSets.attendanceEnterSchool === '1' ? '0' : '1')
        this.modify()
      },
      face() {
        this.$set(this.vscreenSets, 'faceDetectState', this.vscreenSets.faceDetectState === '1' ? '0' : '1')
        this.modify()
      },
      appSort() {
        if (Check.isRealArray(this.schoolScreenApps)) {
          this.setStorage('_cache_apps', this.schoolScreenApps)
          this.routePush({
            path: '/vx/group/business/1246/setup/sort',
            query: { id: this.category.id }
          })
        } else {
          this.$messaeg({ type: 'warnging', message: '暂无应用' })
        }
      },
      newCustom() {
        this.routePush({
          path: '/vx/group/business/1246/setup/custom',
          query: {
            id: this.category.id,
            schoolId: this.currentGroup.parentId
          }
        })
      }
    },
    filters: {
      filterAppReamrk(app) {
        let txt = '播放'
        if (app.frame && app.frame > 0) {
          txt = `${app.frame}帧`
        }
        if (app.description) {
          txt = `${txt}、${app.description}`
        }
        return txt
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vs {
    &-box {
      @include flex;
      @include jc(flex-start);
      @include ai(flex-start);
      @include wrap;
    }

    &-block {
      .ico {
        font-size: rem(26);

        &.active {
          @include fc;
        }
      }

      @include ct;
      @include fd;
      width: 100%;
      height: rem(80);
      cursor: pointer;

      &:hover {
        background: nth($background, 2);
      }

      & > div {
        &:last-child {
          line-height: rem(25);
        }
      }
    }
  }
</style>
