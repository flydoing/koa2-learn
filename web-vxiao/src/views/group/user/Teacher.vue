<template>
  <Page :title="title"
        class="user-detail">
    <div slot="btn">
      <label v-if="isAdmin && r.userType === '2'"
             @click="onHeadmaser"
             v-html="headmasterTxt"></label>
    </div>
    <Avatar @success="onLogo"
            v-if="userId===r.userId || isAdmin">
      <Item>
        <div>头像</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(r.avatar,'thumb'),error:Image.ICO_USER}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item v-else
          :hasClick="false">
      <div>头像</div>
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(r.avatar,'thumb'),error:Image.ICO_USER}"
             alt='LOGO' />
      </div>
    </Item>
    <Avatar @success="onFace"
            v-if="userId===r.userId || isAdmin">
      <Item>
        <div>人脸</div>
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(r.face,'thumb'),error:Image.ICO_USER}"
               alt='LOGO' />
        </div>
      </Item>
    </Avatar>
    <Item v-else
          :hasClick="false">
      <div>人脸</div>
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(r.face,'thumb'),error:Image.ICO_USER}"
             alt='LOGO' />
      </div>
    </Item>
    <Item :hasClick="isAdmin || currentGroup.isModifyNickname === 1"
          @click="modifyName">
      <div>昵称</div>
      <div slot="remark">{{r.name}}</div>
    </Item>
    <Item v-if="showSwitch">
      <div>公开手机号码</div>
      <div slot="after">
        <i-switch :value="isSwitched"
                  @click="onPublic"></i-switch>
      </div>
    </Item>
    <item v-if="showMobile"
          :hasClick="isAdmin || isSelf"
          @click="modifyMobile">
      <div>手机号码</div>
      <div slot="remark">{{r.mobile}}</div>
    </Item>
    <Item @click="showQrcode=true">
      <div>二维码</div>
      <div slot="remark">
        <i class="ico ico-qrcode" />
      </div>
    </Item>
    <Item :hasClick="false">
      <div>人员状态</div>
      <div slot="remark">{{working}}</div>
    </Item>
    <item v-if="isClass || isCourse"
          @click="onSubject">
      <div>任教科目</div>
      <div slot="remark"
           class="ellipsis">{{courseText}}</div>
    </Item>
    <Item @click="onJob">
      <div>职位</div>
      <div slot="remark"
           class="ellipsis">{{jobsText}}</div>
    </Item>
    <div class="category-title flex-block"></div>
    <item v-if="isClass"
          @click="handleTeacherInfo">
      <div>教师发展档案</div>
    </Item>
    <Item label="个人分享"
          @click="onShare" />
    <div class="list-button">
      <el-button type="primary"
                 size="medium"
                 icon="el-icon-message"
                 @click="im">私信</el-button>
    </div>
    <Overlay :show.sync="showQrcode"
             width="300">
      <div class="qrcode-container">
        <img v-lazy="{src:url(r.qrcode)}" />
      </div>
    </Overlay>
  </page>
</template>
<script>
  import UserMixin from './mixin'
  import Api from '@/api/group'
  import Check from '@/utils/check'
  import MetaData from '@/constant/metaData'
  import { mapActions } from 'vuex'
  import R from '@/views/group/mixin'
  export default {
    mixins: [UserMixin, R],
    props: {
      relations: { type: Array }
    },
    components: {
      Avatar: resolve => require(['@/views/components/Avatar'], resolve)
    },
    data() {
      return {
        jobs: [],
        teachCourse: [],
        showQrcode: false,
        working: '',
        title: '个人信息'
      }
    },
    computed: {
      headmasterTxt() {
        let user = this.r || {}
        return user.isHeadteacher === '1' ? '取消班主任设置' : '班主任设置'
      },
      jobsText() {
        let text = []
        let jobs = this.jobs
        jobs.map(c => {
          text.push(c.obj)
        })
        return text.join('、')
      },
      courseText() {
        let text = []
        let courses = this.teachCourse
        courses.map(c => {
          text.push(c.obj)
        })
        return text.join('、')
      }
    },
    methods: {
      ...mapActions(['modifyRelation']),
      fetchData() {
        this.title = this.routeQuery('title') || '个人信息'
        if (Check.isRealArray(this.relations)) {
          this.r = this.relations[0]
          if (this.r.userState) {
            this.working = this.r.userState.state || ''
          }
          if (Check.isRealArray(this.r.metaDatas)) {
            this.r.metaDatas.forEach(meta => {
              if (meta.metaType === MetaData.JOB) {
                this.jobs.push(meta)
              } else if (meta.metaType === MetaData.TEACH_COURSE) {
                this.teachCourse.push(meta)
              }
            })
          }
        }
      },
      onHeadmaser() {
        Api.addGroupRelation({
          relations: [
            {
              id: this.r.id,
              userId: this.r.userId,
              groupId: this.r.groupId,
              isHeadteacher: this.r.isHeadteacher === '1' ? 'd' : '1'
            }
          ]
        }).then(res => {
          res.relations.forEach(relation => {
            this.modifyRelation(relation)
            this.r = { ...this.r, ...relation }
          })
          this.$message({ type: 'success', message: '操作成功' })
        })
      },
      onSubject() {
        this.setStorage('_cache_group_user_subjects', this.teachCourse)
        this.routePushModel({
          path: '/vx/group/user/teachSubject',
          query: {
            relationId: this.r.id,
            userId: this.r.userId
          }
        })
      },
      onJob() {
        this.setStorage('_cache_group_user_jobs', this.jobs)
        this.routePushModel({
          path: '/vx/group/user/jobs',
          query: {
            relationId: this.r.id,
            userId: this.r.userId
          }
        })
      },
      handleTeacherInfo() {
        this.routePush({
          name: 'index1179',
          query: {
            userId: this.r.userId,
            userName: this.r.name
          }
        })
      }
    },
    mounted() {
      this.fetchData()
    },
    watch: {
      relations(v) {
        this.fetchData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-button--primary {
    @include bc;
  }
  .qrcode-container {
    height: rem(300);
    border-radius: rem(4);
    color: #ffffff;
    @include bc;
    @include ct;
    @include fd;

    img {
      width: rem(250);
      height: rem(250);
    }
  }
</style>
