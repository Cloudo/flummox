'use strict';

var _Flux = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createSerializableStore(serializedState) {
  return function (_Store) {
    _inherits(SerializableStore, _Store);

    function SerializableStore() {
      _classCallCheck(this, SerializableStore);

      return _possibleConstructorReturn(this, _Store.apply(this, arguments));
    }

    SerializableStore.serialize = function serialize() {
      return serializedState;
    };

    SerializableStore.deserialize = function deserialize(stateString) {
      return {
        stateString: stateString,
        deserialized: true
      };
    };

    return SerializableStore;
  }(_Flux.Store);
}

describe('Flux', function () {

  describe('#createStore()', function () {
    it('throws if key already exists', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store2) {
        _inherits(TestStore, _Store2);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store2.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.createStore.bind(flux, 'ExampleStore', TestStore)).to['throw']('You\'ve attempted to create multiple stores with key ExampleStore. ' + 'Keys must be unique.');
    });

    it('throws if Store is not a prototype of class', function () {
      var flux = new _Flux.Flux();

      var ForgotToExtendStore = function ForgotToExtendStore() {
        _classCallCheck(this, ForgotToExtendStore);
      };

      expect(flux.createStore.bind(flux, 'Flux', ForgotToExtendStore)).to['throw']('You\'ve attempted to create a store from the class ' + 'ForgotToExtendStore, which does not have the base Store class in its ' + 'prototype chain. Make sure you\'re using the `extends` keyword: ' + '`class ForgotToExtendStore extends Store { ... }`');
    });

    it('registers store\'s handler with central dispatcher', function () {
      var ExampleStore = function (_Store3) {
        _inherits(ExampleStore, _Store3);

        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          return _possibleConstructorReturn(this, _Store3.apply(this, arguments));
        }

        return ExampleStore;
      }(_Flux.Store);

      var spy1 = _sinon2['default'].spy();
      var spy2 = _sinon2['default'].spy();

      ExampleStore.prototype.foo = 'bar';
      ExampleStore.prototype.handler = function (_payload) {
        spy1(_payload);
        spy2(this.foo);
      };

      var flux = new _Flux.Flux();
      flux.createStore('ExampleStore', ExampleStore);

      var payload = 'foobar';
      flux.dispatch('actionId', payload);
      expect(spy1.getCall(0).args[0].body).to.equal('foobar');
      expect(spy2.calledWith('bar')).to.be['true'];
    });

    it('returns the created store instance', function () {
      var ExampleStore = function (_Store4) {
        _inherits(ExampleStore, _Store4);

        function ExampleStore() {
          _classCallCheck(this, ExampleStore);

          return _possibleConstructorReturn(this, _Store4.apply(this, arguments));
        }

        return ExampleStore;
      }(_Flux.Store);

      var flux = new _Flux.Flux();
      var store = flux.createStore('ExampleStore', ExampleStore);
      expect(store).to.be.an.instanceOf(ExampleStore);
    });
  });

  describe('#getStore()', function () {
    it('retrieves store for key', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store5) {
        _inherits(TestStore, _Store5);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store5.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.getStore('ExampleStore')).to.be.an.instanceOf(_Flux.Store);
      expect(flux.getStore('NonexistentStore')).to.be.undefined;
    });
  });

  describe('#removeStore()', function () {
    it('throws if key does not exist', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store6) {
        _inherits(TestStore, _Store6);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store6.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      flux.createStore('ExampleStore', TestStore);
      expect(flux.removeStore.bind(flux, 'NonexistentStore')).to['throw']('You\'ve attempted to remove store with key NonexistentStore which does not exist.');
    });

    it('deletes store instance', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store7) {
        _inherits(TestStore, _Store7);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store7.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      var store = flux.createStore('ExampleStore', TestStore);
      expect(flux.dispatcher.$Dispatcher_callbacks[store._token]).to.be['function'];
      flux.removeStore('ExampleStore');
      expect(flux._stores.ExampleStore).to.be.undefined;
      expect(flux.dispatcher.$Dispatcher_callbacks[store._token]).to.be.undefined;
    });
  });

  describe('#createActions()', function () {
    it('throws if key already exists', function () {
      var TestActions = function (_Actions) {
        _inherits(TestActions, _Actions);

        function TestActions() {
          _classCallCheck(this, TestActions);

          return _possibleConstructorReturn(this, _Actions.apply(this, arguments));
        }

        return TestActions;
      }(_Flux.Actions);

      var flux = new _Flux.Flux();
      flux.createActions('ExampleActions', TestActions);

      expect(flux.createActions.bind(flux, 'ExampleActions', _Flux.Actions)).to['throw']('You\'ve attempted to create multiple actions with key ExampleActions. ' + 'Keys must be unique.');
    });

    it('throws if Actions is a class without base Actions class in its prototype chain', function () {
      var flux = new _Flux.Flux();

      var ForgotToExtendActions = function ForgotToExtendActions() {
        _classCallCheck(this, ForgotToExtendActions);
      };

      expect(flux.createActions.bind(flux, 'Flux', ForgotToExtendActions)).to['throw']('You\'ve attempted to create actions from the class ' + 'ForgotToExtendActions, which does not have the base Actions class ' + 'in its prototype chain. Make sure you\'re using the `extends` ' + 'keyword: `class ForgotToExtendActions extends Actions { ... }`');
    });

    it('accepts plain old JavaScript object', function () {
      var flux = new _Flux.Flux();

      flux.createActions('foobar', {
        foo: function foo() {
          return 'bar';
        },
        bar: function bar() {
          return 'baz';
        }
      });

      expect(flux.getActions('foobar')).to.be.an['instanceof'](_Flux.Actions);
      expect(flux.getActions('foobar').foo()).to.equal('bar');
      expect(flux.getActions('foobar').bar()).to.equal('baz');
    });

    it('returns the created action\'s instance', function () {
      var TestActions = function (_Actions2) {
        _inherits(TestActions, _Actions2);

        function TestActions() {
          _classCallCheck(this, TestActions);

          return _possibleConstructorReturn(this, _Actions2.apply(this, arguments));
        }

        return TestActions;
      }(_Flux.Actions);

      var flux = new _Flux.Flux();
      var actions = flux.createActions('TestActions', TestActions);
      expect(actions).to.be.an.instanceOf(TestActions);
    });
  });

  describe('#getActions()', function () {
    var TestActions = function (_Actions3) {
      _inherits(TestActions, _Actions3);

      function TestActions() {
        _classCallCheck(this, TestActions);

        return _possibleConstructorReturn(this, _Actions3.apply(this, arguments));
      }

      return TestActions;
    }(_Flux.Actions);

    it('retrieves actions for key', function () {
      var flux = new _Flux.Flux();
      flux.createActions('TestActions', TestActions);

      expect(flux.getActions('TestActions')).to.be.an.instanceOf(_Flux.Actions);
      expect(flux.getActions('NonexistentActions')).to.be.undefined;
    });
  });

  describe('#getActionIds() / #getConstants()', function () {
    var TestActions = function (_Actions4) {
      _inherits(TestActions, _Actions4);

      function TestActions() {
        _classCallCheck(this, TestActions);

        return _possibleConstructorReturn(this, _Actions4.apply(this, arguments));
      }

      TestActions.prototype.getFoo = function getFoo() {};

      return TestActions;
    }(_Flux.Actions);

    it('retrives ids of actions for key', function () {
      var flux = new _Flux.Flux();
      flux.createActions('TestActions', TestActions);

      expect(flux.getActionIds('TestActions').getFoo).to.be.a('string');
      expect(flux.getActionIds('NonexistentActions')).to.be.undefined;

      expect(flux.getConstants('TestActions').getFoo).to.be.a('string');
      expect(flux.getConstants('NonexistentActions')).to.be.undefined;
    });
  });

  describe('#removeActions()', function () {
    it('throws if key does not exist', function () {
      var flux = new _Flux.Flux();

      var TestActions = function (_Actions5) {
        _inherits(TestActions, _Actions5);

        function TestActions() {
          _classCallCheck(this, TestActions);

          return _possibleConstructorReturn(this, _Actions5.apply(this, arguments));
        }

        return TestActions;
      }(_Flux.Actions);

      flux.createActions('TestActions', TestActions);
      expect(flux.removeActions.bind(flux, 'NonexistentActions')).to['throw']('You\'ve attempted to remove actions with key NonexistentActions which does not exist.');
    });

    it('deletes actions instance', function () {
      var flux = new _Flux.Flux();

      var TestActions = function (_Store8) {
        _inherits(TestActions, _Store8);

        function TestActions() {
          _classCallCheck(this, TestActions);

          return _possibleConstructorReturn(this, _Store8.apply(this, arguments));
        }

        return TestActions;
      }(_Flux.Store);

      flux.createStore('TestActions', TestActions);
      flux.removeStore('TestActions');
      expect(flux._actions.TestActions).to.be.undefined;
    });
  });

  describe('#getAllActionIds() / #getAllConstants()', function () {
    var TestFooActions = function (_Actions6) {
      _inherits(TestFooActions, _Actions6);

      function TestFooActions() {
        _classCallCheck(this, TestFooActions);

        return _possibleConstructorReturn(this, _Actions6.apply(this, arguments));
      }

      TestFooActions.prototype.getFoo = function getFoo() {};

      TestFooActions.prototype.getBar = function getBar() {};

      return TestFooActions;
    }(_Flux.Actions);

    var TestBarActions = function (_Actions7) {
      _inherits(TestBarActions, _Actions7);

      function TestBarActions() {
        _classCallCheck(this, TestBarActions);

        return _possibleConstructorReturn(this, _Actions7.apply(this, arguments));
      }

      TestBarActions.prototype.getFoo = function getFoo() {};

      TestBarActions.prototype.getBar = function getBar() {};

      return TestBarActions;
    }(_Flux.Actions);

    it('retrives ids of all actions', function () {
      var flux = new _Flux.Flux();
      flux.createActions('TestFooActions', TestFooActions);
      flux.createActions('TestBarActions', TestBarActions);

      expect(flux.getAllActionIds()).to.be.an('array');
      expect(flux.getAllActionIds()[0]).to.be.a('string');
      expect(flux.getAllActionIds()).to.have.length(4);

      expect(flux.getAllConstants()).to.be.an('array');
      expect(flux.getAllConstants()[0]).to.be.a('string');
      expect(flux.getAllConstants()).to.have.length(4);
    });
  });

  describe('#dispatch()', function () {

    it('delegates to dispatcher', function () {
      var flux = new _Flux.Flux();
      var dispatch = _sinon2['default'].spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = 'actionId';

      flux.dispatch(actionId, 'foobar');

      expect(dispatch.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: 'foobar'
      });
    });

    it('emits dispatch event', function () {
      var flux = new _Flux.Flux();
      var listener = _sinon2['default'].spy();

      flux.addListener('dispatch', listener);

      var actionId = 'actionId';

      flux.dispatch(actionId, 'foobar');

      expect(listener.calledOnce).to.be['true'];
      expect(listener.firstCall.args[0]).to.deep.equal({
        actionId: actionId,
        body: 'foobar'
      });
    });
  });

  describe('#dispatchAsync()', function () {

    it('delegates to dispatcher', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var flux, dispatch, actionId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              flux = new _Flux.Flux();
              dispatch = _sinon2['default'].spy();

              flux.dispatcher = { dispatch: dispatch };
              actionId = 'actionId';
              _context.next = 6;
              return flux.dispatchAsync(actionId, Promise.resolve('foobar'));

            case 6:

              expect(dispatch.callCount).to.equal(2);
              expect(dispatch.firstCall.args[0]).to.deep.equal({
                actionId: actionId,
                async: 'begin'
              });
              expect(dispatch.secondCall.args[0]).to.deep.equal({
                actionId: actionId,
                body: 'foobar',
                async: 'success'
              });

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })));

    it('emits dispatch event', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var flux, listener, actionId;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              flux = new _Flux.Flux();
              listener = _sinon2['default'].spy();


              flux.addListener('dispatch', listener);

              actionId = 'actionId';
              _context2.next = 6;
              return flux.dispatchAsync(actionId, Promise.resolve('foobar'));

            case 6:

              expect(listener.calledTwice).to.be['true'];
              expect(listener.firstCall.args[0]).to.deep.equal({
                actionId: actionId,
                async: 'begin'
              });
              expect(listener.secondCall.args[0]).to.deep.equal({
                actionId: actionId,
                async: 'success',
                body: 'foobar'
              });

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })));

    it('resolves to value of given promise', function (done) {
      var flux = new _Flux.Flux();
      var dispatch = _sinon2['default'].spy();
      flux.dispatcher = { dispatch: dispatch };
      var actionId = 'actionId';

      expect(flux.dispatchAsync(actionId, Promise.resolve('foobar'))).to.eventually.equal('foobar').notify(done);
    });

    it('dispatches with error if promise rejects', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var flux, dispatch, actionId, error;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              flux = new _Flux.Flux();
              dispatch = _sinon2['default'].spy();

              flux.dispatcher = { dispatch: dispatch };
              actionId = 'actionId';
              error = new Error('error');
              _context3.next = 7;
              return flux.dispatchAsync(actionId, Promise.reject(error));

            case 7:

              expect(dispatch.callCount).to.equal(2);
              expect(dispatch.firstCall.args[0]).to.deep.equal({
                actionId: actionId,
                async: 'begin'
              });
              expect(dispatch.secondCall.args[0]).to.deep.equal({
                actionId: actionId,
                error: error,
                async: 'failure'
              });

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));

    it('emit errors that occur as result of dispatch', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
      var ExampleStore, flux, listener, actionId, store;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              ExampleStore = function (_Store9) {
                _inherits(ExampleStore, _Store9);

                function ExampleStore() {
                  _classCallCheck(this, ExampleStore);

                  return _possibleConstructorReturn(this, _Store9.apply(this, arguments));
                }

                return ExampleStore;
              }(_Flux.Store);

              flux = new _Flux.Flux();
              listener = _sinon2['default'].spy();

              flux.addListener('error', listener);

              actionId = 'actionId';
              store = flux.createStore('example', ExampleStore);


              store.registerAsync(actionId, null, function () {
                throw new Error('success error');
              }, function () {
                throw new Error('failure error');
              });

              _context4.next = 9;
              return expect(flux.dispatchAsync(actionId, Promise.resolve('foobar'))).to.be.rejectedWith('success error');

            case 9:
              expect(listener.calledOnce).to.be['true'];
              expect(listener.firstCall.args[0].message).to.equal('success error');

              _context4.next = 13;
              return expect(flux.dispatchAsync(actionId, Promise.reject(new Error('foobar')))).to.be.rejectedWith('failure error');

            case 13:
              expect(listener.calledTwice).to.be['true'];
              expect(listener.secondCall.args[0].message).to.equal('failure error');

            case 15:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    })));
  });

  describe('#removeAllStoreListeners', function () {
    it('removes all listeners from stores', function () {
      var TestStore = function (_Store10) {
        _inherits(TestStore, _Store10);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store10.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      var flux = new _Flux.Flux();
      var storeA = flux.createStore('storeA', TestStore);
      var storeB = flux.createStore('storeB', TestStore);

      var listener = function listener() {};

      storeA.addListener('change', listener);
      storeA.addListener('change', listener);
      storeB.addListener('change', listener);
      storeB.addListener('change', listener);

      expect(storeA.listeners('change').length).to.equal(2);
      expect(storeB.listeners('change').length).to.equal(2);

      flux.removeAllStoreListeners();

      expect(storeA.listeners('change').length).to.equal(0);
      expect(storeB.listeners('change').length).to.equal(0);
    });
  });

  describe('#serialize()', function () {

    it('returns state of all the stores as a JSON string', function () {
      var flux = new _Flux.Flux();

      flux.createStore('foo', createSerializableStore('foo state'));
      flux.createStore('bar', createSerializableStore('bar state'));
      flux.createStore('baz', createSerializableStore('baz state'));

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: 'foo state',
        bar: 'bar state',
        baz: 'baz state'
      });
    });

    it('ignores stores whose classes do not implement .serialize()', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store11) {
        _inherits(TestStore, _Store11);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store11.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      flux.createStore('foo', createSerializableStore('foo state'));
      flux.createStore('bar', createSerializableStore('bar state'));
      flux.createStore('baz', TestStore);

      expect(JSON.parse(flux.serialize())).to.deep.equal({
        foo: 'foo state',
        bar: 'bar state'
      });
    });

    it('warns if any store classes .serialize() returns a non-string', function () {
      var flux = new _Flux.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      flux.createStore('foo', createSerializableStore({}));
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal('The store with key \'foo\' was not serialized because the static ' + 'method `SerializableStore.serialize()` returned a non-string with ' + 'type \'object\'.');

      console.warn.restore();
    });

    it('warns and skips stores whose classes do not implement .deserialize()', function () {
      var flux = new _Flux.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      var TestStore = function (_Store12) {
        _inherits(TestStore, _Store12);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store12.apply(this, arguments));
        }

        TestStore.serialize = function serialize() {
          return 'state string';
        };

        return TestStore;
      }(_Flux.Store);

      flux.createStore('test', TestStore);
      flux.serialize();

      expect(warn.firstCall.args[0]).to.equal('The class `TestStore` has a `serialize()` method, but no ' + 'corresponding `deserialize()` method.');

      console.warn.restore();
    });
  });

  describe('#deserialize()', function () {

    it('converts a serialized string into state and uses it to replace state of stores', function () {
      var flux = new _Flux.Flux();

      flux.createStore('foo', createSerializableStore());
      flux.createStore('bar', createSerializableStore());
      flux.createStore('baz', createSerializableStore());

      flux.deserialize('{\n        "foo": "foo state",\n        "bar": "bar state",\n        "baz": "baz state"\n      }');

      var fooStore = flux.getStore('foo');
      var barStore = flux.getStore('bar');
      var bazStore = flux.getStore('baz');

      expect(fooStore.state.stateString).to.equal('foo state');
      expect(fooStore.state.deserialized).to.be['true'];
      expect(barStore.state.stateString).to.equal('bar state');
      expect(barStore.state.deserialized).to.be['true'];
      expect(bazStore.state.stateString).to.equal('baz state');
      expect(bazStore.state.deserialized).to.be['true'];
    });

    it('warns and skips if passed string is invalid JSON', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store13) {
        _inherits(TestStore, _Store13);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store13.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      flux.createStore('foo', TestStore);

      expect(flux.deserialize.bind(flux, 'not JSON')).to['throw']('Invalid value passed to `Flux#deserialize()`: not JSON');
    });

    it('warns and skips stores whose classes do not implement .serialize()', function () {
      var flux = new _Flux.Flux();
      var warn = _sinon2['default'].spy(console, 'warn');

      var TestStore = function (_Store14) {
        _inherits(TestStore, _Store14);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store14.apply(this, arguments));
        }

        TestStore.deserialize = function deserialize() {
          return {};
        };

        return TestStore;
      }(_Flux.Store);

      flux.createStore('test', TestStore);
      flux.deserialize('{"test": "test state"}');

      expect(warn.firstCall.args[0]).to.equal('The class `TestStore` has a `deserialize()` method, but no ' + 'corresponding `serialize()` method.');

      console.warn.restore();
    });

    it('ignores stores whose classes do not implement .deserialize()', function () {
      var flux = new _Flux.Flux();

      var TestStore = function (_Store15) {
        _inherits(TestStore, _Store15);

        function TestStore() {
          _classCallCheck(this, TestStore);

          return _possibleConstructorReturn(this, _Store15.apply(this, arguments));
        }

        return TestStore;
      }(_Flux.Store);

      flux.createStore('foo', createSerializableStore());
      flux.createStore('bar', createSerializableStore());
      flux.createStore('baz', TestStore);

      flux.deserialize('{\n        "foo": "foo state",\n        "bar": "bar state",\n        "baz": "baz state"\n      }');

      var fooStore = flux.getStore('foo');
      var barStore = flux.getStore('bar');
      var bazStore = flux.getStore('baz');

      expect(fooStore.state.stateString).to.equal('foo state');
      expect(fooStore.state.deserialized).to.be['true'];
      expect(barStore.state.stateString).to.equal('bar state');
      expect(barStore.state.deserialized).to.be['true'];
      expect(bazStore.state).to.be['null'];
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vRmx1eC10ZXN0LmpzIl0sIm5hbWVzIjpbImNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlIiwic2VyaWFsaXplZFN0YXRlIiwic2VyaWFsaXplIiwiZGVzZXJpYWxpemUiLCJzdGF0ZVN0cmluZyIsImRlc2VyaWFsaXplZCIsImRlc2NyaWJlIiwiaXQiLCJmbHV4IiwiVGVzdFN0b3JlIiwiY3JlYXRlU3RvcmUiLCJleHBlY3QiLCJiaW5kIiwidG8iLCJGb3Jnb3RUb0V4dGVuZFN0b3JlIiwiRXhhbXBsZVN0b3JlIiwic3B5MSIsInNweSIsInNweTIiLCJwcm90b3R5cGUiLCJmb28iLCJoYW5kbGVyIiwiX3BheWxvYWQiLCJwYXlsb2FkIiwiZGlzcGF0Y2giLCJnZXRDYWxsIiwiYXJncyIsImJvZHkiLCJlcXVhbCIsImNhbGxlZFdpdGgiLCJiZSIsInN0b3JlIiwiYW4iLCJpbnN0YW5jZU9mIiwiZ2V0U3RvcmUiLCJ1bmRlZmluZWQiLCJyZW1vdmVTdG9yZSIsImRpc3BhdGNoZXIiLCIkRGlzcGF0Y2hlcl9jYWxsYmFja3MiLCJfdG9rZW4iLCJfc3RvcmVzIiwiVGVzdEFjdGlvbnMiLCJjcmVhdGVBY3Rpb25zIiwiRm9yZ290VG9FeHRlbmRBY3Rpb25zIiwiYmFyIiwiZ2V0QWN0aW9ucyIsImFjdGlvbnMiLCJnZXRGb28iLCJnZXRBY3Rpb25JZHMiLCJhIiwiZ2V0Q29uc3RhbnRzIiwicmVtb3ZlQWN0aW9ucyIsIl9hY3Rpb25zIiwiVGVzdEZvb0FjdGlvbnMiLCJnZXRCYXIiLCJUZXN0QmFyQWN0aW9ucyIsImdldEFsbEFjdGlvbklkcyIsImhhdmUiLCJsZW5ndGgiLCJnZXRBbGxDb25zdGFudHMiLCJhY3Rpb25JZCIsImZpcnN0Q2FsbCIsImRlZXAiLCJsaXN0ZW5lciIsImFkZExpc3RlbmVyIiwiY2FsbGVkT25jZSIsImRpc3BhdGNoQXN5bmMiLCJQcm9taXNlIiwicmVzb2x2ZSIsImNhbGxDb3VudCIsImFzeW5jIiwic2Vjb25kQ2FsbCIsImNhbGxlZFR3aWNlIiwiZXZlbnR1YWxseSIsIm5vdGlmeSIsImRvbmUiLCJlcnJvciIsIkVycm9yIiwicmVqZWN0IiwicmVnaXN0ZXJBc3luYyIsInJlamVjdGVkV2l0aCIsIm1lc3NhZ2UiLCJzdG9yZUEiLCJzdG9yZUIiLCJsaXN0ZW5lcnMiLCJyZW1vdmVBbGxTdG9yZUxpc3RlbmVycyIsIkpTT04iLCJwYXJzZSIsImJheiIsIndhcm4iLCJjb25zb2xlIiwicmVzdG9yZSIsImZvb1N0b3JlIiwiYmFyU3RvcmUiLCJiYXpTdG9yZSIsInN0YXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLHVCQUFULENBQWlDQyxlQUFqQyxFQUFrRDtBQUNoRDtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQSxzQkFDU0MsU0FEVCx3QkFDcUI7QUFDakIsYUFBT0QsZUFBUDtBQUNELEtBSEg7O0FBQUEsc0JBSVNFLFdBSlQsd0JBSXFCQyxXQUpyQixFQUlrQztBQUM5QixhQUFPO0FBQ0xBLGdDQURLO0FBRUxDLHNCQUFjO0FBRlQsT0FBUDtBQUlELEtBVEg7O0FBQUE7QUFBQTtBQVdEOztBQUVEQyxTQUFTLE1BQVQsRUFBaUIsWUFBTTs7QUFFckJBLFdBQVMsZ0JBQVQsRUFBMkIsWUFBTTtBQUMvQkMsT0FBRyw4QkFBSCxFQUFtQyxZQUFNO0FBQ3ZDLFVBQU1DLE9BQU8sZ0JBQWI7O0FBRHVDLFVBRWpDQyxTQUZpQztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUl2Q0QsV0FBS0UsV0FBTCxDQUFpQixjQUFqQixFQUFpQ0QsU0FBakM7QUFDQUUsYUFBT0gsS0FBS0UsV0FBTCxDQUFpQkUsSUFBakIsQ0FBc0JKLElBQXRCLEVBQTRCLGNBQTVCLEVBQTRDQyxTQUE1QyxDQUFQLEVBQStESSxFQUEvRCxVQUNFLHdFQUNBLHNCQUZGO0FBSUQsS0FURDs7QUFXQU4sT0FBRyw2Q0FBSCxFQUFrRCxZQUFNO0FBQ3RELFVB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LEtBdkJEO0FBeUJELEdBckZEO0FBdUZELENBbmlCRCIsImZpbGUiOiJGbHV4LXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGbHV4LCBTdG9yZSwgQWN0aW9ucyB9IGZyb20gJy4uL0ZsdXgnO1xuaW1wb3J0IHNpbm9uIGZyb20gJ3Npbm9uJztcblxuZnVuY3Rpb24gY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoc2VyaWFsaXplZFN0YXRlKSB7XG4gIHJldHVybiBjbGFzcyBTZXJpYWxpemFibGVTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBzdGF0aWMgc2VyaWFsaXplKCkge1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZWRTdGF0ZTtcbiAgICB9XG4gICAgc3RhdGljIGRlc2VyaWFsaXplKHN0YXRlU3RyaW5nKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0ZVN0cmluZyxcbiAgICAgICAgZGVzZXJpYWxpemVkOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuZGVzY3JpYmUoJ0ZsdXgnLCAoKSA9PiB7XG5cbiAgZGVzY3JpYmUoJyNjcmVhdGVTdG9yZSgpJywgKCkgPT4ge1xuICAgIGl0KCd0aHJvd3MgaWYga2V5IGFscmVhZHkgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjbGFzcyBUZXN0U3RvcmUgZXh0ZW5kcyBTdG9yZSB7fVxuXG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdFeGFtcGxlU3RvcmUnLCBUZXN0U3RvcmUpO1xuICAgICAgZXhwZWN0KGZsdXguY3JlYXRlU3RvcmUuYmluZChmbHV4LCAnRXhhbXBsZVN0b3JlJywgVGVzdFN0b3JlKSkudG8udGhyb3coXG4gICAgICAgICdZb3VcXCd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIG11bHRpcGxlIHN0b3JlcyB3aXRoIGtleSBFeGFtcGxlU3RvcmUuICdcbiAgICAgICsgJ0tleXMgbXVzdCBiZSB1bmlxdWUuJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3MgaWYgU3RvcmUgaXMgbm90IGEgcHJvdG90eXBlIG9mIGNsYXNzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjbGFzcyBGb3Jnb3RUb0V4dGVuZFN0b3JlIHt9XG5cbiAgICAgIGV4cGVjdChmbHV4LmNyZWF0ZVN0b3JlLmJpbmQoZmx1eCwgJ0ZsdXgnLCBGb3Jnb3RUb0V4dGVuZFN0b3JlKSkudG8udGhyb3coXG4gICAgICAgICdZb3VcXCd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIGEgc3RvcmUgZnJvbSB0aGUgY2xhc3MgJ1xuICAgICAgKyAnRm9yZ290VG9FeHRlbmRTdG9yZSwgd2hpY2ggZG9lcyBub3QgaGF2ZSB0aGUgYmFzZSBTdG9yZSBjbGFzcyBpbiBpdHMgJ1xuICAgICAgKyAncHJvdG90eXBlIGNoYWluLiBNYWtlIHN1cmUgeW91XFwncmUgdXNpbmcgdGhlIGBleHRlbmRzYCBrZXl3b3JkOiAnXG4gICAgICArICdgY2xhc3MgRm9yZ290VG9FeHRlbmRTdG9yZSBleHRlbmRzIFN0b3JlIHsgLi4uIH1gJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZWdpc3RlcnMgc3RvcmVcXCdzIGhhbmRsZXIgd2l0aCBjZW50cmFsIGRpc3BhdGNoZXInLCAoKSA9PiB7XG4gICAgICBjbGFzcyBFeGFtcGxlU3RvcmUgZXh0ZW5kcyBTdG9yZSB7fVxuXG4gICAgICBjb25zdCBzcHkxID0gc2lub24uc3B5KCk7XG4gICAgICBjb25zdCBzcHkyID0gc2lub24uc3B5KCk7XG5cbiAgICAgIEV4YW1wbGVTdG9yZS5wcm90b3R5cGUuZm9vID0gJ2Jhcic7XG4gICAgICBFeGFtcGxlU3RvcmUucHJvdG90eXBlLmhhbmRsZXIgPSBmdW5jdGlvbihfcGF5bG9hZCkge1xuICAgICAgICBzcHkxKF9wYXlsb2FkKTtcbiAgICAgICAgc3B5Mih0aGlzLmZvbyk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ0V4YW1wbGVTdG9yZScsIEV4YW1wbGVTdG9yZSk7XG5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSAnZm9vYmFyJztcbiAgICAgIGZsdXguZGlzcGF0Y2goJ2FjdGlvbklkJywgcGF5bG9hZCk7XG4gICAgICBleHBlY3Qoc3B5MS5nZXRDYWxsKDApLmFyZ3NbMF0uYm9keSkudG8uZXF1YWwoJ2Zvb2JhcicpO1xuICAgICAgZXhwZWN0KHNweTIuY2FsbGVkV2l0aCgnYmFyJykpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgY3JlYXRlZCBzdG9yZSBpbnN0YW5jZScsICgpID0+IHtcbiAgICAgIGNsYXNzIEV4YW1wbGVTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3Qgc3RvcmUgPSBmbHV4LmNyZWF0ZVN0b3JlKCdFeGFtcGxlU3RvcmUnLCBFeGFtcGxlU3RvcmUpO1xuICAgICAgZXhwZWN0KHN0b3JlKS50by5iZS5hbi5pbnN0YW5jZU9mKEV4YW1wbGVTdG9yZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0U3RvcmUoKScsICgpID0+IHtcbiAgICBpdCgncmV0cmlldmVzIHN0b3JlIGZvciBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ0V4YW1wbGVTdG9yZScsIFRlc3RTdG9yZSk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRTdG9yZSgnRXhhbXBsZVN0b3JlJykpLnRvLmJlLmFuLmluc3RhbmNlT2YoU3RvcmUpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0U3RvcmUoJ05vbmV4aXN0ZW50U3RvcmUnKSkudG8uYmUudW5kZWZpbmVkO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI3JlbW92ZVN0b3JlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Rocm93cyBpZiBrZXkgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ0V4YW1wbGVTdG9yZScsIFRlc3RTdG9yZSk7XG4gICAgICBleHBlY3QoZmx1eC5yZW1vdmVTdG9yZS5iaW5kKGZsdXgsICdOb25leGlzdGVudFN0b3JlJykpLnRvLnRocm93KFxuICAgICAgICAnWW91XFwndmUgYXR0ZW1wdGVkIHRvIHJlbW92ZSBzdG9yZSB3aXRoIGtleSBOb25leGlzdGVudFN0b3JlIHdoaWNoIGRvZXMgbm90IGV4aXN0LidcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGVsZXRlcyBzdG9yZSBpbnN0YW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY2xhc3MgVGVzdFN0b3JlIGV4dGVuZHMgU3RvcmUge31cblxuICAgICAgbGV0IHN0b3JlID0gZmx1eC5jcmVhdGVTdG9yZSgnRXhhbXBsZVN0b3JlJywgVGVzdFN0b3JlKTtcbiAgICAgIGV4cGVjdChmbHV4LmRpc3BhdGNoZXIuJERpc3BhdGNoZXJfY2FsbGJhY2tzW3N0b3JlLl90b2tlbl0pLnRvLmJlLmZ1bmN0aW9uO1xuICAgICAgZmx1eC5yZW1vdmVTdG9yZSgnRXhhbXBsZVN0b3JlJyk7XG4gICAgICBleHBlY3QoZmx1eC5fc3RvcmVzLkV4YW1wbGVTdG9yZSkudG8uYmUudW5kZWZpbmVkO1xuICAgICAgZXhwZWN0KGZsdXguZGlzcGF0Y2hlci4kRGlzcGF0Y2hlcl9jYWxsYmFja3Nbc3RvcmUuX3Rva2VuXSkudG8uYmUudW5kZWZpbmVkO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI2NyZWF0ZUFjdGlvbnMoKScsICgpID0+IHtcbiAgICBpdCgndGhyb3dzIGlmIGtleSBhbHJlYWR5IGV4aXN0cycsICgpID0+IHtcbiAgICAgIGNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7fVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnRXhhbXBsZUFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmNyZWF0ZUFjdGlvbnMuYmluZChmbHV4LCAnRXhhbXBsZUFjdGlvbnMnLCBBY3Rpb25zKSkudG8udGhyb3coXG4gICAgICAgICdZb3VcXCd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIG11bHRpcGxlIGFjdGlvbnMgd2l0aCBrZXkgRXhhbXBsZUFjdGlvbnMuICdcbiAgICAgICsgJ0tleXMgbXVzdCBiZSB1bmlxdWUuJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3MgaWYgQWN0aW9ucyBpcyBhIGNsYXNzIHdpdGhvdXQgYmFzZSBBY3Rpb25zIGNsYXNzIGluIGl0cyBwcm90b3R5cGUgY2hhaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIEZvcmdvdFRvRXh0ZW5kQWN0aW9ucyB7fVxuXG4gICAgICBleHBlY3QoZmx1eC5jcmVhdGVBY3Rpb25zLmJpbmQoZmx1eCwgJ0ZsdXgnLCBGb3Jnb3RUb0V4dGVuZEFjdGlvbnMpKVxuICAgICAgICAudG8udGhyb3coXG4gICAgICAgICAgJ1lvdVxcJ3ZlIGF0dGVtcHRlZCB0byBjcmVhdGUgYWN0aW9ucyBmcm9tIHRoZSBjbGFzcyAnXG4gICAgICAgICsgJ0ZvcmdvdFRvRXh0ZW5kQWN0aW9ucywgd2hpY2ggZG9lcyBub3QgaGF2ZSB0aGUgYmFzZSBBY3Rpb25zIGNsYXNzICdcbiAgICAgICAgKyAnaW4gaXRzIHByb3RvdHlwZSBjaGFpbi4gTWFrZSBzdXJlIHlvdVxcJ3JlIHVzaW5nIHRoZSBgZXh0ZW5kc2AgJ1xuICAgICAgICArICdrZXl3b3JkOiBgY2xhc3MgRm9yZ290VG9FeHRlbmRBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7IC4uLiB9YCdcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgnYWNjZXB0cyBwbGFpbiBvbGQgSmF2YVNjcmlwdCBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgZmx1eC5jcmVhdGVBY3Rpb25zKCdmb29iYXInLCB7XG4gICAgICAgIGZvbygpIHtcbiAgICAgICAgICByZXR1cm4gJ2Jhcic7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYmFyKCkge1xuICAgICAgICAgIHJldHVybiAnYmF6JztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmdldEFjdGlvbnMoJ2Zvb2JhcicpKS50by5iZS5hbi5pbnN0YW5jZW9mKEFjdGlvbnMpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0QWN0aW9ucygnZm9vYmFyJykuZm9vKCkpLnRvLmVxdWFsKCdiYXInKTtcbiAgICAgIGV4cGVjdChmbHV4LmdldEFjdGlvbnMoJ2Zvb2JhcicpLmJhcigpKS50by5lcXVhbCgnYmF6Jyk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgY3JlYXRlZCBhY3Rpb25cXCdzIGluc3RhbmNlJywgKCkgPT4ge1xuICAgICAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHt9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3QgYWN0aW9ucyA9IGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG4gICAgICBleHBlY3QoYWN0aW9ucykudG8uYmUuYW4uaW5zdGFuY2VPZihUZXN0QWN0aW9ucyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0QWN0aW9ucygpJywgKCkgPT4ge1xuICAgIGNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7fVxuXG4gICAgaXQoJ3JldHJpZXZlcyBhY3Rpb25zIGZvciBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmdldEFjdGlvbnMoJ1Rlc3RBY3Rpb25zJykpLnRvLmJlLmFuLmluc3RhbmNlT2YoQWN0aW9ucyk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRBY3Rpb25zKCdOb25leGlzdGVudEFjdGlvbnMnKSkudG8uYmUudW5kZWZpbmVkO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0QWN0aW9uSWRzKCkgLyAjZ2V0Q29uc3RhbnRzKCknLCAoKSA9PiB7XG4gICAgY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgIGdldEZvbygpIHt9XG4gICAgfVxuXG4gICAgaXQoJ3JldHJpdmVzIGlkcyBvZiBhY3Rpb25zIGZvciBrZXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmdldEFjdGlvbklkcygnVGVzdEFjdGlvbnMnKS5nZXRGb28pLnRvLmJlLmEoJ3N0cmluZycpO1xuICAgICAgZXhwZWN0KGZsdXguZ2V0QWN0aW9uSWRzKCdOb25leGlzdGVudEFjdGlvbnMnKSkudG8uYmUudW5kZWZpbmVkO1xuXG4gICAgICBleHBlY3QoZmx1eC5nZXRDb25zdGFudHMoJ1Rlc3RBY3Rpb25zJykuZ2V0Rm9vKS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIGV4cGVjdChmbHV4LmdldENvbnN0YW50cygnTm9uZXhpc3RlbnRBY3Rpb25zJykpLnRvLmJlLnVuZGVmaW5lZDtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNyZW1vdmVBY3Rpb25zKCknLCAoKSA9PiB7XG4gICAgaXQoJ3Rocm93cyBpZiBrZXkgZG9lcyBub3QgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7XG4gICAgICB9XG5cbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEFjdGlvbnMnLCBUZXN0QWN0aW9ucyk7XG4gICAgICBleHBlY3QoZmx1eC5yZW1vdmVBY3Rpb25zLmJpbmQoZmx1eCwgJ05vbmV4aXN0ZW50QWN0aW9ucycpKS50by50aHJvdyhcbiAgICAgICAgJ1lvdVxcJ3ZlIGF0dGVtcHRlZCB0byByZW1vdmUgYWN0aW9ucyB3aXRoIGtleSBOb25leGlzdGVudEFjdGlvbnMgd2hpY2ggZG9lcyBub3QgZXhpc3QuJ1xuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCdkZWxldGVzIGFjdGlvbnMgaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RBY3Rpb25zIGV4dGVuZHMgU3RvcmUge1xuICAgICAgfVxuXG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdUZXN0QWN0aW9ucycsIFRlc3RBY3Rpb25zKTtcbiAgICAgIGZsdXgucmVtb3ZlU3RvcmUoJ1Rlc3RBY3Rpb25zJyk7XG4gICAgICBleHBlY3QoZmx1eC5fYWN0aW9ucy5UZXN0QWN0aW9ucykudG8uYmUudW5kZWZpbmVkO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI2dldEFsbEFjdGlvbklkcygpIC8gI2dldEFsbENvbnN0YW50cygpJywgKCkgPT4ge1xuICAgIGNsYXNzIFRlc3RGb29BY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7XG4gICAgICBnZXRGb28oKSB7fVxuICAgICAgZ2V0QmFyKCkge31cbiAgICB9XG5cbiAgICBjbGFzcyBUZXN0QmFyQWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgICAgZ2V0Rm9vKCkge31cbiAgICAgIGdldEJhcigpIHt9XG4gICAgfVxuXG4gICAgaXQoJ3JldHJpdmVzIGlkcyBvZiBhbGwgYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGxldCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGZsdXguY3JlYXRlQWN0aW9ucygnVGVzdEZvb0FjdGlvbnMnLCBUZXN0Rm9vQWN0aW9ucyk7XG4gICAgICBmbHV4LmNyZWF0ZUFjdGlvbnMoJ1Rlc3RCYXJBY3Rpb25zJywgVGVzdEJhckFjdGlvbnMpO1xuXG4gICAgICBleHBlY3QoZmx1eC5nZXRBbGxBY3Rpb25JZHMoKSkudG8uYmUuYW4oJ2FycmF5Jyk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRBbGxBY3Rpb25JZHMoKVswXSkudG8uYmUuYSgnc3RyaW5nJyk7XG4gICAgICBleHBlY3QoZmx1eC5nZXRBbGxBY3Rpb25JZHMoKSkudG8uaGF2ZS5sZW5ndGgoNCk7XG5cbiAgICAgIGV4cGVjdChmbHV4LmdldEFsbENvbnN0YW50cygpKS50by5iZS5hbignYXJyYXknKTtcbiAgICAgIGV4cGVjdChmbHV4LmdldEFsbENvbnN0YW50cygpWzBdKS50by5iZS5hKCdzdHJpbmcnKTtcbiAgICAgIGV4cGVjdChmbHV4LmdldEFsbENvbnN0YW50cygpKS50by5oYXZlLmxlbmd0aCg0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNkaXNwYXRjaCgpJywgKCkgPT4ge1xuXG4gICAgaXQoJ2RlbGVnYXRlcyB0byBkaXNwYXRjaGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgZmx1eC5kaXNwYXRjaGVyID0geyBkaXNwYXRjaCB9O1xuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBmbHV4LmRpc3BhdGNoKGFjdGlvbklkLCAnZm9vYmFyJyk7XG5cbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBib2R5OiAnZm9vYmFyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZW1pdHMgZGlzcGF0Y2ggZXZlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gc2lub24uc3B5KCk7XG5cbiAgICAgIGZsdXguYWRkTGlzdGVuZXIoJ2Rpc3BhdGNoJywgbGlzdGVuZXIpO1xuXG4gICAgICBjb25zdCBhY3Rpb25JZCA9ICdhY3Rpb25JZCc7XG5cbiAgICAgIGZsdXguZGlzcGF0Y2goYWN0aW9uSWQsICdmb29iYXInKTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QobGlzdGVuZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgYm9keTogJ2Zvb2JhcidcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnI2Rpc3BhdGNoQXN5bmMoKScsICgpID0+IHtcblxuICAgIGl0KCdkZWxlZ2F0ZXMgdG8gZGlzcGF0Y2hlcicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgZmx1eC5kaXNwYXRjaGVyID0geyBkaXNwYXRjaCB9O1xuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBhd2FpdCBmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVzb2x2ZSgnZm9vYmFyJykpO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guY2FsbENvdW50KS50by5lcXVhbCgyKTtcbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBhc3luYzogJ2JlZ2luJ1xuICAgICAgfSk7XG4gICAgICBleHBlY3QoZGlzcGF0Y2guc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgYWN0aW9uSWQsXG4gICAgICAgIGJvZHk6ICdmb29iYXInLFxuICAgICAgICBhc3luYzogJ3N1Y2Nlc3MnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdlbWl0cyBkaXNwYXRjaCBldmVudCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuXG4gICAgICBmbHV4LmFkZExpc3RlbmVyKCdkaXNwYXRjaCcsIGxpc3RlbmVyKTtcblxuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBhd2FpdCBmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVzb2x2ZSgnZm9vYmFyJykpO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkVHdpY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QobGlzdGVuZXIuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgYXN5bmM6ICdiZWdpbidcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KGxpc3RlbmVyLnNlY29uZENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBhc3luYzogJ3N1Y2Nlc3MnLFxuICAgICAgICBib2R5OiAnZm9vYmFyJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVzb2x2ZXMgdG8gdmFsdWUgb2YgZ2l2ZW4gcHJvbWlzZScsIGRvbmUgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgZmx1eC5kaXNwYXRjaGVyID0geyBkaXNwYXRjaCB9O1xuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBleHBlY3QoZmx1eC5kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBQcm9taXNlLnJlc29sdmUoJ2Zvb2JhcicpKSlcbiAgICAgICAgLnRvLmV2ZW50dWFsbHkuZXF1YWwoJ2Zvb2JhcicpXG4gICAgICAgIC5ub3RpZnkoZG9uZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnZGlzcGF0Y2hlcyB3aXRoIGVycm9yIGlmIHByb21pc2UgcmVqZWN0cycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBkaXNwYXRjaCA9IHNpbm9uLnNweSgpO1xuICAgICAgZmx1eC5kaXNwYXRjaGVyID0geyBkaXNwYXRjaCB9O1xuICAgICAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignZXJyb3InKTtcblxuICAgICAgYXdhaXQgZmx1eC5kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBQcm9taXNlLnJlamVjdChlcnJvcikpO1xuXG4gICAgICBleHBlY3QoZGlzcGF0Y2guY2FsbENvdW50KS50by5lcXVhbCgyKTtcbiAgICAgIGV4cGVjdChkaXNwYXRjaC5maXJzdENhbGwuYXJnc1swXSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBhc3luYzogJ2JlZ2luJ1xuICAgICAgfSk7XG4gICAgICBleHBlY3QoZGlzcGF0Y2guc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgYWN0aW9uSWQsXG4gICAgICAgIGVycm9yLFxuICAgICAgICBhc3luYzogJ2ZhaWx1cmUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdlbWl0IGVycm9ycyB0aGF0IG9jY3VyIGFzIHJlc3VsdCBvZiBkaXNwYXRjaCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY2xhc3MgRXhhbXBsZVN0b3JlIGV4dGVuZHMgU3RvcmUge31cblxuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgZmx1eC5hZGRMaXN0ZW5lcignZXJyb3InLCBsaXN0ZW5lcik7XG5cbiAgICAgIGNvbnN0IGFjdGlvbklkID0gJ2FjdGlvbklkJztcbiAgICAgIGNvbnN0IHN0b3JlID0gZmx1eC5jcmVhdGVTdG9yZSgnZXhhbXBsZScsIEV4YW1wbGVTdG9yZSk7XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyQXN5bmMoXG4gICAgICAgIGFjdGlvbklkLFxuICAgICAgICBudWxsLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdWNjZXNzIGVycm9yJyk7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWx1cmUgZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGZsdXguZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgUHJvbWlzZS5yZXNvbHZlKCdmb29iYXInKSkpXG4gICAgICAgIC50by5iZS5yZWplY3RlZFdpdGgoJ3N1Y2Nlc3MgZXJyb3InKTtcbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGxpc3RlbmVyLmZpcnN0Q2FsbC5hcmdzWzBdLm1lc3NhZ2UpLnRvLmVxdWFsKCdzdWNjZXNzIGVycm9yJyk7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChmbHV4LmRpc3BhdGNoQXN5bmMoYWN0aW9uSWQsIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignZm9vYmFyJykpKSlcbiAgICAgICAgLnRvLmJlLnJlamVjdGVkV2l0aCgnZmFpbHVyZSBlcnJvcicpO1xuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGxpc3RlbmVyLnNlY29uZENhbGwuYXJnc1swXS5tZXNzYWdlKS50by5lcXVhbCgnZmFpbHVyZSBlcnJvcicpO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVtb3ZlQWxsU3RvcmVMaXN0ZW5lcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3JlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIHN0b3JlcycsICgpID0+IHtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3Qgc3RvcmVBID0gZmx1eC5jcmVhdGVTdG9yZSgnc3RvcmVBJywgVGVzdFN0b3JlKTtcbiAgICAgIGNvbnN0IHN0b3JlQiA9IGZsdXguY3JlYXRlU3RvcmUoJ3N0b3JlQicsIFRlc3RTdG9yZSk7XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gZnVuY3Rpb24oKSB7fTtcblxuICAgICAgc3RvcmVBLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG4gICAgICBzdG9yZUEuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcbiAgICAgIHN0b3JlQi5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgc3RvcmVCLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIGV4cGVjdChzdG9yZUEubGlzdGVuZXJzKCdjaGFuZ2UnKS5sZW5ndGgpLnRvLmVxdWFsKDIpO1xuICAgICAgZXhwZWN0KHN0b3JlQi5saXN0ZW5lcnMoJ2NoYW5nZScpLmxlbmd0aCkudG8uZXF1YWwoMik7XG5cbiAgICAgIGZsdXgucmVtb3ZlQWxsU3RvcmVMaXN0ZW5lcnMoKTtcblxuICAgICAgZXhwZWN0KHN0b3JlQS5saXN0ZW5lcnMoJ2NoYW5nZScpLmxlbmd0aCkudG8uZXF1YWwoMCk7XG4gICAgICBleHBlY3Qoc3RvcmVCLmxpc3RlbmVycygnY2hhbmdlJykubGVuZ3RoKS50by5lcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNzZXJpYWxpemUoKScsICgpID0+IHtcblxuICAgIGl0KCdyZXR1cm5zIHN0YXRlIG9mIGFsbCB0aGUgc3RvcmVzIGFzIGEgSlNPTiBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnZm9vJywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoJ2ZvbyBzdGF0ZScpKTtcbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2JhcicsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCdiYXIgc3RhdGUnKSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdiYXonLCBjcmVhdGVTZXJpYWxpemFibGVTdG9yZSgnYmF6IHN0YXRlJykpO1xuXG4gICAgICBleHBlY3QoSlNPTi5wYXJzZShmbHV4LnNlcmlhbGl6ZSgpKSkudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGZvbzogJ2ZvbyBzdGF0ZScsXG4gICAgICAgIGJhcjogJ2JhciBzdGF0ZScsXG4gICAgICAgIGJhejogJ2JheiBzdGF0ZSdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgc3RvcmVzIHdob3NlIGNsYXNzZXMgZG8gbm90IGltcGxlbWVudCAuc2VyaWFsaXplKCknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2ZvbycsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCdmb28gc3RhdGUnKSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdiYXInLCBjcmVhdGVTZXJpYWxpemFibGVTdG9yZSgnYmFyIHN0YXRlJykpO1xuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnYmF6JywgVGVzdFN0b3JlKTtcblxuICAgICAgZXhwZWN0KEpTT04ucGFyc2UoZmx1eC5zZXJpYWxpemUoKSkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBmb286ICdmb28gc3RhdGUnLFxuICAgICAgICBiYXI6ICdiYXIgc3RhdGUnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCd3YXJucyBpZiBhbnkgc3RvcmUgY2xhc3NlcyAuc2VyaWFsaXplKCkgcmV0dXJucyBhIG5vbi1zdHJpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNvbnN0IHdhcm4gPSBzaW5vbi5zcHkoY29uc29sZSwgJ3dhcm4nKTtcblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnZm9vJywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoe30pKTtcbiAgICAgIGZsdXguc2VyaWFsaXplKCk7XG5cbiAgICAgIGV4cGVjdCh3YXJuLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbChcbiAgICAgICAgJ1RoZSBzdG9yZSB3aXRoIGtleSBcXCdmb29cXCcgd2FzIG5vdCBzZXJpYWxpemVkIGJlY2F1c2UgdGhlIHN0YXRpYyAnXG4gICAgICArICdtZXRob2QgYFNlcmlhbGl6YWJsZVN0b3JlLnNlcmlhbGl6ZSgpYCByZXR1cm5lZCBhIG5vbi1zdHJpbmcgd2l0aCAnXG4gICAgICArICd0eXBlIFxcJ29iamVjdFxcJy4nXG4gICAgICApO1xuXG4gICAgICBjb25zb2xlLndhcm4ucmVzdG9yZSgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dhcm5zIGFuZCBza2lwcyBzdG9yZXMgd2hvc2UgY2xhc3NlcyBkbyBub3QgaW1wbGVtZW50IC5kZXNlcmlhbGl6ZSgpJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCB3YXJuID0gc2lub24uc3B5KGNvbnNvbGUsICd3YXJuJyk7XG5cbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICAgICAgc3RhdGljIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgICByZXR1cm4gJ3N0YXRlIHN0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSk7XG4gICAgICBmbHV4LnNlcmlhbGl6ZSgpO1xuXG4gICAgICBleHBlY3Qod2Fybi5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoXG4gICAgICAgICdUaGUgY2xhc3MgYFRlc3RTdG9yZWAgaGFzIGEgYHNlcmlhbGl6ZSgpYCBtZXRob2QsIGJ1dCBubyAnXG4gICAgICArICdjb3JyZXNwb25kaW5nIGBkZXNlcmlhbGl6ZSgpYCBtZXRob2QuJ1xuICAgICAgKTtcblxuICAgICAgY29uc29sZS53YXJuLnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNkZXNlcmlhbGl6ZSgpJywgKCkgPT4ge1xuXG4gICAgaXQoJ2NvbnZlcnRzIGEgc2VyaWFsaXplZCBzdHJpbmcgaW50byBzdGF0ZSBhbmQgdXNlcyBpdCB0byByZXBsYWNlIHN0YXRlIG9mIHN0b3JlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuXG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdmb28nLCBjcmVhdGVTZXJpYWxpemFibGVTdG9yZSgpKTtcbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2JhcicsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCkpO1xuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnYmF6JywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoKSk7XG5cbiAgICAgIGZsdXguZGVzZXJpYWxpemUoYHtcbiAgICAgICAgXCJmb29cIjogXCJmb28gc3RhdGVcIixcbiAgICAgICAgXCJiYXJcIjogXCJiYXIgc3RhdGVcIixcbiAgICAgICAgXCJiYXpcIjogXCJiYXogc3RhdGVcIlxuICAgICAgfWApO1xuXG4gICAgICBjb25zdCBmb29TdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2ZvbycpO1xuICAgICAgY29uc3QgYmFyU3RvcmUgPSBmbHV4LmdldFN0b3JlKCdiYXInKTtcbiAgICAgIGNvbnN0IGJhelN0b3JlID0gZmx1eC5nZXRTdG9yZSgnYmF6Jyk7XG5cbiAgICAgIGV4cGVjdChmb29TdG9yZS5zdGF0ZS5zdGF0ZVN0cmluZykudG8uZXF1YWwoJ2ZvbyBzdGF0ZScpO1xuICAgICAgZXhwZWN0KGZvb1N0b3JlLnN0YXRlLmRlc2VyaWFsaXplZCkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChiYXJTdG9yZS5zdGF0ZS5zdGF0ZVN0cmluZykudG8uZXF1YWwoJ2JhciBzdGF0ZScpO1xuICAgICAgZXhwZWN0KGJhclN0b3JlLnN0YXRlLmRlc2VyaWFsaXplZCkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChiYXpTdG9yZS5zdGF0ZS5zdGF0ZVN0cmluZykudG8uZXF1YWwoJ2JheiBzdGF0ZScpO1xuICAgICAgZXhwZWN0KGJhelN0b3JlLnN0YXRlLmRlc2VyaWFsaXplZCkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCd3YXJucyBhbmQgc2tpcHMgaWYgcGFzc2VkIHN0cmluZyBpcyBpbnZhbGlkIEpTT04nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnZm9vJywgVGVzdFN0b3JlKTtcblxuICAgICAgZXhwZWN0KGZsdXguZGVzZXJpYWxpemUuYmluZChmbHV4LCAnbm90IEpTT04nKSkudG8udGhyb3coXG4gICAgICAgICdJbnZhbGlkIHZhbHVlIHBhc3NlZCB0byBgRmx1eCNkZXNlcmlhbGl6ZSgpYDogbm90IEpTT04nXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3dhcm5zIGFuZCBza2lwcyBzdG9yZXMgd2hvc2UgY2xhc3NlcyBkbyBub3QgaW1wbGVtZW50IC5zZXJpYWxpemUoKScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRmx1eCgpO1xuICAgICAgY29uc3Qgd2FybiA9IHNpbm9uLnNweShjb25zb2xlLCAnd2FybicpO1xuXG4gICAgICBjbGFzcyBUZXN0U3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgICAgIHN0YXRpYyBkZXNlcmlhbGl6ZSgpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgndGVzdCcsIFRlc3RTdG9yZSk7XG4gICAgICBmbHV4LmRlc2VyaWFsaXplKCd7XCJ0ZXN0XCI6IFwidGVzdCBzdGF0ZVwifScpO1xuXG4gICAgICBleHBlY3Qod2Fybi5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoXG4gICAgICAgICdUaGUgY2xhc3MgYFRlc3RTdG9yZWAgaGFzIGEgYGRlc2VyaWFsaXplKClgIG1ldGhvZCwgYnV0IG5vICdcbiAgICAgICsgJ2NvcnJlc3BvbmRpbmcgYHNlcmlhbGl6ZSgpYCBtZXRob2QuJ1xuICAgICAgKTtcblxuICAgICAgY29uc29sZS53YXJuLnJlc3RvcmUoKTtcbiAgICB9KTtcblxuICAgIGl0KCdpZ25vcmVzIHN0b3JlcyB3aG9zZSBjbGFzc2VzIGRvIG5vdCBpbXBsZW1lbnQgLmRlc2VyaWFsaXplKCknLCAoKSA9PiB7XG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICAgIGNsYXNzIFRlc3RTdG9yZSBleHRlbmRzIFN0b3JlIHt9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ2ZvbycsIGNyZWF0ZVNlcmlhbGl6YWJsZVN0b3JlKCkpO1xuICAgICAgZmx1eC5jcmVhdGVTdG9yZSgnYmFyJywgY3JlYXRlU2VyaWFsaXphYmxlU3RvcmUoKSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdiYXonLCBUZXN0U3RvcmUpO1xuXG4gICAgICBmbHV4LmRlc2VyaWFsaXplKGB7XG4gICAgICAgIFwiZm9vXCI6IFwiZm9vIHN0YXRlXCIsXG4gICAgICAgIFwiYmFyXCI6IFwiYmFyIHN0YXRlXCIsXG4gICAgICAgIFwiYmF6XCI6IFwiYmF6IHN0YXRlXCJcbiAgICAgIH1gKTtcblxuICAgICAgY29uc3QgZm9vU3RvcmUgPSBmbHV4LmdldFN0b3JlKCdmb28nKTtcbiAgICAgIGNvbnN0IGJhclN0b3JlID0gZmx1eC5nZXRTdG9yZSgnYmFyJyk7XG4gICAgICBjb25zdCBiYXpTdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2JheicpO1xuXG4gICAgICBleHBlY3QoZm9vU3RvcmUuc3RhdGUuc3RhdGVTdHJpbmcpLnRvLmVxdWFsKCdmb28gc3RhdGUnKTtcbiAgICAgIGV4cGVjdChmb29TdG9yZS5zdGF0ZS5kZXNlcmlhbGl6ZWQpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoYmFyU3RvcmUuc3RhdGUuc3RhdGVTdHJpbmcpLnRvLmVxdWFsKCdiYXIgc3RhdGUnKTtcbiAgICAgIGV4cGVjdChiYXJTdG9yZS5zdGF0ZS5kZXNlcmlhbGl6ZWQpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoYmF6U3RvcmUuc3RhdGUpLnRvLmJlLm51bGw7XG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIl19