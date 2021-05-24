module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    APP_TYPE: true,
    DDN_ENV: true,
    NODE_ENV: true,
    DdnJS: true,
    // ddn-ui
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
};
