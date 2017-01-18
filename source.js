"use strict";
var Test = (function () {
    function Test() {
    }
    Test.prototype.visitImportDeclaration = function (ss) {
        new Test2().aaaa("Dfsdfs");
    };
    return Test;
}());
var Test2 = (function () {
    function Test2() {
    }
    Test2.prototype.aaaa = function (ss) {
    };
    return Test2;
}());
