import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "import statement forbidden";

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var walker = new NoImportsWalker(sourceFile, this.getOptions());

        var result = this.applyWithWalker(walker);
        console.log('Method Names');
        console.log(walker.methodNames);

        return result;
    }
}

// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    public methodNames: MethodDefinition[] = [];
    public methodExecutions: string[] = [];
    public injectedObjects: string[] = [];

    protected visitCallSignature(node: ts.SignatureDeclaration) {
        console.log("Hey");
        //console.log(node.getStart());
        this.walkChildren(node);
    }
    protected visitMethodSignature(node: ts.SignatureDeclaration) {
        console.log("method");
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

        this.walkChildren(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (node.parent.kind === 226) {
            var classDeclaration: ts.ClassDeclaration = node.parent as ts.ClassDeclaration;
            if (classDeclaration.name.text === "ApiService") {
                this.methodNames.push({
                    name: node.name.getText(),
                    className: classDeclaration.name.text
                });
            }
        }
        // zbieramy informacje o wszystkich metodach w ApiService
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        // zbieramy wszystkie dane o wywołaniach metod
        ts.SyntaxKind.ArrayBindingPattern
    }


    // protected visitNode(node: ts.Node) {
    //     //console.log(node);
    //     //console.log(ts.SyntaxKind[node.kind].toString());
    //     switch (node.kind) {
    //         case ts.SyntaxKind.AnyKeyword:
    //             this.visitAnyKeyword(node);
    //             break;

    //         case ts.SyntaxKind.ArrayBindingPattern:
    //             this.visitBindingPattern(node as ts.BindingPattern);
    //             break;

    //         case ts.SyntaxKind.ArrayLiteralExpression:
    //             this.visitArrayLiteralExpression(node as ts.ArrayLiteralExpression);
    //             break;

    //         case ts.SyntaxKind.ArrayType:
    //             this.visitArrayType(node as ts.ArrayTypeNode);
    //             break;

    //         case ts.SyntaxKind.ArrowFunction:
    //             this.visitArrowFunction(node as ts.ArrowFunction);
    //             break;

    //         case ts.SyntaxKind.BinaryExpression:
    //             this.visitBinaryExpression(node as ts.BinaryExpression);
    //             break;

    //         case ts.SyntaxKind.BindingElement:
    //             this.visitBindingElement(node as ts.BindingElement);
    //             break;

    //         case ts.SyntaxKind.Block:
    //             this.visitBlock(node as ts.Block);
    //             break;

    //         case ts.SyntaxKind.BreakStatement:
    //             this.visitBreakStatement(node as ts.BreakOrContinueStatement);
    //             break;

    //         case ts.SyntaxKind.CallExpression:

    //             //console.log((node as ts.CallExpression));

    //             this.visitCallExpression(node as ts.CallExpression);
    //             break;

    //         case ts.SyntaxKind.CallSignature:
    //             console.log(node);
    //             this.visitCallSignature(node as ts.SignatureDeclaration);
    //             break;

    //         case ts.SyntaxKind.CaseClause:
    //             this.visitCaseClause(node as ts.CaseClause);
    //             break;

    //         case ts.SyntaxKind.ClassDeclaration:
    //             this.visitClassDeclaration(node as ts.ClassDeclaration);
    //             break;

    //         case ts.SyntaxKind.ClassExpression:
    //             this.visitClassExpression(node as ts.ClassExpression);
    //             break;

    //         case ts.SyntaxKind.CatchClause:
    //             this.visitCatchClause(node as ts.CatchClause);
    //             break;

    //         case ts.SyntaxKind.ConditionalExpression:
    //             this.visitConditionalExpression(node as ts.ConditionalExpression);
    //             break;

    //         case ts.SyntaxKind.ConstructSignature:
    //             this.visitConstructSignature(node as ts.ConstructSignatureDeclaration);
    //             break;

    //         case ts.SyntaxKind.Constructor:
    //             this.visitConstructorDeclaration(node as ts.ConstructorDeclaration);
    //             break;

    //         case ts.SyntaxKind.ConstructorType:
    //             this.visitConstructorType(node as ts.FunctionOrConstructorTypeNode);
    //             break;

    //         case ts.SyntaxKind.ContinueStatement:
    //             this.visitContinueStatement(node as ts.BreakOrContinueStatement);
    //             break;

    //         case ts.SyntaxKind.DebuggerStatement:
    //             this.visitDebuggerStatement(node as ts.Statement);
    //             break;

    //         case ts.SyntaxKind.DefaultClause:
    //             this.visitDefaultClause(node as ts.DefaultClause);
    //             break;

    //         case ts.SyntaxKind.DoStatement:
    //             this.visitDoStatement(node as ts.DoStatement);
    //             break;

    //         case ts.SyntaxKind.ElementAccessExpression:
    //             this.visitElementAccessExpression(node as ts.ElementAccessExpression);
    //             break;

    //         case ts.SyntaxKind.EndOfFileToken:
    //             this.visitEndOfFileToken(node);
    //             break;

    //         case ts.SyntaxKind.EnumDeclaration:
    //             this.visitEnumDeclaration(node as ts.EnumDeclaration);
    //             break;

    //         case ts.SyntaxKind.ExportAssignment:
    //             this.visitExportAssignment(node as ts.ExportAssignment);
    //             break;

    //         case ts.SyntaxKind.ExpressionStatement:
    //             this.visitExpressionStatement(node as ts.ExpressionStatement);
    //             break;

    //         case ts.SyntaxKind.ForStatement:
    //             this.visitForStatement(node as ts.ForStatement);
    //             break;

    //         case ts.SyntaxKind.ForInStatement:
    //             this.visitForInStatement(node as ts.ForInStatement);
    //             break;

    //         case ts.SyntaxKind.ForOfStatement:
    //             this.visitForOfStatement(node as ts.ForOfStatement);
    //             break;

    //         case ts.SyntaxKind.FunctionDeclaration:
    //             this.visitFunctionDeclaration(node as ts.FunctionDeclaration);
    //             break;

    //         case ts.SyntaxKind.FunctionExpression:
    //             this.visitFunctionExpression(node as ts.FunctionExpression);
    //             break;

    //         case ts.SyntaxKind.FunctionType:
    //             this.visitFunctionType(node as ts.FunctionOrConstructorTypeNode);
    //             break;

    //         case ts.SyntaxKind.GetAccessor:
    //             this.visitGetAccessor(node as ts.AccessorDeclaration);
    //             break;

    //         case ts.SyntaxKind.Identifier:
    //             if ((node as ts.Identifier).getFullText() == "getSth") {
    //                 console.log(node);
    //             }
    //             this.visitIdentifier(node as ts.Identifier);
    //             break;

    //         case ts.SyntaxKind.IfStatement:
    //             this.visitIfStatement(node as ts.IfStatement);
    //             break;

    //         case ts.SyntaxKind.ImportDeclaration:
    //             this.visitImportDeclaration(node as ts.ImportDeclaration);
    //             break;

    //         case ts.SyntaxKind.ImportEqualsDeclaration:
    //             this.visitImportEqualsDeclaration(node as ts.ImportEqualsDeclaration);
    //             break;

    //         case ts.SyntaxKind.IndexSignature:
    //             this.visitIndexSignatureDeclaration(node as ts.IndexSignatureDeclaration);
    //             break;

    //         case ts.SyntaxKind.InterfaceDeclaration:
    //             this.visitInterfaceDeclaration(node as ts.InterfaceDeclaration);
    //             break;

    //         case ts.SyntaxKind.JsxAttribute:
    //             this.visitJsxAttribute(node as ts.JsxAttribute);
    //             break;

    //         case ts.SyntaxKind.JsxElement:
    //             this.visitJsxElement(node as ts.JsxElement);
    //             break;

    //         case ts.SyntaxKind.JsxExpression:
    //             this.visitJsxExpression(node as ts.JsxExpression);
    //             break;

    //         case ts.SyntaxKind.JsxSelfClosingElement:
    //             this.visitJsxSelfClosingElement(node as ts.JsxSelfClosingElement);
    //             break;

    //         case ts.SyntaxKind.JsxSpreadAttribute:
    //             this.visitJsxSpreadAttribute(node as ts.JsxSpreadAttribute);
    //             break;

    //         case ts.SyntaxKind.LabeledStatement:
    //             this.visitLabeledStatement(node as ts.LabeledStatement);
    //             break;

    //         case ts.SyntaxKind.MethodDeclaration:
    //             this.visitMethodDeclaration(node as ts.MethodDeclaration);
    //             break;

    //         case ts.SyntaxKind.MethodSignature:
    //             this.visitMethodSignature(node as ts.SignatureDeclaration);
    //             break;

    //         case ts.SyntaxKind.ModuleDeclaration:
    //             this.visitModuleDeclaration(node as ts.ModuleDeclaration);
    //             break;

    //         case ts.SyntaxKind.NamedImports:
    //             this.visitNamedImports(node as ts.NamedImports);
    //             break;

    //         case ts.SyntaxKind.NamespaceImport:
    //             this.visitNamespaceImport(node as ts.NamespaceImport);
    //             break;

    //         case ts.SyntaxKind.NewExpression:
    //             this.visitNewExpression(node as ts.NewExpression);
    //             break;

    //         case ts.SyntaxKind.ObjectBindingPattern:
    //             this.visitBindingPattern(node as ts.BindingPattern);
    //             break;

    //         case ts.SyntaxKind.ObjectLiteralExpression:
    //             this.visitObjectLiteralExpression(node as ts.ObjectLiteralExpression);
    //             break;

    //         case ts.SyntaxKind.Parameter:
    //             this.visitParameterDeclaration(node as ts.ParameterDeclaration);
    //             break;

    //         case ts.SyntaxKind.PostfixUnaryExpression:
    //             this.visitPostfixUnaryExpression(node as ts.PostfixUnaryExpression);
    //             break;

    //         case ts.SyntaxKind.PrefixUnaryExpression:
    //             this.visitPrefixUnaryExpression(node as ts.PrefixUnaryExpression);
    //             break;

    //         case ts.SyntaxKind.PropertyAccessExpression:
    //             this.visitPropertyAccessExpression(node as ts.PropertyAccessExpression);
    //             break;

    //         case ts.SyntaxKind.PropertyAssignment:
    //             this.visitPropertyAssignment(node as ts.PropertyAssignment);
    //             break;

    //         case ts.SyntaxKind.PropertyDeclaration:
    //             this.visitPropertyDeclaration(node as ts.PropertyDeclaration);
    //             break;

    //         case ts.SyntaxKind.PropertySignature:
    //             this.visitPropertySignature(node);
    //             break;

    //         case ts.SyntaxKind.RegularExpressionLiteral:
    //             this.visitRegularExpressionLiteral(node);
    //             break;

    //         case ts.SyntaxKind.ReturnStatement:
    //             this.visitReturnStatement(node as ts.ReturnStatement);
    //             break;

    //         case ts.SyntaxKind.SetAccessor:
    //             this.visitSetAccessor(node as ts.AccessorDeclaration);
    //             break;

    //         case ts.SyntaxKind.SourceFile:
    //             this.visitSourceFile(node as ts.SourceFile);
    //             break;

    //         case ts.SyntaxKind.StringLiteral:
    //             this.visitStringLiteral(node as ts.StringLiteral);
    //             break;

    //         case ts.SyntaxKind.SwitchStatement:
    //             this.visitSwitchStatement(node as ts.SwitchStatement);
    //             break;

    //         case ts.SyntaxKind.TemplateExpression:
    //             this.visitTemplateExpression(node as ts.TemplateExpression);
    //             break;

    //         case ts.SyntaxKind.ThrowStatement:
    //             this.visitThrowStatement(node as ts.ThrowStatement);
    //             break;

    //         case ts.SyntaxKind.TryStatement:
    //             this.visitTryStatement(node as ts.TryStatement);
    //             break;

    //         case ts.SyntaxKind.TupleType:
    //             this.visitTupleType(node as ts.TupleTypeNode);
    //             break;

    //         case ts.SyntaxKind.TypeAliasDeclaration:
    //             this.visitTypeAliasDeclaration(node as ts.TypeAliasDeclaration);
    //             break;

    //         case ts.SyntaxKind.TypeAssertionExpression:
    //             this.visitTypeAssertionExpression(node as ts.TypeAssertion);
    //             break;

    //         case ts.SyntaxKind.TypeLiteral:
    //             this.visitTypeLiteral(node as ts.TypeLiteralNode);
    //             break;

    //         case ts.SyntaxKind.TypeReference:
    //             this.visitTypeReference(node as ts.TypeReferenceNode);
    //             break;

    //         case ts.SyntaxKind.VariableDeclaration:
    //             this.visitVariableDeclaration(node as ts.VariableDeclaration);
    //             break;

    //         case ts.SyntaxKind.VariableDeclarationList:
    //             this.visitVariableDeclarationList(node as ts.VariableDeclarationList);
    //             break;

    //         case ts.SyntaxKind.VariableStatement:
    //             this.visitVariableStatement(node as ts.VariableStatement);
    //             break;

    //         case ts.SyntaxKind.WhileStatement:
    //             this.visitWhileStatement(node as ts.WhileStatement);
    //             break;

    //         case ts.SyntaxKind.WithStatement:
    //             this.visitWithStatement(node as ts.WithStatement);
    //             break;

    //         default:
    //             this.walkChildren(node);
    //             break;
    //     }
    // }
}

class MethodDefinition {
    name: string;
    className: string;
}