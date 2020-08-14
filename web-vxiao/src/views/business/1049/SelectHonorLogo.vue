<template>
  <page title="选择图标"
        :hasClose="false">
    <MedalWall :list="list"
               :medalClick="handle">
      <el-upload :action="uploadURL"
                 :show-file-list="false"
                 :on-success="uploadSuccess"
                 :before-upload="beforeUpload">
        <div class="md-btn-add"
             v-lazy:background-image="addIcon"
             :style="imageStyle(addIcon)"></div>
      </el-upload>
    </MedalWall>
  </page>
</template>
<script>
  import R from '@/views/group/mixin'
  import Api from './api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [R],
    props: {},
    data() {
      return {
        list: [],
        addIcon: require('images/ico/ico_medal_add.png')
      }
    },
    created() {
      const that = this
      Api.loadHonorLogoData(that.currentGroup.groupId).then(res => {
        that.list = res.metas.map(m => {
          if (that.rating.honor.logo === m.obj) {
            m.active = true
          } else {
            m.active = false
          }
          m.logo = m.obj
          return m
        })
      })
    },
    components: {
      MedalWall: resolve => require(['@/views/components/medal/MedalWall'], resolve)
    },
    computed: {
      ...mapGetters({
        rating: 'getRating'
      })
    },
    methods: {
      ...mapActions(['setRating']),
      handle(medal, index) {
        this.setRating({ honor: { ...this.rating.honor, logo: medal.logo } })
        this.routeBack()
      },
      uploadSuccess(res, file, fileLlist) {
        Api.saveHonorLogo({
          obj: res.file.id,
          extension: this.currentGroup.groupId
        }).then(res => {
          this.list.push({ ...res.metas[0], logo: res.metas[0].obj })
          this.$message({ message: '操作成功', type: 'success' })
        })
      },
      beforeUpload(file) {
        let isImage = (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png')
        let limit1M = file.size / 1024 / 1024 < 1
        if (!limit1M) {
          this.$message({ message: '上传图标大小不能超过 1MB', type: 'warning' })
          return false
        }
        if (!isImage) {
          this.$message({ message: '文件格式不正确', type: 'warning' })
          return false
        }
      }
    }
  }

</script>
<style lang="scss" scoped>
  @import "~scss/_mixin";
  .md-btn-add {
    padding-top: 0;
    border: rem(1) solid #ddd;
    height: rem(80);
    width: rem(80);
    float: left;
    margin: 0 0 14px 14px;
    cursor: pointer;
    border-radius: rem(8);
    position: relative;
  }
</style>
