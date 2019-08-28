module.exports = {
    "env": {
      "node": true
    },
    "parserOptions": {
      "ecmaVersion": 2017
    },
    "extends": "airbnb-base",
    "rules": {
      "strict": "off",
      "semi": ["error"],
      "space-before-function-paren": ["error", { "anonymous": "never", "named": "always" }],
      "class-methods-use-this": "off",
      "global-require": "off",
      "arrow-parens": ["error", "as-needed"],
      "no-param-reassign": ["error", { "props": false }],
      "no-unused-vars":"off",
      "camelcase" : "off",
    },
    "globals": {
      "use": true
    }
};
