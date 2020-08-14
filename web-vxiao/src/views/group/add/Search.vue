<template>
  <Page :title="group.name">
    <lable slot="btn"
           v-if="hasApply"
           @click="onJoin">申请加入</lable>
    <Item :hasClick="false">
      <div>封面</div>
      <div slot="remark">
        <img class="avatar big"
             v-lazy="{src:url(group.logo,'thumb'),error:Image.ICO_GROUP}"
             alt='LOGO' />
      </div>
    </Item>
    <Item :hasClick="false">
      <div>名称</div>
      <div slot="remark">{{group.name}}</div>
    </Item>
    <Item @click="showQrcode=true">
      <div>编号</div>
      <div slot="remark">
        <span>{{group.groupId}}</span>
        <i class="ico ico-qrcode" />
      </div>
    </Item>
    <Item :hasClick="false">
      <div>所属</div>
      <div slot="remark">{{group.schoolName}} {{group.campus}}</div>
    </item>
    <Item v-if="group.type==='2'"
          :hasClick="false">
      <div>入学</div>
      <div slot="remark">{{group.year}}</div>
    </Item>
    <Overlay :show.sync="showQrcode"
             width="300">
      <div class="qrcode-container">
        <img v-lazy="{src:url(group.qrcode)}" />
        <div>{{group.name}}</div>
      </div>
    </Overlay>
  </Page>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    data() {
      return {
        showQrcode: false,
        group: {}
      }
    },
    computed: {
      hasApply() {
        return this.group.type === '2' || this.group.type === '1'
      }
    },
    activated() {
      this.group = this.getStorage('_catch_search_group', true)
    },
    methods: {
      ...mapActions(['addGroupUsers']),
      onJoin() {
        if (this.group.type === '2') {
          this.routePush({
            name: 'basiceUncertifiedApply',
            query: { groupId: this.group.groupId }
          })
        }
        if (this.group.type === '1') {
          this.addGroupUsers({
            relations: {
              name: this.USER.name,
              mobile: this.USER.mobile,
              groupId: this.group.groupId,
              userType: 1,
              birthDay: this.USER.birthDay,
              sex: '1'
            }
          }).then(res => {
            this.$message({ type: 'success', message: '添加成功' })
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .qrcode-container {
    height: rem(300);
    color: #ffffff;
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
      &:nth-child(1) {
        margin-bottom: rem(5);
        font-size: rem(16);
      }
      &:nth-child(2) {
        margin-bottom: rem(15);
      }
    }
  }

  .vx-item-right {
    img {
      float: right;
    }
  }
</style>
