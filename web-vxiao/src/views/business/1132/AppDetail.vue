<template>
  <Page title="相簿" :wth="1024">
    <div class="album">
      <el-carousel :interval="4000" type="card" height="580px" :label="1111">
        <el-carousel-item v-for="(data, d) in datas" :key="d" class="box-shadow">
          <p class="album-title">
            {{data.fromUserName}}
            <span>
              {{ruleDate(data.createTime)}}
            </span>
          </p>
          <div class="album-show" :style="bgImage(data.medias[0])"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </Page>
</template>
<script>
  import Api from '@/api/message'
  import R from '@/views/group/mixin'
  import DateFormat from '@/utils/date'
  export default {
    mixins: [R],
    data() {
      return {
        datas: []
      }
    },
    created() {
      Api.getMessages({
        groupId: this.currentGroup.groupId,
        type: '1132',
        queryType: 'type'
      }).then(res => {
        this.datas = res.messages
      })
    },
    methods: {
      bgImage(image) {
        return {
          'background-image': `url(${this.$store.state.FILE_URL}/${image.fileId}?thunb)`,
          'background-repeat': 'no-repeat',
          'background-size': '100% 100%',
          'background-position': 'center'
        }
      },
      ruleDate(date) {
        return DateFormat.converFormat(new Date(date))
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import '~scss/mixin';
  .album {
    padding-top: rem(30);
    &-show {
      width: 100%;
      height: rem(600);
    }
    &-title {
      padding: rem(8);
      font-size: rem(14);
      span {
        color: #9f9f9f;
        font-size: rem(12);
      }
    }
  }

  .box-shadow {
    border: rem(2) solid #ededed;
    background-color: #fff;
    -moz-box-shadow: 0 0 rem(5) #ededed;
    box-shadow: 0 0 rem(5) #ededed;
  }

</style>
