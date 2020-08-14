<template>
  <Page :title="title"
        class="user-detail">
    <div class="_pd">
      <Avatar @success="onLogo"
              v-if="userId===r.userId || isAdmin">
        <Item label="头像">
          <div slot="remark">
            <img class="avatar big"
                 v-lazy="{src:url(r.avatar,'thumb'),error:Image.ICO_AVATAR}"
                 alt='LOGO' />
          </div>
        </Item>
      </Avatar>
      <Item v-else
            :hasClick="false"
            label="头像">
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(r.avatar,'thumb'),error:Image.ICO_AVATAR}"
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
      <Item label="昵称"
            :hasClick="isAdmin || currentGroup.isModifyNickname === 1"
            @click="modifyName">
        <div slot="remark">{{r.name || '无'}}</div>
      </Item>
      <!-- <Item label="公开手机号码"
            v-if="showSwitch">
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="onPublic"></i-switch>
        </div>
      </Item>
      <Item label="手机号码"
            v-if="showMobile"
            :hasClick="isAdmin"
            @click="modifyMobile">
        <div slot="remark">{{r.mobile}}</div>
      </Item> -->
      <Item label="二维码"
            @click="showQrcode=true">
        <div slot="remark">
          <i class="ico ico-qrcode" />
        </div>
      </Item>
      <Item label="学号"
            :hasClick="false">
        <div slot="remark">{{r.studentNo || '无'}}</div>
      </Item>
      <Item label="基本信息"
            @click="onBasice" />
      <Item label="职务"
            @click="onJob">
        <div slot="remark"
             class="ellipsis">{{jobsText}}</div>
      </Item>
      <Item label="家长"
            v-for="p in ps"
            :key="p.userId"
            @click="onParent(p)">
        <div slot="remark">{{p.name}}</div>
      </Item>
      <Item label="添加家长"
            @click="onAddParent">
        <div slot="before">
          <i class="ico ico-plus" />
        </div>
      </Item>
      <div class="category-title flex-block"></div>
      <Item label="成长档案"
            @click="onArchives" />
      <div class="category-title flex-block"></div>
      <Item label="个人分享"
            @click="onShare" />
      <div class="list-button">
        <el-button type="primary"
                   size="medium"
                   icon="el-icon-message"
                   @click="im">私信</el-button>
      </div>
      <Overlay :show.sync="showQrcode"
               background="transparent"
               width="300">
        <div class="qrcode-container">
          <div>{{r.name}}</div>
          <img v-lazy="{src:url(r.qrcode)}" />
        </div>
      </Overlay>
    </div>
  </page>
</template>
<script>
  import UserMixin from './mixin'
  import Check from '@/utils/check'
  import MetaData from '@/constant/metaData'
  import UserEnum from '@/constant/user'
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
        ps: [], // 家长
        jobs: [],
        showQrcode: false,
        working: '',
        title: '学生信息'
      }
    },
    computed: {
      jobsText() {
        let text = []
        let jobs = this.jobs
        if (Check.isRealArray(jobs)) {
          jobs.map(c => {
            text.push(c.obj)
          })
          return text.join('、')
        } else {
          return '无'
        }
      }
    },
    methods: {
      ...mapActions(['modifyRelation']),
      fetchData() {
        let that = this
        that.title = this.routeQuery('title') || '学生信息'
        if (Check.isRealArray(this.relations)) {
          this.relations.forEach(_r => {
            if (_r.userType === UserEnum.STUDENT.key) {
              that.r = _r
              that.jobs = []
              that.ps = []
              if (Check.isRealArray(that.r.metaDatas)) {
                that.r.metaDatas.forEach(meta => {
                  if (meta.metaType === MetaData.JOB) {
                    that.jobs.push(meta)
                  } else if (meta.metaType === 'm_student_no') {
                    that.$set(that.r, 'studentNo', meta.obj)
                  }
                })
              }
            } else if (_r.userType === UserEnum.PARENT.key || _r.userType === UserEnum.TEACHER.key) {
              that.ps.push(_r)
            }
          })
        }
      },
      onBasice() {
        this.routePush({
          path: '/vx/group/user/student/basice',
          query: { userId: this.r.userId }
        })
      },
      onJob() {
        this.setStorage('_cache_group_user_jobs', this.jobs)
        this.routePush({
          path: '/vx/group/user/jobs',
          query: {
            relationId: this.r.id,
            userId: this.r.userId,
            isStudent: true
          }
        })
      },
      onArchives() {
        this.$message({ type: 'warning', message: '开发中...' })
      },
      onParent(u) {
        this.routePush({
          name: 'userDetail',
          params: { userId: u.userId },
          query: {
            title: u.name
          }
        })
      },
      onAddParent() {
        this.setStorage('_cache_student', this.r)
        this.routePush({
          path: '/vx/group/user/add/parent',
          params: { userId: this.r.userId }
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
  .qrcode-container {
    height: rem(300);
    color: #fff;
    @include bc;
    border-radius: rem(10);
    @include ct;
    @include fd;
    img {
      width: rem(200);
      height: rem(200);
      padding: rem(5);
      background: #fff;
      border-radius: rem(10);
    }
    div {
      &:first-child {
        margin-bottom: rem(10);
        font-size: rem(16);
      }
    }
  }
</style>
