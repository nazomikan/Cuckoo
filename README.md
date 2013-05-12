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

    exports.testableMethod() {
      return 1;
    }

target-test.js

    var cuckoo = require('cuckoo')
      , assert = require('assert')
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

        target = cuckoo.load('./target.js', mock);
        target.private.untestableMethod();
      });
    });

    describe('#testableMethod', function () {
      it('should get 1', function () {
        var target = cuckoo.load('./target.js')
          ;

        assert.equal(1, target.public.testableMethod());
      });
    });

## API
###cuckoo#load(filePath, [mocks])
@param String `filePath` File path of the test target

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
