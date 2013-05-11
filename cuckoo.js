var vm = require('vm');
var fs = require('fs');
var path = require('path');

/**
 * Helper for unit testing:
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 *
 * @param {string} filePath Absolute path to module (file to load)
 * @param {Object=} mocks Hash of mocked dependencies
 */
exports.load = function(filePath, mocks) {
  var parentFilename = module.parent.filename
    , targetFilePath = path.resolve(path.dirname(parentFilename), filePath)
    , targetFileDir = path.dirname(targetFilePath)
    , context = {}
    , exports
    , resolveModule
    , children = []
    , key
    ;

  mocks = mocks || {};

  // this is necessary to allow relative path modules within loaded file
  // i.e. requiring ./some inside file /a/b.js needs to be resolved to /a/some
  resolveModule = function(module) {
    if (module.charAt(0) !== '.') return module;
    return path.resolve(path.dirname(targetFilePath), module);
  };

  exports = {};

  // extend global variable
  for (key in global) {
    if (!context.hasOwnProperty(key)) {
      context[key] = global[key];
    }
  }

  context.require = function(name) {
    var filePath = resolveModule(name)
      , targetModule
      ;

    targetModule = mocks[name] || require(filePath);

    children.push({
      id: filePath,
      parent: context.module,
      filename: filePath,
      loaded: true,
      // i'm sorry...
      get children() {
        throw new Error("sorry.. cuckoo is not support module children when require module");
      },
      paths: module.parent.paths
    });

    return targetModule;
  };
  context.require.resolve = function () {
    return resolveModule();
  };

  context.require.cache = require.cache;
  context.require.extensions = require.extensions;

  context.exports = exports;
  context.module = {
    exports: exports,
    filename: targetFilePath,
    id: targetFilePath,
    parent: module.parent,
    children: children
  };
  context.__filename = targetFilePath;
  context.__dirname = targetFileDir;

  vm.runInNewContext(fs.readFileSync(targetFilePath), context);

  return {
    context: context,
    private: context,
    public: exports,
    module: context.module
  };
};
