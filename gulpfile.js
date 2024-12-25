let gulp = require('gulp')
let boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp)

boilerplate({
  build: 'appium-wechat-driver',
  coverage: {
    files: ['./test/unit/**/*-specs.js', '!./test/functional/**'],
    verbose: true,
  },
  babelOpts: {
    plugins: [
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ],
  },
})
