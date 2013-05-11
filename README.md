Cuckoo
=====

## Description
This is a library to the code that is easy to test the code hard to test.
Cuckooはテストしづらいコードをテストしやすくしてくれるライブラリです。

It is also possible to secretly substitute to mock a module code under test calls as brood parasitism of the cuckoo.
カッコーの托卵のようにテスト対象のコードが呼ぶモジュールをモックすり替えることもできます。

In addition, cuckoo can change untestable code (the local function and local variables that are not exported to the outside) to testable.

また、通常テスト困難なプライベート(exportsされていない)な変数や関数にアクセスする機構をもっているため、それらのテストが容易に行えます。 この動作はactivation objectを偽物にすり替えることで可能にしています。 まるでカッコーの托卵のように。

## Usage
install cuckoo via npm first:

    npm install cuckoo

and then include it in your project with:
 
    var cuckoo = require('cuckoo');

## Example
target.js

    var util = require('util');

    function untestableMethod() {
        util.isArray([1, 2, 3]);
    }

    exports.testableMethod() {
        return 1;
    }

target-test.js

    var cuckoo = require('cuckoo'),
        assert = require('assert');

    describe('#untestableMethod', function () {
        it('should have set the array to util#isArray', function () {
            var target,
                expect = [1, 2, 3],
                mock = {};

            mock.util = {
                isArray: function (ary) {
                    assert.deepEqual([1, 2, 3], ary); // pass
                }
            };

            target = cuckoo.load('./target.js', mock),
            target.private.untestableMethod();
        });
    });

    describe('#testableMethod', function () {
        it('should get 1', function () {
            var target = cuckoo.load('./target.js');

            assert.equal(1, target.public.testableMethod());
        });
    });

## API
###cuckoo#load(filePath, [mocks])
@param String `filePath`
File path of the test target
テスト対象のファイルパス

@param Object `[mocks]`
replace mock when the `require` is called
`require`が呼ばれた時に差し替えられるモック

@return Object

    {
        context: "Variable object under test / テスト対象の変数オブジェクト",
        private: "Variable object under test / テスト対象の変数オブジェクト",
        public: "Public methods of test / テスト対象の公開メソッド",
        module: "Module object under test / テスト対象のmoduleオブジェクト"
    }

## License
MIT
