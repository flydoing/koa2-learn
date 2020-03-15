# client-platform-nuxt

> My outstanding Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

登录注册：

question:
eslintrc.js配置： https://blog.csdn.net/yueliangyefan/article/details/96839405

DATE:
0314:
淘宝字体图标引入：
css主题色配置：
主题颜色，辅助颜色，深色灰色
登录注册：ui/server

组价：全局提示，文案，图标；3s自动消失，点击关闭消失

probloms记录
vue eslint记录：
https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-self-closing.md
淘宝字体引入：
https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.d8cf4382a&helptype=code

flex, flex-grow: 1;

<!-- <svg class="icon" aria-hidden="true"><use xlink:href="#icon-close"></use></svg> -->
      <a href="javascript:;" class="form-item-close">
        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-close" /></svg>
      </a>

<input
  id="input-password"
  name="password"
  type="password"
  maxlength="6"
  onpaste="return false;"
  placeholder="请输入密码"


toast组件：
简洁：https://juejin.im/post/59e95ed96fb9a0450808c6d8

element-ui源码:
https://github.com/ElemeFE/element/blob/dev/packages/message/src/main.vue
https://element.eleme.cn/#/zh-CN/component/message

其它源码：
https://github.com/FatGe/UI-Library/blob/master/src/components/toast/index.js

移动端 vue组件库：
有赞：https://youzan.github.io/vant/#/zh-CN/toast
饿了么：http://mint-ui.github.io/#!/zh-cn
个人开源：https://doc.vux.li/zh-CN/components/toast.html

nuxt.js: 服务端惭怍dom:
https://zhuanlan.zhihu.com/p/89493115

先用官方插件吧：
https://github.com/shakee93/vue-toasted#nuxt--officially-uses-vue-toasted-for-their-toast-module
https://github.com/nuxt-community/modules/tree/master/packages/toast
https://segmentfault.com/a/1190000019972611
