var child1 = require('./child1.js')
  , child2 = require('./child2.js')
  , util = require('util')
  ;

function getDirname() {
  return __dirname;
}

function getFilename(fn) {
  return __filename;
}

exports.publicVariable1 = "a";

module.exports.publicVariable2 = "b";

exports.publicMethod1 = function () {
  return "a";
};

module.exports.publicMethod2 = function () {
  return "b";
};

module.exports.getParentModule = function () {
  return module.parent;
}

module.exports.getChild = function () {
  return module.children;
};

module.exports.useIsArray = function () {
  util.isArray([1, 2, 3]);
}
