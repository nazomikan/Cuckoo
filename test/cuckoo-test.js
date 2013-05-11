var assert = require('assert')
  , cuckoo = require('../cuckoo.js')
  , path = require('path')
  ;

describe('cuckoo', function () {
  describe('__dirname', function () {
    it('should get correct dirname', function () {
      var target = cuckoo.load('./target.js')
        , expect = path.resolve(__dirname)
        , actual
        ;

      actual = target.private.getDirname();
      assert.equal(actual, expect);
    });
  });

  describe('__filename', function () {
    it('should get correct filename', function () {
      var target = cuckoo.load('./target.js')
        , expect = path.resolve(__dirname, './target.js')
        , actual
        ;

      actual = target.private.getFilename();
      assert.equal(actual, expect);
    });
  });

  describe('exports', function () {
    it('should be able to access to public method', function () {
      var target = cuckoo.load('./target.js')
        , expect = "a"
        , actual
        ;

      actual = target.public.publicMethod1();
      assert.equal(actual, expect);
    });
  });

  describe('module', function () {
    it('should be able to access to public method', function () {
      var target = cuckoo.load('./target.js')
        , expect = "b"
        , actual
        ;

      actual = target.public.publicMethod2();
      assert.equal(actual, expect);
    });

    describe('when access to module.parent', function () {
      it('should get this module', function () {
        var target = cuckoo.load('./target.js')
          , actual
          ;

        actual = target.public.getParentModule();
        assert.strictEqual(actual, module);
      });
    });

    describe('when access to module.children', function () {
      it('should get child modules', function () {
        var target = cuckoo.load('./target.js')
          , children = target.public.getChild()
          , child1Path = path.resolve(__dirname, './child1.js')
          , child2Path = path.resolve(__dirname, './child2.js')
          ;

        assert.equal(child1Path, children[0].id);
        assert.equal(child2Path, children[1].id);
        assert.equal(child1Path, children[0].filename);
        assert.equal(child2Path, children[1].filename);
        assert.equal(target.module.id, children[0].parent.id);
      });
    });
  });

  describe('global properties', function () {
    it('should have some global properties', function () {
      var context = cuckoo.load('./target.js').context
        ;

      assert.ok(context.hasOwnProperty('setTimeout'));
      assert.ok(context.hasOwnProperty('clearTimeout'));
      assert.ok(context.hasOwnProperty('setInterval'));
      assert.ok(context.hasOwnProperty('clearInterval'));
      assert.ok(context.hasOwnProperty('process'));
      assert.ok(context.hasOwnProperty('Buffer'));
      assert.ok(context.hasOwnProperty('console'));
    });
  });

  describe('mock', function () {
    describe('when set util mock', function () {
      it('should have replaced the mock and util', function () {
        var mock = {
            'util': {
              isArray: function (ary) {
                assert.deepEqual([1, 2, 3], ary);
              }
            }
          }
          , target = cuckoo.load('./target.js', mock)
          ;

        target.public.useIsArray();
      });
    });
  });
});
