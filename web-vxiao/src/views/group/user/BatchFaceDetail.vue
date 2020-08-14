<template>
  <Page title="导入人脸">
    <div class="category-title text">{{detail.content}}</div>
    <div class="u-avatar">
      <div class="block"
           v-for="u in detects"
           :key="u.userId">
        <div class="avatar">
          <img class="avatar"
               v-lazy="{src:url(u.face),error:Image.ICO_USER}" />
        </div>
        <div class="name">{{u.name}}</div>
        <div class="progress"
             :style="prefixStyle(u)"></div>
      </div>
    </div>
  </Page>
</template>

<script>
  export default {
    data() {
      return { detail: {}, detects: [] }
    },
    created() {
      this.detail = this.getStorage('_cache_batch_face')
      let msgJson = JSON.parse(this.detail.msgJson)
      this.detects = [...msgJson.errUserFaceList, ...msgJson.userFaceDetectList]
    }
  }
</script>