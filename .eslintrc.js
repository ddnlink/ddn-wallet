module.exports = {
  // parser: 'babel-eslint',
  parser:  '@typescript-eslint/parser',
  extends: ['airbnb', 'prettier', 'plugin:@typescript-eslint/eslint-recommended'],
  plugins: ["@typescript-eslint", "import"],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    DDN_ENV: true,
    NODE_ENV: true,
    DdnJS: true,
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.ts'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/no-extraneous-dependencies': [2, { optionalDependencies: true }],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ]
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
    // 解决错误：Using eslint with typescript - Unable to resolve path to module
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};
