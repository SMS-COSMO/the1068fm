import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  ignores: ['components/ui/**', '.github/**/*'],
}, {
  rules: {
    'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'node/prefer-global/process': 'off',
  },
});
