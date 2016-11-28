'use strict';

var _Flux4 = require('../Flux');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('Store', function () {
  var ExampleStore = function (_Store) {
    _inherits(ExampleStore, _Store);

    function ExampleStore() {
      _classCallCheck(this, ExampleStore);

      var _this = _possibleConstructorReturn(this, _Store.call(this));

      _this.state = { foo: 'bar' };
      return _this;
    }

    return ExampleStore;
  }(_Flux4.Store);

  var actionId = 'actionId';

  describe('#register()', function () {
    it('adds handler to internal collection of handlers', function () {
      var _store$_handlers;

      var store = new ExampleStore();
      var handler = _sinon2['default'].spy();
      store.register(actionId, handler);

      var mockArgs = ['foo', 'bar'];
      (_store$_handlers = store._handlers)[actionId].apply(_store$_handlers, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be['true'];
    });

    it('binds handler to store', function () {
      var store = new ExampleStore();
      store.foo = 'bar';

      function handler() {
        return this.foo;
      }

      store.register(actionId, handler);

      expect(store._handlers[actionId]()).to.equal('bar');
    });

    it('accepts actions instead of action ids', function () {
      var _store$_handlers2;

      var ExampleActions = function (_Actions) {
        _inherits(ExampleActions, _Actions);

        function ExampleActions() {
          _classCallCheck(this, ExampleActions);

          return _possibleConstructorReturn(this, _Actions.apply(this, arguments));
        }

        ExampleActions.prototype.getFoo = function getFoo() {
          return 'foo';
        };

        return ExampleActions;
      }(_Flux4.Actions);

      var actions = new ExampleActions();
      var store = new ExampleStore();
      var handler = _sinon2['default'].spy();
      store.register(actions.getFoo, handler);

      var mockArgs = ['foo', 'bar'];
      (_store$_handlers2 = store._handlers)[actions.getFoo._id].apply(_store$_handlers2, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be['true'];
    });

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.register.bind(store, null)).not.to['throw']();
    });
  });

  it('default state is null', function () {
    var store = new _Flux4.Store();
    expect(store.state).to.be['null'];
  });

  describe('#registerAsync()', function () {
    it('registers handlers for begin, success, and failure of async action', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, handler, begin, success, failure;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              error = new Error();

              ExampleActions = function (_Actions2) {
                _inherits(ExampleActions, _Actions2);

                function ExampleActions() {
                  _classCallCheck(this, ExampleActions);

                  return _possibleConstructorReturn(this, _Actions2.apply(this, arguments));
                }

                ExampleActions.prototype.getFoo = function () {
                  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message) {
                    var _success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (_success) {
                              _context.next = 2;
                              break;
                            }

                            throw error;

                          case 2:
                            return _context.abrupt('return', message + ' success');

                          case 3:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));

                  function getFoo(_x, _x2) {
                    return _ref2.apply(this, arguments);
                  }

                  return getFoo;
                }();

                ExampleActions.prototype.getBar = function () {
                  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(message) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            return _context2.abrupt('return', message);

                          case 1:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  }));

                  function getBar(_x4) {
                    return _ref3.apply(this, arguments);
                  }

                  return getBar;
                }();

                return ExampleActions;
              }(_Flux4.Actions);

              ExampleFlux = function (_Flux) {
                _inherits(ExampleFlux, _Flux);

                function ExampleFlux() {
                  _classCallCheck(this, ExampleFlux);

                  var _this4 = _possibleConstructorReturn(this, _Flux.call(this));

                  _this4.createActions('example', ExampleActions);
                  _this4.createStore('example', ExampleStore);
                  return _this4;
                }

                return ExampleFlux;
              }(_Flux4.Flux);

              flux = new ExampleFlux();
              actions = flux.getActions('example');
              store = flux.getStore('example');
              handler = _sinon2['default'].spy();

              store.register(actions.getBar, handler);

              _context3.next = 10;
              return actions.getBar('bar');

            case 10:
              expect(handler.calledOnce).to.be['true'];
              expect(handler.firstCall.args).to.deep.equal(['bar']);

              begin = _sinon2['default'].spy();
              success = _sinon2['default'].spy();
              failure = _sinon2['default'].spy();

              store.registerAsync(actions.getFoo, begin, success, failure);

              _context3.next = 18;
              return actions.getFoo('foo', true);

            case 18:
              expect(begin.calledOnce).to.be['true'];
              expect(begin.firstCall.args).to.deep.equal(['foo', true]);
              expect(success.calledOnce).to.be['true'];
              expect(success.firstCall.args[0]).to.equal('foo success');
              expect(failure.called).to.be['false'];

              _context3.next = 25;
              return expect(actions.getFoo('bar', false)).to.be.rejected;

            case 25:

              expect(begin.calledTwice).to.be['true'];
              expect(success.calledOnce).to.be['true'];
              expect(failure.calledOnce).to.be['true'];
              expect(failure.firstCall.args[0]).to.equal(error);

            case 29:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    })));

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to['throw']();
    });
  });

  describe('#registerAll()', function () {
    it('adds handler to internal collection of "catch all" handlers', function () {
      var _store$_catchAllHandl;

      var store = new ExampleStore();
      var handler = _sinon2['default'].spy();
      store.registerAll(handler);

      var mockArgs = ['foo', 'bar'];
      (_store$_catchAllHandl = store._catchAllHandlers)[0].apply(_store$_catchAllHandl, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be['true'];
    });

    it('adds multiple handlers to internal collection of "catch all" handlers', function () {
      var _store$_catchAllHandl2, _store$_catchAllHandl3;

      var store = new ExampleStore();
      var handler1 = _sinon2['default'].spy();
      var handler2 = _sinon2['default'].spy();
      store.registerAll(handler1);
      store.registerAll(handler2);

      var mockArgs = ['foo', 'bar'];
      (_store$_catchAllHandl2 = store._catchAllHandlers)[0].apply(_store$_catchAllHandl2, mockArgs);
      (_store$_catchAllHandl3 = store._catchAllHandlers)[1].apply(_store$_catchAllHandl3, mockArgs);

      expect(handler1.calledWith.apply(handler1, mockArgs)).to.be['true'];
      expect(handler2.calledWith.apply(handler2, mockArgs)).to.be['true'];
    });

    it('binds handler to store', function () {
      var store = new ExampleStore();
      store.foo = 'bar';

      function handler() {
        return this.foo;
      }

      store.registerAll(handler);

      expect(store._catchAllHandlers[0]()).to.equal('bar');
    });

    it('accepts actions instead of action ids', function () {
      var _store$_catchAllHandl4;

      var ExampleActions = function (_Actions3) {
        _inherits(ExampleActions, _Actions3);

        function ExampleActions() {
          _classCallCheck(this, ExampleActions);

          return _possibleConstructorReturn(this, _Actions3.apply(this, arguments));
        }

        ExampleActions.prototype.getFoo = function getFoo() {
          return 'foo';
        };

        return ExampleActions;
      }(_Flux4.Actions);

      var actions = new ExampleActions();
      var store = new ExampleStore();
      var handler = _sinon2['default'].spy();
      store.registerAll(handler);

      var mockArgs = ['foo', 'bar'];
      (_store$_catchAllHandl4 = store._catchAllHandlers)[0].apply(_store$_catchAllHandl4, mockArgs);

      expect(handler.calledWith.apply(handler, mockArgs)).to.be['true'];
    });

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.registerAll.bind(store, null)).not.to['throw']();
    });

    it('registers for all async actions success', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, handler;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              error = new Error();

              ExampleActions = function (_Actions4) {
                _inherits(ExampleActions, _Actions4);

                function ExampleActions() {
                  _classCallCheck(this, ExampleActions);

                  return _possibleConstructorReturn(this, _Actions4.apply(this, arguments));
                }

                ExampleActions.prototype.getFoo = function () {
                  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(message) {
                    var _success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (_success) {
                              _context4.next = 2;
                              break;
                            }

                            throw error;

                          case 2:
                            return _context4.abrupt('return', message + ' success');

                          case 3:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee4, this);
                  }));

                  function getFoo(_x5, _x6) {
                    return _ref5.apply(this, arguments);
                  }

                  return getFoo;
                }();

                ExampleActions.prototype.getBar = function () {
                  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(message) {
                    var _success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (_success) {
                              _context5.next = 2;
                              break;
                            }

                            throw error;

                          case 2:
                            return _context5.abrupt('return', message + ' success');

                          case 3:
                          case 'end':
                            return _context5.stop();
                        }
                      }
                    }, _callee5, this);
                  }));

                  function getBar(_x8, _x9) {
                    return _ref6.apply(this, arguments);
                  }

                  return getBar;
                }();

                return ExampleActions;
              }(_Flux4.Actions);

              ExampleFlux = function (_Flux2) {
                _inherits(ExampleFlux, _Flux2);

                function ExampleFlux() {
                  _classCallCheck(this, ExampleFlux);

                  var _this7 = _possibleConstructorReturn(this, _Flux2.call(this));

                  _this7.createActions('example', ExampleActions);
                  _this7.createStore('example', ExampleStore);
                  return _this7;
                }

                return ExampleFlux;
              }(_Flux4.Flux);

              flux = new ExampleFlux();
              actions = flux.getActions('example');
              store = flux.getStore('example');
              handler = _sinon2['default'].spy();

              store.registerAll(handler);

              _context6.next = 10;
              return actions.getBar('bar');

            case 10:
              expect(handler.calledOnce).to.be['true'];
              expect(handler.firstCall.args).to.deep.equal(['bar success']);

            case 12:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    })));
  });

  describe('#registerAllAsync()', function () {
    it('registers "catch all" handlers for begin, success, and failure of async action', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
      var error, ExampleActions, ExampleFlux, flux, actions, store, begin, success, failure;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              error = new Error();

              ExampleActions = function (_Actions5) {
                _inherits(ExampleActions, _Actions5);

                function ExampleActions() {
                  _classCallCheck(this, ExampleActions);

                  return _possibleConstructorReturn(this, _Actions5.apply(this, arguments));
                }

                ExampleActions.prototype.getFoo = function () {
                  var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(message) {
                    var _success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            if (_success) {
                              _context7.next = 2;
                              break;
                            }

                            throw error;

                          case 2:
                            return _context7.abrupt('return', message + ' success');

                          case 3:
                          case 'end':
                            return _context7.stop();
                        }
                      }
                    }, _callee7, this);
                  }));

                  function getFoo(_x11, _x12) {
                    return _ref8.apply(this, arguments);
                  }

                  return getFoo;
                }();

                ExampleActions.prototype.getBar = function () {
                  var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(message) {
                    var _success = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            if (_success) {
                              _context8.next = 2;
                              break;
                            }

                            throw error;

                          case 2:
                            return _context8.abrupt('return', message + ' success');

                          case 3:
                          case 'end':
                            return _context8.stop();
                        }
                      }
                    }, _callee8, this);
                  }));

                  function getBar(_x14, _x15) {
                    return _ref9.apply(this, arguments);
                  }

                  return getBar;
                }();

                return ExampleActions;
              }(_Flux4.Actions);

              ExampleFlux = function (_Flux3) {
                _inherits(ExampleFlux, _Flux3);

                function ExampleFlux() {
                  _classCallCheck(this, ExampleFlux);

                  var _this9 = _possibleConstructorReturn(this, _Flux3.call(this));

                  _this9.createActions('example', ExampleActions);
                  _this9.createStore('example', ExampleStore);
                  return _this9;
                }

                return ExampleFlux;
              }(_Flux4.Flux);

              flux = new ExampleFlux();
              actions = flux.getActions('example');
              store = flux.getStore('example');
              begin = _sinon2['default'].spy();
              success = _sinon2['default'].spy();
              failure = _sinon2['default'].spy();

              store.registerAllAsync(begin, success, failure);

              _context9.next = 12;
              return actions.getFoo('foo', true);

            case 12:
              expect(begin.calledOnce).to.be['true'];
              expect(begin.firstCall.args).to.deep.equal(['foo', true]);
              expect(success.calledOnce).to.be['true'];
              expect(success.firstCall.args[0]).to.equal('foo success');
              expect(failure.called).to.be['false'];

              _context9.next = 19;
              return expect(actions.getFoo('bar', false)).to.be.rejected;

            case 19:
              expect(begin.calledTwice).to.be['true'];
              expect(success.calledOnce).to.be['true'];
              expect(failure.calledOnce).to.be['true'];
              expect(failure.firstCall.args[0]).to.equal(error);

              _context9.next = 25;
              return actions.getBar('foo', true);

            case 25:
              expect(begin.calledThrice).to.be['true'];
              expect(begin.thirdCall.args).to.deep.equal(['foo', true]);
              expect(success.calledTwice).to.be['true'];
              expect(success.secondCall.args[0]).to.equal('foo success');
              expect(failure.calledTwice).to.be['false'];

              _context9.next = 32;
              return expect(actions.getBar('bar', false)).to.be.rejected;

            case 32:
              expect(begin.callCount).to.equal(4);
              expect(success.calledTwice).to.be['true'];
              expect(failure.calledTwice).to.be['true'];
              expect(failure.secondCall.args[0]).to.equal(error);

            case 36:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    })));

    it('ignores non-function handlers', function () {
      var store = new ExampleStore();
      expect(store.registerAsync.bind(store, null)).not.to['throw']();
    });
  });

  describe('#handler()', function () {
    it('delegates dispatches to registered handlers', function () {
      var store = new ExampleStore();
      var handler = _sinon2['default'].spy();
      store.register(actionId, handler);

      // Simulate dispatch
      var body = { foo: 'bar' };
      store.handler({ body: body, actionId: actionId });

      expect(handler.calledWith(body)).to.be['true'];
    });

    it('delegates dispatches to registered "catch all" handlers', function () {
      var store = new ExampleStore();
      var handler = _sinon2['default'].spy();
      var actionIds = ['actionId1', 'actionId2'];
      store.registerAll(handler);

      // Simulate dispatch
      var body = { foo: 'bar' };
      store.handler({ body: body, actionId: actionIds[0] });
      store.handler({ body: body, actionId: actionIds[1] });

      expect(handler.calledWith(body)).to.be['true'];
      expect(handler.calledTwice).to.be['true'];
    });
  });

  describe('#waitFor()', function () {
    it('waits for other stores', function () {
      var flux = new _Flux4.Flux();
      var result = [];

      var store2 = void 0;

      var Store1 = function (_Store2) {
        _inherits(Store1, _Store2);

        function Store1() {
          _classCallCheck(this, Store1);

          var _this10 = _possibleConstructorReturn(this, _Store2.call(this));

          _this10.register(actionId, function () {
            this.waitFor(store2);
            result.push(1);
          });
          return _this10;
        }

        return Store1;
      }(_Flux4.Store);

      var Store2 = function (_Store3) {
        _inherits(Store2, _Store3);

        function Store2() {
          _classCallCheck(this, Store2);

          var _this11 = _possibleConstructorReturn(this, _Store3.call(this));

          _this11.register(actionId, function () {
            result.push(2);
          });
          return _this11;
        }

        return Store2;
      }(_Flux4.Store);

      flux.createStore('store1', Store1);
      flux.createStore('store2', Store2);

      store2 = flux.getStore('store2');

      flux.dispatch(actionId, 'foobar');

      expect(result).to.deep.equal([2, 1]);
    });
  });

  describe('#forceUpdate()', function () {
    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be['true'];
    });

    it('doesn\'t modify existing state', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.replaceState({ bar: 'baz' });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ foo: 'bar' });
        this.forceUpdate();
        this.replaceState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ baz: 'foo' });
    });
  });

  describe('#setState()', function () {
    it('shallow merges old state with new state', function () {
      var store = new ExampleStore();

      store.setState({ bar: 'baz' });

      expect(store.state).to.deep.equal({
        foo: 'bar',
        bar: 'baz'
      });
    });

    it('supports transactional updates', function () {
      var store = new _Flux4.Store();
      store.state = { a: 1 };
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(2);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(3);
      store.setState(function (state) {
        return { a: state.a + 1 };
      });
      expect(store.state.a).to.equal(4);
    });

    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.setState({ foo: 'bar' });

      expect(listener.calledOnce).to.be['true'];
    });

    it('batches multiple state updates within action handler', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.setState({ bar: 'baz' });

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ foo: 'bar', bar: 'baz', baz: 'foo' });
    });
  });

  describe('#replaceState()', function () {
    it('replaces old state with new state', function () {
      var store = new ExampleStore();

      store.replaceState({ bar: 'baz' });

      expect(store.state).to.deep.equal({
        bar: 'baz'
      });
    });

    it('batches multiple state updates within action handler', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.replaceState({ bar: 'baz' });

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ foo: 'bar' });
        this.replaceState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ baz: 'foo' });
    });

    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.replaceState({ foo: 'bar' });

      expect(listener.calledOnce).to.be['true'];
    });
  });

  describe('.assignState', function () {
    it('can be overridden to enable custom state types', function () {
      var StringStore = function (_Store4) {
        _inherits(StringStore, _Store4);

        function StringStore() {
          _classCallCheck(this, StringStore);

          return _possibleConstructorReturn(this, _Store4.apply(this, arguments));
        }

        StringStore.assignState = function assignState(prevState, nextState) {
          return [prevState, nextState].filter(function (state) {
            return typeof state === 'string';
          }).join('');
        };

        return StringStore;
      }(_Flux4.Store);

      var store = new StringStore();

      expect(store.state).to.be['null'];
      store.setState('a');
      expect(store.state).to.equal('a');
      store.setState('b');
      expect(store.state).to.equal('ab');
      store.replaceState('xyz');
      expect(store.state).to.equal('xyz');
      store.setState('zyx');
      expect(store.state).to.equal('xyzzyx');
    });
  });

  describe('#getStateAsObject()', function () {
    it('returns the current state as an object', function () {
      var store = new _Flux4.Store();
      store.setState({ foo: 'bar', bar: 'baz' });
      expect(store.getStateAsObject()).to.deep.equal({ foo: 'bar', bar: 'baz' });
    });
  });

  describe('#forceUpdate()', function () {
    it('emits change event', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.forceUpdate();

      expect(listener.calledOnce).to.be['true'];
    });

    it('doesn\'t modify existing state', function () {
      var store = new ExampleStore();
      var listener = _sinon2['default'].spy();
      store.addListener('change', listener);

      store.register(actionId, function () {
        this.replaceState({ bar: 'baz' });
        this.forceUpdate();

        expect(this.state).to.deep.equal({ foo: 'bar' });
        expect(listener.called).to.be['false'];

        this.setState({ foo: 'bar' });
        this.forceUpdate();
        this.replaceState({ baz: 'foo' });
      });

      // Simulate dispatch
      store.handler({ actionId: actionId, body: 'foobar' });

      expect(listener.calledOnce).to.be['true'];
      expect(store.state).to.deep.equal({ baz: 'foo' });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vU3RvcmUtdGVzdC5qcyJdLCJuYW1lcyI6WyJkZXNjcmliZSIsIkV4YW1wbGVTdG9yZSIsInN0YXRlIiwiZm9vIiwiYWN0aW9uSWQiLCJpdCIsInN0b3JlIiwiaGFuZGxlciIsInNweSIsInJlZ2lzdGVyIiwibW9ja0FyZ3MiLCJfaGFuZGxlcnMiLCJleHBlY3QiLCJjYWxsZWRXaXRoIiwidG8iLCJiZSIsImVxdWFsIiwiRXhhbXBsZUFjdGlvbnMiLCJnZXRGb28iLCJhY3Rpb25zIiwiX2lkIiwiYmluZCIsIm5vdCIsImVycm9yIiwiRXJyb3IiLCJtZXNzYWdlIiwiX3N1Y2Nlc3MiLCJnZXRCYXIiLCJFeGFtcGxlRmx1eCIsImNyZWF0ZUFjdGlvbnMiLCJjcmVhdGVTdG9yZSIsImZsdXgiLCJnZXRBY3Rpb25zIiwiZ2V0U3RvcmUiLCJjYWxsZWRPbmNlIiwiZmlyc3RDYWxsIiwiYXJncyIsImRlZXAiLCJiZWdpbiIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwicmVnaXN0ZXJBc3luYyIsImNhbGxlZCIsInJlamVjdGVkIiwiY2FsbGVkVHdpY2UiLCJyZWdpc3RlckFsbCIsIl9jYXRjaEFsbEhhbmRsZXJzIiwiaGFuZGxlcjEiLCJoYW5kbGVyMiIsInJlZ2lzdGVyQWxsQXN5bmMiLCJjYWxsZWRUaHJpY2UiLCJ0aGlyZENhbGwiLCJzZWNvbmRDYWxsIiwiY2FsbENvdW50IiwiYm9keSIsImFjdGlvbklkcyIsInJlc3VsdCIsInN0b3JlMiIsIlN0b3JlMSIsIndhaXRGb3IiLCJwdXNoIiwiU3RvcmUyIiwiZGlzcGF0Y2giLCJsaXN0ZW5lciIsImFkZExpc3RlbmVyIiwiZm9yY2VVcGRhdGUiLCJyZXBsYWNlU3RhdGUiLCJiYXIiLCJzZXRTdGF0ZSIsImJheiIsImEiLCJTdHJpbmdTdG9yZSIsImFzc2lnblN0YXRlIiwicHJldlN0YXRlIiwibmV4dFN0YXRlIiwiZmlsdGVyIiwiam9pbiIsImdldFN0YXRlQXNPYmplY3QiXSwibWFw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QUFMLENBQWtCLEVBQUVDLEtBQUssS0FBUCxFQUFsQjtBQUNBLGFBQUtGLFdBQUw7O0FBRUFyRCxlQUFPLEtBQUtWLEtBQVosRUFBbUJZLEVBQW5CLENBQXNCdUIsSUFBdEIsQ0FBMkJyQixLQUEzQixDQUFpQyxFQUFFYixLQUFLLEtBQVAsRUFBakM7QUFDQVMsZUFBT21ELFNBQVNyQixNQUFoQixFQUF3QjVCLEVBQXhCLENBQTJCQyxFQUEzQjs7QUFFQSxhQUFLcUQsUUFBTCxDQUFjLEVBQUVqRSxLQUFLLEtBQVAsRUFBZDtBQUNBLGFBQUs4RCxXQUFMO0FBQ0EsYUFBS0MsWUFBTCxDQUFrQixFQUFFRyxLQUFLLEtBQVAsRUFBbEI7QUFDRCxPQVZEOztBQVlBO0FBQ0EvRCxZQUFNQyxPQUFOLENBQWMsRUFBRUgsa0JBQUYsRUFBWWtELE1BQU0sUUFBbEIsRUFBZDs7QUFFQTFDLGFBQU9tRCxTQUFTN0IsVUFBaEIsRUFBNEJwQixFQUE1QixDQUErQkMsRUFBL0I7QUFDQUgsYUFBT04sTUFBTUosS0FBYixFQUFvQlksRUFBcEIsQ0FBdUJ1QixJQUF2QixDQUE0QnJCLEtBQTVCLENBQWtDLEVBQUVxRCxLQUFLLEtBQVAsRUFBbEM7QUFDRCxLQXRCRDtBQXVCRCxHQWxDRDtBQW9DRCxDQXZqQkQiLCJmaWxlIjoiU3RvcmUtdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0b3JlLCBGbHV4LCBBY3Rpb25zIH0gZnJvbSAnLi4vRmx1eCc7XG5pbXBvcnQgc2lub24gZnJvbSAnc2lub24nO1xuXG5kZXNjcmliZSgnU3RvcmUnLCAoKSA9PiB7XG4gIGNsYXNzIEV4YW1wbGVTdG9yZSBleHRlbmRzIFN0b3JlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICB0aGlzLnN0YXRlID0geyBmb286ICdiYXInIH07XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYWN0aW9uSWQgPSAnYWN0aW9uSWQnO1xuXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXIoKScsICgpID0+IHtcbiAgICBpdCgnYWRkcyBoYW5kbGVyIHRvIGludGVybmFsIGNvbGxlY3Rpb24gb2YgaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBoYW5kbGVyKTtcblxuICAgICAgY29uc3QgbW9ja0FyZ3MgPSBbJ2ZvbycsICdiYXInXTtcbiAgICAgIHN0b3JlLl9oYW5kbGVyc1thY3Rpb25JZF0oLi4ubW9ja0FyZ3MpO1xuXG4gICAgICBleHBlY3QoaGFuZGxlci5jYWxsZWRXaXRoKC4uLm1vY2tBcmdzKSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdiaW5kcyBoYW5kbGVyIHRvIHN0b3JlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBzdG9yZS5mb28gPSAnYmFyJztcblxuICAgICAgZnVuY3Rpb24gaGFuZGxlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9vO1xuICAgICAgfVxuXG4gICAgICBzdG9yZS5yZWdpc3RlcihhY3Rpb25JZCwgaGFuZGxlcik7XG5cbiAgICAgIGV4cGVjdChzdG9yZS5faGFuZGxlcnNbYWN0aW9uSWRdKCkpLnRvLmVxdWFsKCdiYXInKTtcbiAgICB9KTtcblxuICAgIGl0KCdhY2NlcHRzIGFjdGlvbnMgaW5zdGVhZCBvZiBhY3Rpb24gaWRzJywgKCkgPT4ge1xuICAgICAgY2xhc3MgRXhhbXBsZUFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgICAgZ2V0Rm9vKCkge1xuICAgICAgICAgIHJldHVybiAnZm9vJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhY3Rpb25zID0gbmV3IEV4YW1wbGVBY3Rpb25zKCk7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbnMuZ2V0Rm9vLCBoYW5kbGVyKTtcblxuICAgICAgY29uc3QgbW9ja0FyZ3MgPSBbJ2ZvbycsICdiYXInXTtcbiAgICAgIHN0b3JlLl9oYW5kbGVyc1thY3Rpb25zLmdldEZvby5faWRdKC4uLm1vY2tBcmdzKTtcblxuICAgICAgZXhwZWN0KGhhbmRsZXIuY2FsbGVkV2l0aCguLi5tb2NrQXJncykpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBub24tZnVuY3Rpb24gaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGV4cGVjdChzdG9yZS5yZWdpc3Rlci5iaW5kKHN0b3JlLCBudWxsKSkubm90LnRvLnRocm93KCk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgaXQoJ2RlZmF1bHQgc3RhdGUgaXMgbnVsbCcsICgpID0+IHtcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xuICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uYmUubnVsbDtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNyZWdpc3RlckFzeW5jKCknLCAoKSA9PiB7XG4gICAgaXQoJ3JlZ2lzdGVycyBoYW5kbGVycyBmb3IgYmVnaW4sIHN1Y2Nlc3MsIGFuZCBmYWlsdXJlIG9mIGFzeW5jIGFjdGlvbicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKTtcblxuICAgICAgY2xhc3MgRXhhbXBsZUFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgICAgYXN5bmMgZ2V0Rm9vKG1lc3NhZ2UsIF9zdWNjZXNzID0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghX3N1Y2Nlc3MpIHRocm93IGVycm9yO1xuXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnIHN1Y2Nlc3MnO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgZ2V0QmFyKG1lc3NhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbGFzcyBFeGFtcGxlRmx1eCBleHRlbmRzIEZsdXgge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlQWN0aW9ucygnZXhhbXBsZScsIEV4YW1wbGVBY3Rpb25zKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlKCdleGFtcGxlJywgRXhhbXBsZVN0b3JlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEV4YW1wbGVGbHV4KCk7XG4gICAgICBjb25zdCBhY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCdleGFtcGxlJyk7XG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2V4YW1wbGUnKTtcblxuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXIoYWN0aW9ucy5nZXRCYXIsIGhhbmRsZXIpO1xuXG4gICAgICBhd2FpdCBhY3Rpb25zLmdldEJhcignYmFyJyk7XG4gICAgICBleHBlY3QoaGFuZGxlci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGhhbmRsZXIuZmlyc3RDYWxsLmFyZ3MpLnRvLmRlZXAuZXF1YWwoWydiYXInXSk7XG5cbiAgICAgIGNvbnN0IGJlZ2luID0gc2lub24uc3B5KCk7XG4gICAgICBjb25zdCBzdWNjZXNzID0gc2lub24uc3B5KCk7XG4gICAgICBjb25zdCBmYWlsdXJlID0gc2lub24uc3B5KCk7XG4gICAgICBzdG9yZS5yZWdpc3RlckFzeW5jKGFjdGlvbnMuZ2V0Rm9vLCBiZWdpbiwgc3VjY2VzcywgZmFpbHVyZSk7XG5cbiAgICAgIGF3YWl0IGFjdGlvbnMuZ2V0Rm9vKCdmb28nLCB0cnVlKTtcbiAgICAgIGV4cGVjdChiZWdpbi5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGJlZ2luLmZpcnN0Q2FsbC5hcmdzKS50by5kZWVwLmVxdWFsKFsnZm9vJywgdHJ1ZV0pO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3MuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbCgnZm9vIHN1Y2Nlc3MnKTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZCkudG8uYmUuZmFsc2U7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChhY3Rpb25zLmdldEZvbygnYmFyJywgZmFsc2UpKS50by5iZS5yZWplY3RlZDtcblxuICAgICAgZXhwZWN0KGJlZ2luLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3MuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoZmFpbHVyZS5maXJzdENhbGwuYXJnc1swXSkudG8uZXF1YWwoZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgbm9uLWZ1bmN0aW9uIGhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBleHBlY3Qoc3RvcmUucmVnaXN0ZXJBc3luYy5iaW5kKHN0b3JlLCBudWxsKSkubm90LnRvLnRocm93KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXJBbGwoKScsICgpID0+IHtcbiAgICBpdCgnYWRkcyBoYW5kbGVyIHRvIGludGVybmFsIGNvbGxlY3Rpb24gb2YgXCJjYXRjaCBhbGxcIiBoYW5kbGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIGNvbnN0IG1vY2tBcmdzID0gWydmb28nLCAnYmFyJ107XG4gICAgICBzdG9yZS5fY2F0Y2hBbGxIYW5kbGVyc1swXSguLi5tb2NrQXJncyk7XG5cbiAgICAgIGV4cGVjdChoYW5kbGVyLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FkZHMgbXVsdGlwbGUgaGFuZGxlcnMgdG8gaW50ZXJuYWwgY29sbGVjdGlvbiBvZiBcImNhdGNoIGFsbFwiIGhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBoYW5kbGVyMSA9IHNpbm9uLnNweSgpO1xuICAgICAgY29uc3QgaGFuZGxlcjIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyQWxsKGhhbmRsZXIxKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyQWxsKGhhbmRsZXIyKTtcblxuICAgICAgY29uc3QgbW9ja0FyZ3MgPSBbJ2ZvbycsICdiYXInXTtcbiAgICAgIHN0b3JlLl9jYXRjaEFsbEhhbmRsZXJzWzBdKC4uLm1vY2tBcmdzKTtcbiAgICAgIHN0b3JlLl9jYXRjaEFsbEhhbmRsZXJzWzFdKC4uLm1vY2tBcmdzKTtcblxuICAgICAgZXhwZWN0KGhhbmRsZXIxLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGhhbmRsZXIyLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgIH0pO1xuXG4gICAgaXQoJ2JpbmRzIGhhbmRsZXIgdG8gc3RvcmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIHN0b3JlLmZvbyA9ICdiYXInO1xuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb287XG4gICAgICB9XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyQWxsKGhhbmRsZXIpO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuX2NhdGNoQWxsSGFuZGxlcnNbMF0oKSkudG8uZXF1YWwoJ2JhcicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FjY2VwdHMgYWN0aW9ucyBpbnN0ZWFkIG9mIGFjdGlvbiBpZHMnLCAoKSA9PiB7XG4gICAgICBjbGFzcyBFeGFtcGxlQWN0aW9ucyBleHRlbmRzIEFjdGlvbnMge1xuICAgICAgICBnZXRGb28oKSB7XG4gICAgICAgICAgcmV0dXJuICdmb28nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgRXhhbXBsZUFjdGlvbnMoKTtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIGNvbnN0IG1vY2tBcmdzID0gWydmb28nLCAnYmFyJ107XG4gICAgICBzdG9yZS5fY2F0Y2hBbGxIYW5kbGVyc1swXSguLi5tb2NrQXJncyk7XG5cbiAgICAgIGV4cGVjdChoYW5kbGVyLmNhbGxlZFdpdGgoLi4ubW9ja0FyZ3MpKS50by5iZS50cnVlO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgbm9uLWZ1bmN0aW9uIGhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBleHBlY3Qoc3RvcmUucmVnaXN0ZXJBbGwuYmluZChzdG9yZSwgbnVsbCkpLm5vdC50by50aHJvdygpO1xuICAgIH0pO1xuXG5cdGl0KCdyZWdpc3RlcnMgZm9yIGFsbCBhc3luYyBhY3Rpb25zIHN1Y2Nlc3MnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCk7XG5cbiAgICAgIGNsYXNzIEV4YW1wbGVBY3Rpb25zIGV4dGVuZHMgQWN0aW9ucyB7XG4gICAgICAgIGFzeW5jIGdldEZvbyhtZXNzYWdlLCBfc3VjY2VzcyA9IHRydWUpIHtcbiAgICAgICAgICBpZiAoIV9zdWNjZXNzKSB0aHJvdyBlcnJvcjtcblxuICAgICAgICAgIHJldHVybiBtZXNzYWdlICsgJyBzdWNjZXNzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGFzeW5jIGdldEJhcihtZXNzYWdlLCBfc3VjY2VzcyA9IHRydWUpIHtcbiAgICAgICAgICBpZiAoIV9zdWNjZXNzKSB0aHJvdyBlcnJvcjtcblxuICAgICAgICAgIHJldHVybiBtZXNzYWdlICsgJyBzdWNjZXNzJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjbGFzcyBFeGFtcGxlRmx1eCBleHRlbmRzIEZsdXgge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlQWN0aW9ucygnZXhhbXBsZScsIEV4YW1wbGVBY3Rpb25zKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlKCdleGFtcGxlJywgRXhhbXBsZVN0b3JlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmbHV4ID0gbmV3IEV4YW1wbGVGbHV4KCk7XG4gICAgICBjb25zdCBhY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCdleGFtcGxlJyk7XG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoJ2V4YW1wbGUnKTtcblxuICAgICAgY29uc3QgaGFuZGxlciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIGF3YWl0IGFjdGlvbnMuZ2V0QmFyKCdiYXInKTtcbiAgICAgIGV4cGVjdChoYW5kbGVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoaGFuZGxlci5maXJzdENhbGwuYXJncykudG8uZGVlcC5lcXVhbChbJ2JhciBzdWNjZXNzJ10pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXJBbGxBc3luYygpJywgKCkgPT4ge1xuICAgIGl0KCdyZWdpc3RlcnMgXCJjYXRjaCBhbGxcIiBoYW5kbGVycyBmb3IgYmVnaW4sIHN1Y2Nlc3MsIGFuZCBmYWlsdXJlIG9mIGFzeW5jIGFjdGlvbicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoKTtcblxuICAgICAgY2xhc3MgRXhhbXBsZUFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgICAgICAgYXN5bmMgZ2V0Rm9vKG1lc3NhZ2UsIF9zdWNjZXNzID0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghX3N1Y2Nlc3MpIHRocm93IGVycm9yO1xuXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnIHN1Y2Nlc3MnO1xuICAgICAgICB9XG5cbiAgICAgICAgYXN5bmMgZ2V0QmFyKG1lc3NhZ2UsIF9zdWNjZXNzID0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghX3N1Y2Nlc3MpIHRocm93IGVycm9yO1xuXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2UgKyAnIHN1Y2Nlc3MnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNsYXNzIEV4YW1wbGVGbHV4IGV4dGVuZHMgRmx1eCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKCdleGFtcGxlJywgRXhhbXBsZUFjdGlvbnMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlU3RvcmUoJ2V4YW1wbGUnLCBFeGFtcGxlU3RvcmUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZsdXggPSBuZXcgRXhhbXBsZUZsdXgoKTtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSBmbHV4LmdldEFjdGlvbnMoJ2V4YW1wbGUnKTtcbiAgICAgIGNvbnN0IHN0b3JlID0gZmx1eC5nZXRTdG9yZSgnZXhhbXBsZScpO1xuXG4gICAgICBjb25zdCBiZWdpbiA9IHNpbm9uLnNweSgpO1xuICAgICAgY29uc3Qgc3VjY2VzcyA9IHNpbm9uLnNweSgpO1xuICAgICAgY29uc3QgZmFpbHVyZSA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGxBc3luYyhiZWdpbiwgc3VjY2VzcywgZmFpbHVyZSk7XG5cbiAgICAgIGF3YWl0IGFjdGlvbnMuZ2V0Rm9vKCdmb28nLCB0cnVlKTtcbiAgICAgIGV4cGVjdChiZWdpbi5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGJlZ2luLmZpcnN0Q2FsbC5hcmdzKS50by5kZWVwLmVxdWFsKFsnZm9vJywgdHJ1ZV0pO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3MuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmZpcnN0Q2FsbC5hcmdzWzBdKS50by5lcXVhbCgnZm9vIHN1Y2Nlc3MnKTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZCkudG8uYmUuZmFsc2U7XG5cbiAgICAgIGF3YWl0IGV4cGVjdChhY3Rpb25zLmdldEZvbygnYmFyJywgZmFsc2UpKS50by5iZS5yZWplY3RlZDtcbiAgICAgIGV4cGVjdChiZWdpbi5jYWxsZWRUd2ljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3QoZmFpbHVyZS5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGZhaWx1cmUuZmlyc3RDYWxsLmFyZ3NbMF0pLnRvLmVxdWFsKGVycm9yKTtcblxuICAgICAgYXdhaXQgYWN0aW9ucy5nZXRCYXIoJ2ZvbycsIHRydWUpO1xuICAgICAgZXhwZWN0KGJlZ2luLmNhbGxlZFRocmljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChiZWdpbi50aGlyZENhbGwuYXJncykudG8uZGVlcC5lcXVhbChbJ2ZvbycsIHRydWVdKTtcbiAgICAgIGV4cGVjdChzdWNjZXNzLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN1Y2Nlc3Muc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5lcXVhbCgnZm9vIHN1Y2Nlc3MnKTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZFR3aWNlKS50by5iZS5mYWxzZTtcblxuICAgICAgYXdhaXQgZXhwZWN0KGFjdGlvbnMuZ2V0QmFyKCdiYXInLCBmYWxzZSkpLnRvLmJlLnJlamVjdGVkO1xuICAgICAgZXhwZWN0KGJlZ2luLmNhbGxDb3VudCkudG8uZXF1YWwoNCk7XG4gICAgICBleHBlY3Qoc3VjY2Vzcy5jYWxsZWRUd2ljZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChmYWlsdXJlLmNhbGxlZFR3aWNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGZhaWx1cmUuc2Vjb25kQ2FsbC5hcmdzWzBdKS50by5lcXVhbChlcnJvcik7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBub24tZnVuY3Rpb24gaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGV4cGVjdChzdG9yZS5yZWdpc3RlckFzeW5jLmJpbmQoc3RvcmUsIG51bGwpKS5ub3QudG8udGhyb3coKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNoYW5kbGVyKCknLCAoKSA9PiB7XG4gICAgaXQoJ2RlbGVnYXRlcyBkaXNwYXRjaGVzIHRvIHJlZ2lzdGVyZWQgaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBoYW5kbGVyKTtcblxuICAgICAgLy8gU2ltdWxhdGUgZGlzcGF0Y2hcbiAgICAgIGNvbnN0IGJvZHkgPSB7IGZvbzogJ2JhcicgfTtcbiAgICAgIHN0b3JlLmhhbmRsZXIoeyBib2R5LCBhY3Rpb25JZCB9KTtcblxuICAgICAgZXhwZWN0KGhhbmRsZXIuY2FsbGVkV2l0aChib2R5KSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdkZWxlZ2F0ZXMgZGlzcGF0Y2hlcyB0byByZWdpc3RlcmVkIFwiY2F0Y2ggYWxsXCIgaGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIGNvbnN0IGFjdGlvbklkcyA9IFsnYWN0aW9uSWQxJywgJ2FjdGlvbklkMiddO1xuICAgICAgc3RvcmUucmVnaXN0ZXJBbGwoaGFuZGxlcik7XG5cbiAgICAgIC8vIFNpbXVsYXRlIGRpc3BhdGNoXG4gICAgICBjb25zdCBib2R5ID0geyBmb286ICdiYXInIH07XG4gICAgICBzdG9yZS5oYW5kbGVyKHsgYm9keSwgYWN0aW9uSWQ6IGFjdGlvbklkc1swXSB9KTtcbiAgICAgIHN0b3JlLmhhbmRsZXIoeyBib2R5LCBhY3Rpb25JZDogYWN0aW9uSWRzWzFdIH0pO1xuXG4gICAgICBleHBlY3QoaGFuZGxlci5jYWxsZWRXaXRoKGJvZHkpKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KGhhbmRsZXIuY2FsbGVkVHdpY2UpLnRvLmJlLnRydWU7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjd2FpdEZvcigpJywgKCkgPT4ge1xuICAgIGl0KCd3YWl0cyBmb3Igb3RoZXIgc3RvcmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgbGV0IHN0b3JlMjtcblxuICAgICAgY2xhc3MgU3RvcmUxIGV4dGVuZHMgU3RvcmUge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgdGhpcy5yZWdpc3RlcihhY3Rpb25JZCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLndhaXRGb3Ioc3RvcmUyKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNsYXNzIFN0b3JlMiBleHRlbmRzIFN0b3JlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgIHRoaXMucmVnaXN0ZXIoYWN0aW9uSWQsICgpID0+IHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKDIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZsdXguY3JlYXRlU3RvcmUoJ3N0b3JlMScsIFN0b3JlMSk7XG4gICAgICBmbHV4LmNyZWF0ZVN0b3JlKCdzdG9yZTInLCBTdG9yZTIpO1xuXG4gICAgICBzdG9yZTIgPSBmbHV4LmdldFN0b3JlKCdzdG9yZTInKTtcblxuICAgICAgZmx1eC5kaXNwYXRjaChhY3Rpb25JZCwgJ2Zvb2JhcicpO1xuXG4gICAgICBleHBlY3QocmVzdWx0KS50by5kZWVwLmVxdWFsKFsyLCAxXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZm9yY2VVcGRhdGUoKScsICgpID0+IHtcbiAgICBpdCgnZW1pdHMgY2hhbmdlIGV2ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUuZm9yY2VVcGRhdGUoKTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IG1vZGlmeSBleGlzdGluZyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlU3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG5cbiAgICAgICAgZXhwZWN0KHRoaXMuc3RhdGUpLnRvLmRlZXAuZXF1YWwoeyBmb286ICdiYXInIH0pO1xuICAgICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkKS50by5iZS5mYWxzZTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnJlcGxhY2VTdGF0ZSh7IGJhejogJ2ZvbycgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gU2ltdWxhdGUgZGlzcGF0Y2hcbiAgICAgIHN0b3JlLmhhbmRsZXIoeyBhY3Rpb25JZCwgYm9keTogJ2Zvb2JhcicgfSk7XG5cbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgICAgZXhwZWN0KHN0b3JlLnN0YXRlKS50by5kZWVwLmVxdWFsKHsgYmF6OiAnZm9vJyB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNzZXRTdGF0ZSgpJywgKCkgPT4ge1xuICAgIGl0KCdzaGFsbG93IG1lcmdlcyBvbGQgc3RhdGUgd2l0aCBuZXcgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcblxuICAgICAgc3RvcmUuc2V0U3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBmb286ICdiYXInLFxuICAgICAgICBiYXI6ICdiYXonLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3VwcG9ydHMgdHJhbnNhY3Rpb25hbCB1cGRhdGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgU3RvcmUoKTtcbiAgICAgIHN0b3JlLnN0YXRlID0geyBhOiAxIH07XG4gICAgICBzdG9yZS5zZXRTdGF0ZShzdGF0ZSA9PiAoeyBhOiBzdGF0ZS5hICsgMSB9KSk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUuYSkudG8uZXF1YWwoMik7XG4gICAgICBzdG9yZS5zZXRTdGF0ZShzdGF0ZSA9PiAoeyBhOiBzdGF0ZS5hICsgMSB9KSk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUuYSkudG8uZXF1YWwoMyk7XG4gICAgICBzdG9yZS5zZXRTdGF0ZShzdGF0ZSA9PiAoeyBhOiBzdGF0ZS5hICsgMSB9KSk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUuYSkudG8uZXF1YWwoNCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZW1pdHMgY2hhbmdlIGV2ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUuc2V0U3RhdGUoeyBmb286ICdiYXInIH0pO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdiYXRjaGVzIG11bHRpcGxlIHN0YXRlIHVwZGF0ZXMgd2l0aGluIGFjdGlvbiBoYW5kbGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUucmVnaXN0ZXIoYWN0aW9uSWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmFyOiAnYmF6JyB9KTtcblxuICAgICAgICBleHBlY3QodGhpcy5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWQpLnRvLmJlLmZhbHNlO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBiYXo6ICdmb28nIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFNpbXVsYXRlIGRpc3BhdGNoXG4gICAgICBzdG9yZS5oYW5kbGVyKHsgYWN0aW9uSWQsIGJvZHk6ICdmb29iYXInIH0pO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicsIGJhcjogJ2JheicsIGJhejogJ2ZvbycgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjcmVwbGFjZVN0YXRlKCknLCAoKSA9PiB7XG4gICAgaXQoJ3JlcGxhY2VzIG9sZCBzdGF0ZSB3aXRoIG5ldyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuXG4gICAgICBzdG9yZS5yZXBsYWNlU3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuXG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBiYXI6ICdiYXonLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYmF0Y2hlcyBtdWx0aXBsZSBzdGF0ZSB1cGRhdGVzIHdpdGhpbiBhY3Rpb24gaGFuZGxlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIHN0b3JlLnJlZ2lzdGVyKGFjdGlvbklkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlU3RhdGUoeyBiYXI6ICdiYXonIH0pO1xuXG4gICAgICAgIGV4cGVjdCh0aGlzLnN0YXRlKS50by5kZWVwLmVxdWFsKHsgZm9vOiAnYmFyJyB9KTtcbiAgICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZCkudG8uYmUuZmFsc2U7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvbzogJ2JhcicgfSk7XG4gICAgICAgIHRoaXMucmVwbGFjZVN0YXRlKHsgYmF6OiAnZm9vJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaW11bGF0ZSBkaXNwYXRjaFxuICAgICAgc3RvcmUuaGFuZGxlcih7IGFjdGlvbklkLCBib2R5OiAnZm9vYmFyJyB9KTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoeyBiYXo6ICdmb28nIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2VtaXRzIGNoYW5nZSBldmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IEV4YW1wbGVTdG9yZSgpO1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSBzaW5vbi5zcHkoKTtcbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG5cbiAgICAgIHN0b3JlLnJlcGxhY2VTdGF0ZSh7IGZvbzogJ2JhcicgfSk7XG5cbiAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWRPbmNlKS50by5iZS50cnVlO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnLmFzc2lnblN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdjYW4gYmUgb3ZlcnJpZGRlbiB0byBlbmFibGUgY3VzdG9tIHN0YXRlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY2xhc3MgU3RyaW5nU3RvcmUgZXh0ZW5kcyBTdG9yZSB7XG4gICAgICAgIHN0YXRpYyBhc3NpZ25TdGF0ZShwcmV2U3RhdGUsIG5leHRTdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBbcHJldlN0YXRlLCBuZXh0U3RhdGVdXG4gICAgICAgICAgICAuZmlsdGVyKHN0YXRlID0+IHR5cGVvZiBzdGF0ZSA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAuam9pbignJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgU3RyaW5nU3RvcmUoKTtcblxuICAgICAgZXhwZWN0KHN0b3JlLnN0YXRlKS50by5iZS5udWxsO1xuICAgICAgc3RvcmUuc2V0U3RhdGUoJ2EnKTtcbiAgICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uZXF1YWwoJ2EnKTtcbiAgICAgIHN0b3JlLnNldFN0YXRlKCdiJyk7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmVxdWFsKCdhYicpO1xuICAgICAgc3RvcmUucmVwbGFjZVN0YXRlKCd4eXonKTtcbiAgICAgIGV4cGVjdChzdG9yZS5zdGF0ZSkudG8uZXF1YWwoJ3h5eicpO1xuICAgICAgc3RvcmUuc2V0U3RhdGUoJ3p5eCcpO1xuICAgICAgZXhwZWN0KHN0b3JlLnN0YXRlKS50by5lcXVhbCgneHl6enl4Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCcjZ2V0U3RhdGVBc09iamVjdCgpJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIHRoZSBjdXJyZW50IHN0YXRlIGFzIGFuIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gbmV3IFN0b3JlKCk7XG4gICAgICBzdG9yZS5zZXRTdGF0ZSh7IGZvbzogJ2JhcicsIGJhcjogJ2JheicgfSk7XG4gICAgICBleHBlY3Qoc3RvcmUuZ2V0U3RhdGVBc09iamVjdCgpKS50by5kZWVwLmVxdWFsKHsgZm9vOiAnYmFyJywgYmFyOiAnYmF6JyB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJyNmb3JjZVVwZGF0ZSgpJywgKCkgPT4ge1xuICAgIGl0KCdlbWl0cyBjaGFuZ2UgZXZlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IG5ldyBFeGFtcGxlU3RvcmUoKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gc2lub24uc3B5KCk7XG4gICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuXG4gICAgICBzdG9yZS5mb3JjZVVwZGF0ZSgpO1xuXG4gICAgICBleHBlY3QobGlzdGVuZXIuY2FsbGVkT25jZSkudG8uYmUudHJ1ZTtcbiAgICB9KTtcblxuICAgIGl0KCdkb2VzblxcJ3QgbW9kaWZ5IGV4aXN0aW5nIHN0YXRlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmUgPSBuZXcgRXhhbXBsZVN0b3JlKCk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHNpbm9uLnNweSgpO1xuICAgICAgc3RvcmUuYWRkTGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcblxuICAgICAgc3RvcmUucmVnaXN0ZXIoYWN0aW9uSWQsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlcGxhY2VTdGF0ZSh7IGJhcjogJ2JheicgfSk7XG4gICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcblxuICAgICAgICBleHBlY3QodGhpcy5zdGF0ZSkudG8uZGVlcC5lcXVhbCh7IGZvbzogJ2JhcicgfSk7XG4gICAgICAgIGV4cGVjdChsaXN0ZW5lci5jYWxsZWQpLnRvLmJlLmZhbHNlO1xuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb286ICdiYXInIH0pO1xuICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICAgIHRoaXMucmVwbGFjZVN0YXRlKHsgYmF6OiAnZm9vJyB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaW11bGF0ZSBkaXNwYXRjaFxuICAgICAgc3RvcmUuaGFuZGxlcih7IGFjdGlvbklkLCBib2R5OiAnZm9vYmFyJyB9KTtcblxuICAgICAgZXhwZWN0KGxpc3RlbmVyLmNhbGxlZE9uY2UpLnRvLmJlLnRydWU7XG4gICAgICBleHBlY3Qoc3RvcmUuc3RhdGUpLnRvLmRlZXAuZXF1YWwoeyBiYXo6ICdmb28nIH0pO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=