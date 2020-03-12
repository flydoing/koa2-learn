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
  rules: {
    'nuxt/singleline-html-element-content-newline': 'off',
    'nuxt/multiline-html-element-content-newline': 'off'
  }
}
