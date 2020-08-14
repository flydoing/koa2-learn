<template>
  <div class="links"
       v-if="links.length>0">
    <a href="javascirpt:void(0)"
       class="link-block f12 has-click"
       v-for="(link,i) in links"
       :key="i"
       @click.self="open(link.fileId)">
      <div class="logo">
        <img src="/static/f/icon_link@2x.png"
             alt='头像'>
      </div>
      <div class="title">{{link.fileName}}</div>
      <div class="delete-box"
           @click.stop="deleteLink(i)"
           v-if="hasDelete">
        <i class="ico ico-delete"></i>
      </div>
    </a>
  </div>
</template>
<script>
  export default {
    props: {
      links: {
        type: Array,
        default() {
          return []
        }
      },
      hasDelete: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      deleteLink(i) {
        this.$emit('deleteLink', i)
      },
      open(link) {
        this.openBrowser(link)
      }
    }
  }
</script>
<style lang="scss">
  .links {
    padding-top: nth($padding, 1);

    .link-block {
      position: relative;
      display: block;
      overflow: hidden;
      line-height: rem(45);
      background: nth($background, 9);
      margin-bottom: nth($padding, 1);

      &:hover {
        &:after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(225, 225, 225, 0.3);
        }
      }

      div {
        float: left;
      }

      .logo {
        img {
          display: block;
          width: rem(45);
          height: rem(45);
        }
      }

      .title {
        width: 70%;
        padding-left: nth($padding, 3);
      }

      .delete-box {
        position: absolute;
        right: rem(10);
        top: rem(0);
        z-index: 200;
      }
    }
  }
</style>
