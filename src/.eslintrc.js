module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    "semi": ["error", "never"],
    "space-before-function-paren": ["error", "always"],
    "quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "arrow-parens": ["error", "as-needed"],
    "arrow-body-style": ["off"],
    "comma-dangle": ["error", {
      "arrays": "never",
      "objects": "never",
      "imports": "never",
      "exports": "never",
      "functions": "never"
    }]
  }
};
