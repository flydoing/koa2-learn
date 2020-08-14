<template>
  <Page title="家长信息">
    <div class="_pd">
      <Avatar @success="onLogo"
              v-if="userId===r.userId || isAdmin">
        <Item label="头像">
          <div slot="remark">
            <img class="avatar big"
                 v-lazy="{src:url(r.avatar,'thumb'),error:Image.ICO_USER}"
                 alt='LOGO' />
          </div>
        </Item>
      </Avatar>
      <Item label="头像"
            v-else
            :hasClick="false">
        <div slot="remark">
          <img class="avatar big"
               v-lazy="{src:url(r.avatar,'thumb'),error:Image.ICO_USER}"
               alt='LOGO' />
        </div>
      </Item>
      <Item label="昵称"
            :remark="r.name"
            :hasClick="isAdmin || currentGroup.isModifyNickname === 1"
            @click="modifyName" />
      <Item label="公开手机号码"
            v-if="showSwitch">
        <div slot="after">
          <i-switch :value="isSwitched"
                    @click="onPublic"></i-switch>
        </div>
      </Item>
      <Item v-if="showMobile"
            label="手机号码"
            :remark="r.mobile"
            :hasClick="isAdmin  || isSelf"
            @click="modifyMobile" />
      <Item v-for="student in students"
            label="学生"
            :remark="student.name"
            :key="student.userId"
            @click="onParent" />
      <div class="category-title flex-block"></div>
      <Item label="个人分享"
            @click="onShare" />
      <div class="button button-common"
           @click="im">私信</div>
    </div>
  </page>
</template>
<script>
  import UserMixin from './mixin'
  import Check from '@/utils/check'
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
        students: []
      }
    },
    computed: {},
    methods: {
      ...mapActions(['modifyRelation']),
      fetchData() {
        let that = this
        that.students = []
        if (Check.isRealArray(that.relations)) {
          that.relations.forEach(_r => {
            if (_r.userType === UserEnum.PARENT.key) {
              that.r = that.relations[0]
              that.jobs = []
            } else if (_r.userType === UserEnum.STUDENT.key) {
              that.students.push(_r)
            }
          })
        }
      },
      onParent(u) {
        this.routeBack()
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
