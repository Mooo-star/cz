module.exports = {
  root: true,
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
  ignorePatterns: ['public'],
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'no-console': 2,
    'react/jsx-key': 0,
    'declaration-block-no-redundant-longhand-properties': 0,
    'no-duplicate-selectors': 0,
    'no-unused-vars': 0,
    'no-param-reassign': 'off',
    'guard-for-in': 'off',
    'react/no-children-prop': 'off',
    'no-dupe-else-if': 'error',
    // 'max-lines': ['error', 400],
    'max-depth': ['error', 4],
    'max-params': ['error', 3],
    'no-else-return': 'error',
    'no-extra-boolean-cast': 'error',
    // 'no-inline-comments': 'error',
    'no-nested-ternary': 'error',
  },
};
