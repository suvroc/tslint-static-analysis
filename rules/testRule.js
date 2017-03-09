"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require("typescript");
var Lint = require("tslint");
var fs = require("fs");
// import * as conf from '../../package.json';
var pkgInfo = require('../../package.json');
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var walker = new NoImportsWalker(sourceFile, this.getOptions());
        var result = this.applyWithWalker(walker);
        // console.log('Method Names ( ' + sourceFile.fileName + ' )');
        // console.log(walker.methodNames);
        // console.log('Method Executions');
        // console.log(walker.methodExecutions);
        // console.log('Injected');
        // console.log(walker.injectedObjects);
        walker.methodExecutions.forEach(function (method) {
            var injectedObject = walker.injectedObjects.filter(function (obj) { return obj.className === method.className && obj.objectName === method.objectName.replace("this.", ""); })[0];
            if (injectedObject) {
                var methodName = walker.methodNames.filter(function (name) { return name.className === injectedObject.typeName && name.name === method.methodName; })[0];
                if (methodName) {
                    methodName.used = true;
                }
            }
        });
        // console.log('Processed method names');
        // console.log(walker.methodNames.filter(x => x.used));
        this.saveResults(walker.methodNames.filter(function (x) { return x.used; }));
        return result;
    };
    Rule.prototype.saveResults = function (data) {
        var fileName = pkgInfo.bc['dependency-file'] || 'dependency.json';
        fs.writeFile(fileName, JSON.stringify(data), function (err) {
            if (err) {
                return console.log(err);
            }
            //console.log("The file was saved!");
        });
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
        _this.baseServiceClassName = "BaseService";
        return _this;
    }
    NoImportsWalker.prototype.visitMethodDeclaration = function (node) {
        if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            var classDeclaration = node.parent;
            if (classDeclaration && classDeclaration.heritageClauses && this.getBaseClasses(classDeclaration.heritageClauses).indexOf(this.baseServiceClassName) > -1) {
                this.methodNames.push({
                    name: node.name.getText(),
                    className: classDeclaration.name.text
                });
            }
        }
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (node.parent.kind === ts.SyntaxKind.CallExpression) {
            var expressionText = void 0;
            expressionText = node.expression.getText();
            var classParent = node;
            while ((classParent = classParent.parent) && (classParent.kind !== ts.SyntaxKind.ClassDeclaration)) 
            // tslint:disable-next-line:no-empty
            {
            }
            var parentNode = classParent;
            if (parentNode) {
                this.methodExecutions.push({
                    objectName: expressionText,
                    methodName: node.name.text,
                    className: parentNode.name.text
                });
            }
        }
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitConstructorDeclaration = function (node) {
        var _this = this;
        if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            var classDeclaration_1 = node.parent;
            if (classDeclaration_1) {
                node.parameters.forEach(function (parameter) {
                    if (parameter) {
                        _this.injectedObjects.push({
                            className: classDeclaration_1.name.text,
                            objectName: parameter.name.getText(),
                            typeName: parameter.type.getText()
                        });
                    }
                });
            }
        }
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.visitNode = function (node) {
        console.log(node);
        this.walkChildren(node);
    };
    NoImportsWalker.prototype.getBaseClasses = function (heritageClauses) {
        return heritageClauses.filter(function (x) { return x.token === ts.SyntaxKind.ExtendsKeyword; })
            .reduce(function (prev, current) { return prev.concat(current.types.map(function (y) { return y.expression.getText(); })); }, []);
    };
    return NoImportsWalker;
}(Lint.RuleWalker));
var MethodDefinition = (function () {
    /**
     *
     */
    function MethodDefinition() {
        this.used = false;
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
