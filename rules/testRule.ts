import * as ts from "typescript";
import * as Lint from "tslint";
import * as fs from "fs";
// import * as conf from '../../package.json';
const pkgInfo = require('../../package.json');

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {

    let walker = new NoImportsWalker(sourceFile, this.getOptions());
    let result = this.applyWithWalker(walker);
    // console.log('Method Names ( ' + sourceFile.fileName + ' )');
    // console.log(walker.methodNames);

    // console.log('Method Executions');
    // console.log(walker.methodExecutions);

    // console.log('Injected');
    // console.log(walker.injectedObjects);

    walker.methodExecutions.forEach(method => {
      let injectedObject = walker.injectedObjects.filter(obj => obj.className === method.className && obj.objectName === method.objectName.replace("this.", ""))[0];
      if (injectedObject) {
        let methodName = walker.methodNames.filter(name => name.className === injectedObject.typeName && name.name === method.methodName)[0];
        if (methodName) {
          methodName.used = true;
        }
      }
    });

    // console.log('Processed method names');
    // console.log(walker.methodNames.filter(x => x.used));

    this.saveResults(walker.methodNames.filter(x => x.used));

    return result;
  }


  private saveResults(data: any) {
    let fileName = pkgInfo.bc['dependency-file'] || 'dependency.json';
    fs.writeFile(fileName, JSON.stringify(data), function (err) {
      if (err) {
        return console.log(err);
      }
      //console.log("The file was saved!");
    });
  }
}

class NoImportsWalker extends Lint.RuleWalker {
  public methodNames: MethodDefinition[] = [];
  public methodExecutions: MethodAccess[] = [];
  public injectedObjects: InjectedObject[] = [];
  public baseServiceClassName: string = "BaseService";

  protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
    if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
      let classDeclaration: ts.ClassDeclaration = node.parent as ts.ClassDeclaration;
      if (classDeclaration && classDeclaration.heritageClauses && this.getBaseClasses(classDeclaration.heritageClauses).indexOf(this.baseServiceClassName) > -1) {
        this.methodNames.push({
          name: node.name.getText(),
          className: classDeclaration.name.text
        });
      }
    }
    this.walkChildren(node);
  }

  protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
    if (node.parent.kind === ts.SyntaxKind.CallExpression) {
      let expressionText: string;
      expressionText = node.expression.getText();
      let classParent: ts.Node = node;
      while ((classParent = classParent.parent) && (classParent.kind !== ts.SyntaxKind.ClassDeclaration))
      // tslint:disable-next-line:no-empty
      {

      }
      let parentNode = classParent as ts.ClassDeclaration;
      if (parentNode) {
        this.methodExecutions.push({
          objectName: expressionText,
          methodName: node.name.text,
          className: parentNode.name.text
        });
      }
    }
    this.walkChildren(node);
  }

  protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
    if (node.parent.kind === ts.SyntaxKind.ClassDeclaration) {
      let classDeclaration = node.parent as ts.ClassDeclaration;
      if (classDeclaration) {
        node.parameters.forEach(parameter => {
          if (parameter) {
            this.injectedObjects.push({
              className: classDeclaration.name.text,
              objectName: parameter.name.getText(),
              typeName: parameter.type.getText()
            });
          }
        });
      }
    }
    this.walkChildren(node);
  }

  protected visitNode(node: ts.Node) {
      console.log(node);
      this.walkChildren(node);
  }

  private getBaseClasses(heritageClauses: ts.NodeArray<ts.HeritageClause>): string[] {
    return heritageClauses.filter(x => x.token === ts.SyntaxKind.ExtendsKeyword)
      .reduce((prev: any[], current: ts.HeritageClause) => prev.concat(current.types.map(y => y.expression.getText())), []);
  }
}

class MethodDefinition {
  name: string;
  className: string;
  used?: boolean;

  /**
   *
   */
  constructor() {
    this.used = false;
  }
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