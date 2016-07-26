module.exports = {
  extends: 'xo',
  env: {
    'browser': true
  },
  rules: {
    'indent': ['error', 2, {SwitchCase: 1}],
    'space-before-function-paren': ['error', 'never'],
    'curly': ['error', 'multi-line', 'consistent']
  }
};
