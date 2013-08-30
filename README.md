Cuckoo
=====

[![Build Status](https://travis-ci.org/nazomikan/Cuckoo.png?branch=master)](https://travis-ci.org/nazomikan/Cuckoo)

![cuckoo](http://nazomikan.com/images/storage/cuckoo.jpg)

## Description
This is a library to the code that is easy to test the code hard to test.

It is also possible to secretly substitute to mock a module code under test calls as brood parasitism of the cuckoo.

In addition, cuckoo can change untestable code (the local function and local variables that are not exported to the outside) to testable.

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
          , filePath = path.resolve(__dirname, './target.js'); //filePath must be absolute
          ;

        mock.util = {
          isArray: function (ary) {
            assert.deepEqual([1, 2, 3], ary); // pass
          }
        };

        target = cuckoo.load(filePath, mock);
        target.private.untestableMethod();
      });
    });

    describe('#testableMethod', function () {
      it('should get 1', function () {
        var filePath = path.resolve(__dirname, './target.js');
          , target = cuckoo.load(filePath)
          ;

        assert.equal(1, target.public.testableMethod());
      });
    });

## API
###cuckoo#load(filePath, [mocks])
@param String `filePath` File path of the test target (must be absolute)

@param Object `[mocks]` replace mock when the `require` is called

@return Object

    {
      context: "Variable object under test",
      private: "Variable object under test",
      public: "Public methods of test",
      module: "Module object under test"
    }

## License
MIT
