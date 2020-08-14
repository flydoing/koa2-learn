<template>
  <Page title="相册">
    <div class="album">
      <el-row>
        <el-col :span="3"
                v-for="(album,i) in albums"
                :key="i">
          <div class="album-block"
               v-viewer.static>
            <img :data-source="url(album.fileId)"
                 :src="Image.IMG_EMPTY"
                 v-lazy:background-image="url(album.fileId,'thumb')"
                 :style="imageStyle(album)" />
          </div>
        </el-col>
      </el-row>
    </div>
  </Page>
</template>
<script>
  import Api from './api'
  import R from '@/views/group/mixin'
  export default {
    mixins: [R],
    data() {
      return {
        albums: [],
        hasNextPage: true,
        pageIndex: 1
      }
    },
    computed: {},
    created() {
      this.load(this.pageIndex)
    },
    methods: {
      load(pageIndex) {
        const that = this
        Api.loadAlbums(this.currentGroup.groupId, pageIndex).then(res => {
          that.albums = [...that.albums, ...res.medias]
          that.hasNextPage = res.hasNextPage
          that.currentPage = res.currentPage
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .album {
    &-block {
      cursor: pointer;
      height: rem(630/6);
      border: rem(1) solid #fff;
      position: relative;
      // @include after(0, 0) {
      //   width: 100%;
      //   height: 100%;
      //   background: rgba(225, 225, 225, 0);
      //   transition: all ease-out 0.3s;
      // }
      img {
        width: 100%;
        height: 100%;
        display: block;
      }

      &:hover {
        &:after {
          background: rgba(225, 225, 225, 0.4);
        }
      }
    }
  }
</style>
