"use strict";
const { Parser } = require("chevrotain");
const { allTokens, tokens: t } = require("./tokens");

// Specs at: https://docs.oracle.com/javase/specs/jls/se11/html/jls-19.html
class JavaParser extends Parser {
  constructor() {
    super(allTokens);

    const $ = this;

    // Productions from §7
    // https://docs.oracle.com/javase/specs/jls/se11/html/jls-7.html
    $.RULE("compilationUnit", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.OrdinaryCompilationUnit) },
        { ALT: () => $.SUBRULE($.ModularCompilationUnit) }
      ]);
    });

    $.RULE("OrdinaryCompilationUnit", () => {
      $.OPTION(() => {
        $.SUBRULE($.PackageDeclaration);
      });
      $.MANY(() => {
        $.SUBRULE($.ImportDeclaration);
      });
      $.MANY(() => {
        $.SUBRULE($.TypeDeclaration);
      });
    });

    $.RULE("ModularCompilationUnit", () => {
      $.MANY(() => {
        $.SUBRULE($.ImportDeclaration);
      });
      $.SUBRULE($.ModuleDeclaration);
    });

    $.RULE("PackageDeclaration", () => {
      $.MANY(() => {
        $.SUBRULE($.PackageModifier);
      });

      $.CONSUME(t.Package);
      // Spec Deviation: extracted common pattern to QualifiedName rule.
      $.SUBRULE($.QualifiedName);
    });

    $.RULE("PackageModifier", () => {
      $.SUBRULE($.Annotation);
    });

    $.RULE("ImportDeclaration", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.SingleTypeImportDeclaration) },
        { ALT: () => $.SUBRULE($.TypeImportOnDemandDeclaration) },
        { ALT: () => $.SUBRULE($.SingleStaticImportDeclaration) },
        { ALT: () => $.SUBRULE($.StaticImportOnDemandDeclaration) }
      ]);
    });

    // TODO refactor these import rules, they are not LL(K)
    $.RULE("SingleTypeImportDeclaration", () => {
      $.CONSUME(t.Import);
      $.SUBRULE($.TypeName);
      $.CONSUME(t.SemiColon);
    });

    $.RULE("TypeImportOnDemandDeclaration", () => {
      $.CONSUME(t.Import);
      $.SUBRULE($.PackageOrTypeName);
      $.CONSUME(t.Dot);
      $.CONSUME(t.Star);
      $.CONSUME(t.SemiColon);
    });

    $.RULE("SingleStaticImportDeclaration", () => {
      $.CONSUME(t.Import);
      $.CONSUME(t.Static);
      $.SUBRULE($.TypeName);
      $.CONSUME(t.Dot);
      $.SUBRULE($.Identifier);
      $.CONSUME(t.SemiColon);
    });

    $.RULE("StaticImportOnDemandDeclaration", () => {
      $.CONSUME(t.Import);
      $.CONSUME(t.Static);
      $.SUBRULE($.TypeName);
      $.CONSUME(t.Dot);
      $.CONSUME(t.Star);
      $.CONSUME(t.SemiColon);
    });

    $.RULE("TypeDeclaration", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.ClassDeclaration) },
        { ALT: () => $.SUBRULE($.InterfaceDeclaration) },
        { ALT: () => $.CONSUME(t.SemiColon) }
      ]);
    });

    // {Annotation} [open] module Identifier {. Identifier} { {ModuleDirective} }
    $.RULE("ModuleDeclaration", () => {
      $.MANY(() => {
        $.SUBRULE($.Annotation);
      });
      $.OPTION(() => {
        $.CONSUME(t.Open);
      });
      $.CONSUME(t.Module);
      // Spec Deviation: extracted common pattern to QualifiedName rule.
      $.SUBRULE($.QualifiedName);
      $.CONSUME(t.LCurly);
      $.MANY(() => {
        $.SUBRULE($.ModuleDirective);
      });
      $.CONSUME(t.RCurly);
    });

    $.RULE("ModuleDirective", () => {
      // Spec Deviation: the 5 alternations of "ModuleDirective" were
      //                 extracted to separate rules.
      $.OR([
        { ALT: () => $.SUBRULE($.RequiresModuleDirective) },
        { ALT: () => $.SUBRULE($.ExportsModuleDirective) },
        { ALT: () => $.SUBRULE($.OpensModuleDirective) },
        { ALT: () => $.SUBRULE($.UsesModuleDirective) },
        { ALT: () => $.SUBRULE($.ProvidesModuleDirective) }
      ]);
    });

    $.RULE("RequiresModuleDirective", () => {});

    $.RULE("ExportsModuleDirective", () => {});

    $.RULE("OpensModuleDirective", () => {});

    $.RULE("UsesModuleDirective", () => {});

    $.RULE("ProvidesModuleDirective", () => {});

    // Others
    $.RULE("QualifiedName", () => {
      $.SUBRULE($.Identifier);
      $.MANY(() => {
        $.CONSUME(t.Dot);
        $.SUBRULE2($.Identifier);
      });
    });
  }
}

module.exports = {
  JavaParser
};
