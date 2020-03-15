module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
    // 'eslint:recommended'
  ],
  // extends: [
  //   'prettier',
  //   'prettier/vue',
  //   '@nuxtjs',
  //   'plugin:nuxt/recommended',
  //   'plugin:vue/essential',
  //   'eslint:recommended'
  // ],
  // add your custom rules here
  // https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-self-closing.md
  rules: {
    // "vue/html-self-closing": ["error",{
    //   "html": {
    //     "void": "never",
    //     "normal": "any",
    //     "component": "any"
    //   },
    //   "svg": "always",
    //   "math": "always"
    // }]
  }
}
