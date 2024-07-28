import globals from "globals";


export default [
  { 
    files: ["**/*.js"], 
    languageOptions: {
      sourceType: "commonjs",
      globals: {...globals.browser },
      ecmaVersion : 'latest',
     },
     rules : {
      'indent' : ['error', 4],
      'linebreak-style' : ['error', 'unix'],
      'quotes' : ['error', 'double'],
      'semi' : ['error', 'never']
    }
    }
];
