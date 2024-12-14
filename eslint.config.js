import antfu from '@antfu/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';

export default antfu({
  formatters: true,
  unocss: false,
  vue: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  ignores: ['public/**', 'app/components/ui/**'],
  regexp: false,
}, {
  plugins: {
    tailwind,
  },
  rules: {
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'style/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'tailwind/classnames-order': ['warn'],
    'tailwind/enforces-negative-arbitrary-values': ['warn'],
    'tailwind/enforces-shorthand': ['error'],
    'tailwind/no-contradicting-classname': ['error'],
    'tailwind/no-unnecessary-arbitrary-value': ['error'],
  },
});
