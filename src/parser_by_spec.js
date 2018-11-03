"use strict";
const { Parser } = require("chevrotain");
const { allTokens, tokens: t } = require("./tokens");

// Specs at: https://docs.oracle.com/javase/specs/jls/se11/html/jls-19.html
class JavaParser extends Parser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE("compilationUnit", () => {});
  }
}

module.exports = {
  JavaParser
};
