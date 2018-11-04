const { Parser, Lexer, createToken: createTokenOrg } = require("chevrotain");

const allTokens = [];
function createToken(config) {
  const newToken = createTokenOrg(config);
  allTokens.push(newToken);
}

// The negative lookahead is needed to distinguish between an alternative
// and a regular newline (between rule)
const Alternative = createToken({
  name: "Alternative",
  pattern: /(\n|\r\n|\r)(?![A-z]\w*:)/
});
const Whitespace = createToken({ name: "Whitespace", pattern: /[\s]+/ });
// Must appear before <NonTerminal> due to common prefix
const RuleName = createToken({ name: "RuleName", pattern: /[A-z]\w*:/ });
const NonTerminalID = createToken({
  name: "NonTerminalID",
  pattern: /[A-z]\w*/
});
const TerminalID = createToken({ name: "TerminalID", pattern: /[a-z]\w*/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });

const SpecLexer = new Lexer(allTokens);

class JavaSpecParser extends Parser {
  constructor() {
    super(allTokens);

    const $ = this;

    $.RULE("topRule", () => {
      $.CONSUME(RuleName);
      $.AT_LEAST_ONE(() => {
        $.CONSUME(Alternative);
        $.SUBRULE($.alternation);
      });
    });

    $.RULE("alternation", () => {
      $.AT_LEAST_ONE(() => {
        $.SUBRULE($.production);
      });
    });

    $.RULE("production", () => {
      $.OR([
        { ALT: () => $.CONSUME(TerminalID) },
        { ALT: () => $.CONSUME(NonTerminalID) },
        { ALT: () => $.SUBRULE($.optional) },
        { ALT: () => $.SUBRULE($.repetition) }
      ]);
    });

    $.RULE("optional", () => {
      $.CONSUME(LSquare);
      $.SUBRULE($.production);
      $.CONSUME(RSquare);
    });

    $.RULE("repetition", () => {
      $.CONSUME(LCurly);
      $.SUBRULE($.production);
      $.CONSUME(RCurly);
    });
  }
}
// Type:
//   PrimitiveType
// ReferenceType
// PrimitiveType:
//   {Annotation} NumericType
//   {Annotation} boolean
// NumericType:
//   IntegralType
//   FloatingPointType
// IntegralType:
//   (one of)
// byte short int long char
// FloatingPointType:
//   (one of)
// float double
// ReferenceType:
//   ClassOrInterfaceType
//   TypeVariable
//   ArrayType
