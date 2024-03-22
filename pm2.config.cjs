module.exports = {
  name: 'the1068fm', // Name of your application
  script: './.output/server/index.mjs', // Entry point of your application
  interpreter: 'bun', // Path to the Bun interpreter
  env_production: {
    NODE_ENV: 'production',
    ROARR_LOG: true,
  },
};
