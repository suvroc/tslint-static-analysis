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
        var walker = new NoImportsWalker(sourceFile, this.getOptions());
        var result = this.applyWithWalker(walker);
        // console.log('Method Names');
        // console.log(walker.methodNames);
        // console.log('Method Executions');
        // console.log(walker.methodExecutions);
        // console.log('Injected');
        // console.log(walker.injectedObjects);
        walker.methodExecutions.forEach(function (method) {
            var injectedObject = walker.injectedObjects.filter(function (obj) { return obj.className === method.className && obj.objectName === method.objectName; })[0];
            if (injectedObject) {
                var methodName = walker.methodNames.filter(function (name) { return name.className === injectedObject.typeName && name.name === method.methodName; })[0];
                methodName.used = true;
            }
        });
        console.log('Processed method names');
        console.log(walker.methodNames.filter(function (x) { return x.used; }));
        // walker.methodNames.filter(x => !x.used).forEach(method => {
        //     result.push(new Lint.RuleFailure(sourceFile, method.start, method.end, `${method.className}.${method.name} method is not used`, "Api methods should be used"));
        // });
        return result;
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var NoImportsWalker = (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.methodNames = [];
        _this.methodExecutions = [];
        _this.injectedObjects = [];
        //public apiClassNames: string[] = ["ApiService"];
        _this.baseServiceClassName = "BaseService";
        return _this;
        // protected visitNode(node: ts.Node) {
        //     console.log(node);
        //     this.walkChildren(node);
        // }
    }
    NoImportsWalker.prototype.visitMethodDeclaration = function (node) {
        if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            var classDeclaration = node.parent;
            if (classDeclaration.heritageClauses) {
                //if (this.apiClassNames.indexOf(classDeclaration.name.text) > -1) {
                this.methodNames.push({
                    name: node.name.getText(),
                    className: classDeclaration.name.text
                });
            }
        }
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.getBaseClasess = function (heritageClauses) {
        return heritageClauses.filter(function (x) { return x.token === ts.SyntaxKind.ExtendsKeyword; })
            .reduce(function (prev, current) { return prev.concat(current.types.map(function (y) { return y.expression.getText(); })); }, []);
    };
    NoImportsWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (node.parent.kind === ts.SyntaxKind.CallExpression) {
            var expressionText = void 0;
            if (node.expression.kind === 177) {
                var propertyAccess = node.expression;
                expressionText = propertyAccess.name.text;
            }
            else if (node.expression.kind === 70) {
                var identifier = node.expression;
                expressionText = identifier.text;
            }
            else if (node.expression.kind === 98) {
                expressionText = "this";
            }
            var parent_1 = node;
            while ((parent_1 = parent_1.parent) && (parent_1.kind !== ts.SyntaxKind.ClassDeclaration)) {
            }
            var parentNode = parent_1;
            this.methodExecutions.push({
                objectName: expressionText,
                methodName: node.name.text,
                className: parentNode.name.text
            });
        }
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitConstructorDeclaration = function (node) {
        var _this = this;
        if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            var classDeclaration_1 = node.parent;
            node.parameters.forEach(function (parameter) {
                _this.injectedObjects.push({
                    className: classDeclaration_1.name.text,
                    objectName: parameter.name.getText(),
                    typeName: parameter.type.getText()
                });
            });
        }
        this.walkChildren(node);
    };
    return NoImportsWalker;
}(Lint.RuleWalker));
var MethodDefinition = (function () {
    function MethodDefinition() {
    }
    return MethodDefinition;
}());
var MethodAccess = (function () {
    function MethodAccess() {
    }
    return MethodAccess;
}());
var InjectedObject = (function () {
    function InjectedObject() {
    }
    return InjectedObject;
}());
