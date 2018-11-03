const { Parser, Lexer, createToken: createTokenOrg } = require("chevrotain");

const allTokens = [];
function createToken(config) {
  const newToken = createTokenOrg(config);
  allTokens.push(newToken);
}

const Whitespace = createToken({ name: "Whitespace", pattern: /[ \t]+/ });
const Alternative = createToken({ name: "Alternative", pattern: /\n|\r\n|\r/ });
// Must appear before <NonTerminal> due to common prefix
const RuleName = createToken({ name: "RuleName", pattern: /[A-z]\w*:/ });
const NonTerminal = createToken({ name: "NonTerminal", pattern: /[A-z]\w*/ });
const Terminal = createToken({ name: "Terminal", pattern: /[a-z]\w*/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });

const SpecLexer = new Lexer(allTokens);
