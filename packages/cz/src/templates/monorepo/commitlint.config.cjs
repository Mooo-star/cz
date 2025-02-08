module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    // 'scope-enum': [2, 'always', ['portal-cms', 'portal-app']],
  },
};
