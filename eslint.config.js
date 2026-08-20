'use strict';

module.exports = require('eslint-config-sukka').sukka({
  react: false
}, {
  files: ['./test/**/*'],
  rules: {
    'vibe-proof/prefer-hoisted-regex': 'off'
  }
});
