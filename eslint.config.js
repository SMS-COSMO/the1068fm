import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
}, {
  rules: {
    'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'n/prefer-global/process': ['never'],
  },
  ignores: ['components/ui/**', '.github/**/*'],
});
