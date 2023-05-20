module.exports = {
  presets: [['@babel/preset-env', { modules: true }]],
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  },
};
