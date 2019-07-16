<template>
  <div class="vx-pages-index">
    <!-- <ul id="menu">
      <li data-menuanchor="page1" class="active">
        <a href="#page1">Section 1</a>
      </li>
      <li data-menuanchor="page2" class="">
        <a href="#page2">Section 2</a>
      </li>
      <li data-menuanchor="page3" class="">
        <a href="#page3">Section 3</a>
      </li>
    </ul> -->
    <div class="vx-header">
      <div class="header">
        <div class="header-logo">
          V校 让学校更智慧
        </div>
        <div id="header-menu" class="header-menu">
          <a href="#page1">平台</a>
          <a href="#page2">应用软件</a>
          <a href="#page3">只能硬件</a>
        </div>
      </div>
    </div>
    <no-ssr>
      <full-page id="fullpage" :options="options">
        <div class="section">
          <h3>Section 1</h3>
        </div>
        <div class="section">
          <div class="slide">
            <h3>Slide 2.1</h3>
          </div>
          <div class="slide">
            <h3>Slide 2.2</h3>
          </div>
          <div class="slide">
            <h3>Slide 2.3</h3>
          </div>
        </div>
        <div class="section">
          <h3>Section 3</h3>
        </div>
      </full-page>
    </no-ssr>
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'
// import Vue from 'vue'
// import VueFullPage from 'vue-fullpage.js'
// if (process.browser) {
//   window.VueFullpage = VueFullPage
//   Vue.use(VueFullPage)
// }
// Vue.use(VueFullPage)

export default {
  data() {
    return {
      options: {
        licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
        menu: '#header-menu',
        scrollBar: false,
        navigation: true,
        controlArrows: true,
        slidesNavigation: true,
        anchors: ['page1', 'page2', 'page3'],
        sectionsColor: [
          '#41b883',
          '#ff5f45',
          '#0798ec',
          '#fec401',
          '#1bcee6',
          '#ee1a59',
          '#2c3e4f',
          '#ba5be9',
          '#b4b8ab'
        ]
      }
    }
  }
  // components: {
  //   Logo
  // }
}
</script>

<style lang="scss">
.vx-pages-index {
  background: yellowgreen;
  #menu {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 70;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    letter-spacing: 1px;
    font-size: 1.1em;
  }
  #menu li {
    display: inline-block;
    margin: 10px 0;
    position: relative;
  }
  #menu a {
    color: #fff;
    padding: 0 1.1em 1.1em 1.1em;
  }
  #menu .active a:after {
    content: '';
    margin: 0 1.1em 0 1.1em;
    height: 2px;
    background: #fff;
    display: block;
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    display: block;
  }
}
.vx-header {
  position: fixed;
  z-index: 10;
  top: 0;
  width: 100%;
  height: 80px;
  margin: 0 auto;
  background: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  .header {
    width: 1180px;
    background: yellow;
  }
}
</style>
