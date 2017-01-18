"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require("typescript");
var Lint = require("tslint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = "import statement forbidden";
exports.Rule = Rule;
// The walker takes care of all the work.
var NoImportsWalker = (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoImportsWalker.prototype.visitCallSignature = function (node) {
        console.log("Hey");
        //console.log(node.getStart());
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitMethodSignature = function (node) {
        console.log("method");
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitImportDeclaration = function (node) {
        console.log('visit import');
        //this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitNode = function (node) {
        //console.log(node);
        //console.log(ts.SyntaxKind[node.kind].toString());
        switch (node.kind) {
            case ts.SyntaxKind.AnyKeyword:
                this.visitAnyKeyword(node);
                break;
            case ts.SyntaxKind.ArrayBindingPattern:
                this.visitBindingPattern(node);
                break;
            case ts.SyntaxKind.ArrayLiteralExpression:
                this.visitArrayLiteralExpression(node);
                break;
            case ts.SyntaxKind.ArrayType:
                this.visitArrayType(node);
                break;
            case ts.SyntaxKind.ArrowFunction:
                this.visitArrowFunction(node);
                break;
            case ts.SyntaxKind.BinaryExpression:
                this.visitBinaryExpression(node);
                break;
            case ts.SyntaxKind.BindingElement:
                this.visitBindingElement(node);
                break;
            case ts.SyntaxKind.Block:
                this.visitBlock(node);
                break;
            case ts.SyntaxKind.BreakStatement:
                this.visitBreakStatement(node);
                break;
            case ts.SyntaxKind.CallExpression:
                //console.log((node as ts.CallExpression));
                this.visitCallExpression(node);
                break;
            case ts.SyntaxKind.CallSignature:
                console.log(node);
                this.visitCallSignature(node);
                break;
            case ts.SyntaxKind.CaseClause:
                this.visitCaseClause(node);
                break;
            case ts.SyntaxKind.ClassDeclaration:
                this.visitClassDeclaration(node);
                break;
            case ts.SyntaxKind.ClassExpression:
                this.visitClassExpression(node);
                break;
            case ts.SyntaxKind.CatchClause:
                this.visitCatchClause(node);
                break;
            case ts.SyntaxKind.ConditionalExpression:
                this.visitConditionalExpression(node);
                break;
            case ts.SyntaxKind.ConstructSignature:
                this.visitConstructSignature(node);
                break;
            case ts.SyntaxKind.Constructor:
                this.visitConstructorDeclaration(node);
                break;
            case ts.SyntaxKind.ConstructorType:
                this.visitConstructorType(node);
                break;
            case ts.SyntaxKind.ContinueStatement:
                this.visitContinueStatement(node);
                break;
            case ts.SyntaxKind.DebuggerStatement:
                this.visitDebuggerStatement(node);
                break;
            case ts.SyntaxKind.DefaultClause:
                this.visitDefaultClause(node);
                break;
            case ts.SyntaxKind.DoStatement:
                this.visitDoStatement(node);
                break;
            case ts.SyntaxKind.ElementAccessExpression:
                this.visitElementAccessExpression(node);
                break;
            case ts.SyntaxKind.EndOfFileToken:
                this.visitEndOfFileToken(node);
                break;
            case ts.SyntaxKind.EnumDeclaration:
                this.visitEnumDeclaration(node);
                break;
            case ts.SyntaxKind.ExportAssignment:
                this.visitExportAssignment(node);
                break;
            case ts.SyntaxKind.ExpressionStatement:
                this.visitExpressionStatement(node);
                break;
            case ts.SyntaxKind.ForStatement:
                this.visitForStatement(node);
                break;
            case ts.SyntaxKind.ForInStatement:
                this.visitForInStatement(node);
                break;
            case ts.SyntaxKind.ForOfStatement:
                this.visitForOfStatement(node);
                break;
            case ts.SyntaxKind.FunctionDeclaration:
                this.visitFunctionDeclaration(node);
                break;
            case ts.SyntaxKind.FunctionExpression:
                this.visitFunctionExpression(node);
                break;
            case ts.SyntaxKind.FunctionType:
                this.visitFunctionType(node);
                break;
            case ts.SyntaxKind.GetAccessor:
                this.visitGetAccessor(node);
                break;
            case ts.SyntaxKind.Identifier:
                if (node.getFullText() == "getSth") {
                    console.log(node);
                }
                this.visitIdentifier(node);
                break;
            case ts.SyntaxKind.IfStatement:
                this.visitIfStatement(node);
                break;
            case ts.SyntaxKind.ImportDeclaration:
                this.visitImportDeclaration(node);
                break;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                this.visitImportEqualsDeclaration(node);
                break;
            case ts.SyntaxKind.IndexSignature:
                this.visitIndexSignatureDeclaration(node);
                break;
            case ts.SyntaxKind.InterfaceDeclaration:
                this.visitInterfaceDeclaration(node);
                break;
            case ts.SyntaxKind.JsxAttribute:
                this.visitJsxAttribute(node);
                break;
            case ts.SyntaxKind.JsxElement:
                this.visitJsxElement(node);
                break;
            case ts.SyntaxKind.JsxExpression:
                this.visitJsxExpression(node);
                break;
            case ts.SyntaxKind.JsxSelfClosingElement:
                this.visitJsxSelfClosingElement(node);
                break;
            case ts.SyntaxKind.JsxSpreadAttribute:
                this.visitJsxSpreadAttribute(node);
                break;
            case ts.SyntaxKind.LabeledStatement:
                this.visitLabeledStatement(node);
                break;
            case ts.SyntaxKind.MethodDeclaration:
                this.visitMethodDeclaration(node);
                break;
            case ts.SyntaxKind.MethodSignature:
                this.visitMethodSignature(node);
                break;
            case ts.SyntaxKind.ModuleDeclaration:
                this.visitModuleDeclaration(node);
                break;
            case ts.SyntaxKind.NamedImports:
                this.visitNamedImports(node);
                break;
            case ts.SyntaxKind.NamespaceImport:
                this.visitNamespaceImport(node);
                break;
            case ts.SyntaxKind.NewExpression:
                this.visitNewExpression(node);
                break;
            case ts.SyntaxKind.ObjectBindingPattern:
                this.visitBindingPattern(node);
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                this.visitObjectLiteralExpression(node);
                break;
            case ts.SyntaxKind.Parameter:
                this.visitParameterDeclaration(node);
                break;
            case ts.SyntaxKind.PostfixUnaryExpression:
                this.visitPostfixUnaryExpression(node);
                break;
            case ts.SyntaxKind.PrefixUnaryExpression:
                this.visitPrefixUnaryExpression(node);
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
                this.visitPropertyAccessExpression(node);
                break;
            case ts.SyntaxKind.PropertyAssignment:
                this.visitPropertyAssignment(node);
                break;
            case ts.SyntaxKind.PropertyDeclaration:
                this.visitPropertyDeclaration(node);
                break;
            case ts.SyntaxKind.PropertySignature:
                this.visitPropertySignature(node);
                break;
            case ts.SyntaxKind.RegularExpressionLiteral:
                this.visitRegularExpressionLiteral(node);
                break;
            case ts.SyntaxKind.ReturnStatement:
                this.visitReturnStatement(node);
                break;
            case ts.SyntaxKind.SetAccessor:
                this.visitSetAccessor(node);
                break;
            case ts.SyntaxKind.SourceFile:
                this.visitSourceFile(node);
                break;
            case ts.SyntaxKind.StringLiteral:
                this.visitStringLiteral(node);
                break;
            case ts.SyntaxKind.SwitchStatement:
                this.visitSwitchStatement(node);
                break;
            case ts.SyntaxKind.TemplateExpression:
                this.visitTemplateExpression(node);
                break;
            case ts.SyntaxKind.ThrowStatement:
                this.visitThrowStatement(node);
                break;
            case ts.SyntaxKind.TryStatement:
                this.visitTryStatement(node);
                break;
            case ts.SyntaxKind.TupleType:
                this.visitTupleType(node);
                break;
            case ts.SyntaxKind.TypeAliasDeclaration:
                this.visitTypeAliasDeclaration(node);
                break;
            case ts.SyntaxKind.TypeAssertionExpression:
                this.visitTypeAssertionExpression(node);
                break;
            case ts.SyntaxKind.TypeLiteral:
                this.visitTypeLiteral(node);
                break;
            case ts.SyntaxKind.TypeReference:
                this.visitTypeReference(node);
                break;
            case ts.SyntaxKind.VariableDeclaration:
                this.visitVariableDeclaration(node);
                break;
            case ts.SyntaxKind.VariableDeclarationList:
                this.visitVariableDeclarationList(node);
                break;
            case ts.SyntaxKind.VariableStatement:
                this.visitVariableStatement(node);
                break;
            case ts.SyntaxKind.WhileStatement:
                this.visitWhileStatement(node);
                break;
            case ts.SyntaxKind.WithStatement:
                this.visitWithStatement(node);
                break;
            default:
                this.walkChildren(node);
                break;
        }
    };
    return NoImportsWalker;
}(Lint.RuleWalker));
"";
