Cuckoo
=====

[![Build Status](https://travis-ci.org/nazomikan/Cuckoo.png?branch=master)](https://travis-ci.org/nazomikan/Cuckoo)

## Description
Cuckooはテストしづらいコードをテストしやすくしてくれるライブラリです。

カッコーの托卵のようにテスト対象のコードが呼ぶモジュールをモックすり替えることもできます。

また、通常テスト困難なプライベート(exportsされていない)な変数や関数にアクセスする機構をもっているため、それらのテストが容易に行えます。 この動作はactivation objectを偽物にすり替えることで可能にしています。 まるでカッコーの托卵のように。

## Usage
install cuckoo via npm first:

    npm install cuckoo

and then include it in your project with:

    var cuckoo = require('cuckoo');

## Example
target.js

    var util = require('util')
      ;

    function untestableMethod() {
      util.isArray([1, 2, 3]);
    }

    exports.testableMethod = function () {
      return 1;
    };

target-test.js

    var cuckoo = require('cuckoo')
      , assert = require('assert')
      , path = require('path')
      ;

    describe('#untestableMethod', function () {
      it('should have set the array to util#isArray', function () {
        var target
          , mock = {}
          ;

        mock.util = {
          isArray: function (ary) {
            assert.deepEqual([1, 2, 3], ary); // pass
          }
        };

        target = cuckoo.load(path.resolve(__dirname, './target.js'), mock);
        target.private.untestableMethod();
      });
    });

    describe('#testableMethod', function () {
      it('should get 1', function () {
        var target = cuckoo.load(path.resolve(__dirname, './target.js'))
          ;

        assert.equal(1, target.public.testableMethod());
      });
    });

## API
###cuckoo#load(filePath, [mocks])
@param String `filePath` テスト対象のファイルパス(absolute)

@param Object `[mocks]` `require`が呼ばれた時に差し替えられるモック

@return Object

    {
      context: "テスト対象の変数オブジェクト",
      private: "テスト対象の変数オブジェクト",
      public: "テスト対象の公開メソッド",
      module: "テスト対象のmoduleオブジェクト"
    }

## License
MIT
