// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: [
    'dada',
  ],
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    // allow console during development
    'no-console': 0,

    "linebreak-style": 0
  }
}
