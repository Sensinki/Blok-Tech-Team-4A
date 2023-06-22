module.exports = {
  env: {
    node: true, // Hiermee worden de Node.js globale variabelen ingeschakeld
    browser: true, // Hiermee worden de browser globale variabelen ingeschakeld
    commonjs: true, // Hiermee worden de CommonJS globale variabelen ingeschakeld
    es6: true, // Hiermee worden de ES6 globale variabelen ingeschakeld
  },
  extends: "eslint:recommended", // Hiermee wordt de aanbevolen ESLint-configuratie uitgebreid
  overrides: [], // Hier kunnen aanvullende configuraties voor specifieke bestanden of mappen worden toegevoegd
  parserOptions: {
    ecmaVersion: "latest", // Hiermee wordt aangegeven dat de nieuwste ECMAScript-versie wordt gebruikt
  },
  rules: {
    "linebreak-style": ["error", "unix"], // Hiermee wordt Unix-stijl voor regelovergangen afgedwongen
    quotes: ["error", "double"], // Hiermee worden dubbele aanhalingstekens afgedwongen voor strings
    semi: ["error", "always"], // Hiermee wordt afgedwongen dat er altijd puntkomma's aan het einde van regels staan
    indent: ["error", 2], // Hiermee wordt een inkeping van 2 spaties afgedwongen
    camelcase: "warn", // Hiermee wordt een waarschuwing gegenereerd als camelCase-notatie niet wordt gebruikt
  },
};
