export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: [
        'default',
        {
          discardComments: { removeAll: true },
          zindex: false,
          mergeIdents: false,
          reduceIdents: false,
          discardUnused: true,
          discardDuplicates: true,
          discardEmpty: true,
          minifySelectors: false,
          colormin: false,
        },
      ],
    },
  },
}
