<template>
  <div class="file-list"
       v-if="files.length>0">
    <a @click="handleLink(file)"
       class="file-block f12 has-click"
       v-for="(file,i) in files"
       target="_blank"
       :key="i">
      <div class="logo"><img :src="fileLogo(file)"
             alt='头像'></div>
      <div class="title">
        <div>{{file.fileName}}</div>
        <div>{{file.sizeText}}</div>
      </div>
      <div class="remark"
           v-if="file.downLoadCount">下载&nbsp;{{file.downLoadCount}}</div>
    </a>
  </div>
</template>
<script>
  import ArrayUtils from '@/utils/array'
  import GroupApi from '@/api/group'
  export default {
    props: {
      files: {
        type: [Array],
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        OtherPNG: `/static/f/icon_query@2x.png`
      }
    },
    computed: {},
    methods: {
      fileLogo(file) {
        if (
          !ArrayUtils.contains(
            ['3gp', 'aac', 'amr', 'apk', 'avi', 'doc', 'docx', 'gif', 'jpg', 'link', 'mov', 'mp3', 'mp4', 'pdf', 'png', 'ppt', 'rar', 'rtf', 'test', 'txt', 'xlsx', 'zip'],
            file.extension
          )
        ) {
          return this.OtherPNG
        }
        return `/static/f/icon_${file.extension}@2x.png`
      },
      handleLink(file) {
        GroupApi.addDownloadCount({
          fileId: file.fileId
        }).then(res => {
          window.open(file.href)
        })
      }
    }
  }
</script>
