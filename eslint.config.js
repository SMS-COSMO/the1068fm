import antfu from '@antfu/eslint-config';

export default antfu({
  formatters: true,
  unocss: false,
  vue: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  ignores: ['public/**'],
}, {
  rules: {
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
  },
});
