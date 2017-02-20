import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        var walker = new NoImportsWalker(sourceFile, this.getOptions());

        var result = this.applyWithWalker(walker);
        // console.log('Method Names');
        // console.log(walker.methodNames);

        // console.log('Method Executions');
        // console.log(walker.methodExecutions);

        // console.log('Injected');
        // console.log(walker.injectedObjects);

        walker.methodExecutions.forEach(method => {
            let injectedObject = walker.injectedObjects.filter(obj => obj.className === method.className && obj.objectName === method.objectName)[0];
            if (injectedObject) {
                let methodName = walker.methodNames.filter(name => name.className === injectedObject.typeName && name.name === method.methodName)[0];
                methodName.used = true;
            }
        });

        // console.log('Processed method names');
        // console.log(walker.methodNames);

        walker.methodNames.filter(x => !x.used).forEach(method => {
            result.push(new Lint.RuleFailure(sourceFile, method.start, method.end, `${method.className}.${method.name} method is not used`, "Api methods should be used"));
        });

        return result;
    }
}

class NoImportsWalker extends Lint.RuleWalker {
    public methodNames: MethodDefinition[] = [];
    public methodExecutions: MethodAccess[] = [];
    public injectedObjects: InjectedObject[] = [];
    public apiClassNames: string[] = ["ApiService"];

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            let classDeclaration: ts.ClassDeclaration = node.parent as ts.ClassDeclaration;
            if (this.apiClassNames.indexOf(classDeclaration.name.text) > -1) {
                this.methodNames.push({
                    name: node.name.getText(),
                    className: classDeclaration.name.text,
                    start: node.getStart(),
                    end: node.getEnd()
                });
            }
        }
        this.walkChildren(node);
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        if (node.parent.kind === ts.SyntaxKind.CallExpression) {
            let expressionText: string;
            if (node.expression.kind === 177) {
                let propertyAccess = node.expression as ts.PropertyAccessExpression;
                expressionText = propertyAccess.name.text;
            } else if (node.expression.kind === 70) {
                let identifier = node.expression as ts.Identifier;
                expressionText = identifier.text;
            } else if (node.expression.kind === 98) {
                expressionText = "this";
            }
            let parent: ts.Node = node;
            while ((parent = parent.parent) && (parent.kind !== ts.SyntaxKind.ClassDeclaration)) {

            }
            let parentNode = parent as ts.ClassDeclaration;

            this.methodExecutions.push({
                objectName: expressionText,
                methodName: node.name.text,
                className: parentNode.name.text
            });
        }
        this.walkChildren(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void  {
        if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            let classDeclaration = node.parent as ts.ClassDeclaration;
            node.parameters.forEach(parameter => {
                this.injectedObjects.push({
                    className: classDeclaration.name.text,
                    objectName: parameter.name.getText(),
                    typeName: parameter.type.getText()
                });
            });
        }
        this.walkChildren(node);
    }
}

class MethodDefinition {
    name: string;
    className: string;
    start: number;
    end: number;
    used?: boolean = false;
}

class MethodAccess {
    objectName: string;
    methodName: string;
    className: string;
}

class InjectedObject {
    className: string;
    objectName: string;
    typeName: string;
}