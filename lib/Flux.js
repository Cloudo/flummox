'use strict';

exports.__esModule = true;
exports.Actions = exports.Store = exports.Flummox = exports.Flux = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Store2 = require('./Store');

var _Store3 = _interopRequireDefault(_Store2);

var _Actions3 = require('./Actions');

var _Actions4 = _interopRequireDefault(_Actions3);

var _flux = require('flux');

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Flux
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * The main Flux class.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Flux = function (_EventEmitter) {
  _inherits(Flux, _EventEmitter);

  function Flux() {
    _classCallCheck(this, Flux);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.dispatcher = new _flux.Dispatcher();

    _this._stores = {};
    _this._actions = {};
    return _this;
  }

  Flux.prototype.createStore = function createStore(key, _Store) {

    if (!(_Store.prototype instanceof _Store3['default'])) {
      var className = getClassName(_Store);

      throw new Error('You\'ve attempted to create a store from the class ' + className + ', which ' + 'does not have the base Store class in its prototype chain. Make sure ' + ('you\'re using the `extends` keyword: `class ' + className + ' extends ') + 'Store { ... }`');
    }

    if (this._stores.hasOwnProperty(key) && this._stores[key]) {
      throw new Error('You\'ve attempted to create multiple stores with key ' + key + '. Keys must ' + 'be unique.');
    }

    for (var _len = arguments.length, constructorArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      constructorArgs[_key - 2] = arguments[_key];
    }

    var store = new (Function.prototype.bind.apply(_Store, [null].concat(constructorArgs)))();
    var token = this.dispatcher.register(store.handler.bind(store));

    store._waitFor = this.waitFor.bind(this);
    store._token = token;
    store._getAllActionIds = this.getAllActionIds.bind(this);

    this._stores[key] = store;

    return store;
  };

  Flux.prototype.getStore = function getStore(key) {
    return this._stores.hasOwnProperty(key) ? this._stores[key] : undefined;
  };

  Flux.prototype.removeStore = function removeStore(key) {
    if (this._stores.hasOwnProperty(key)) {
      this._stores[key].removeAllListeners();
      this.dispatcher.unregister(this._stores[key]._token);
      delete this._stores[key];
    } else {
      throw new Error('You\'ve attempted to remove store with key ' + key + ' which does not exist.');
    }
  };

  Flux.prototype.createActions = function createActions(key, _Actions) {
    if (!(_Actions.prototype instanceof _Actions4['default']) && _Actions !== _Actions4['default']) {
      if (typeof _Actions === 'function') {
        var className = getClassName(_Actions);

        throw new Error('You\'ve attempted to create actions from the class ' + className + ', which ' + 'does not have the base Actions class in its prototype chain. Make ' + ('sure you\'re using the `extends` keyword: `class ' + className + ' ') + 'extends Actions { ... }`');
      } else {
        var properties = _Actions;
        _Actions = function (_Actions2) {
          _inherits(_Actions, _Actions2);

          function _Actions() {
            _classCallCheck(this, _Actions);

            return _possibleConstructorReturn(this, _Actions2.apply(this, arguments));
          }

          return _Actions;
        }(_Actions4['default']);
        (0, _objectAssign2['default'])(_Actions.prototype, properties);
      }
    }

    if (this._actions.hasOwnProperty(key) && this._actions[key]) {
      throw new Error('You\'ve attempted to create multiple actions with key ' + key + '. Keys ' + 'must be unique.');
    }

    for (var _len2 = arguments.length, constructorArgs = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      constructorArgs[_key2 - 2] = arguments[_key2];
    }

    var actions = new (Function.prototype.bind.apply(_Actions, [null].concat(constructorArgs)))();
    actions.dispatch = this.dispatch.bind(this);
    actions.dispatchAsync = this.dispatchAsync.bind(this);

    this._actions[key] = actions;

    return actions;
  };

  Flux.prototype.getActions = function getActions(key) {
    return this._actions.hasOwnProperty(key) ? this._actions[key] : undefined;
  };

  Flux.prototype.getActionIds = function getActionIds(key) {
    var actions = this.getActions(key);

    if (!actions) return;

    return actions.getConstants();
  };

  Flux.prototype.removeActions = function removeActions(key) {
    if (this._actions.hasOwnProperty(key)) {
      delete this._actions[key];
    } else {
      throw new Error('You\'ve attempted to remove actions with key ' + key + ' which does not exist.');
    }
  };

  Flux.prototype.getAllActionIds = function getAllActionIds() {
    var actionIds = [];

    for (var key in this._actions) {
      if (!this._actions.hasOwnProperty(key)) continue;

      var actionConstants = this._actions[key].getConstants();

      actionIds = actionIds.concat(getValues(actionConstants));
    }

    return actionIds;
  };

  Flux.prototype.dispatch = function dispatch(actionId, body) {
    this._dispatch({ actionId: actionId, body: body });
  };

  Flux.prototype.dispatchAsync = function dispatchAsync(actionId, promise, actionArgs) {
    var _this3 = this;

    var payload = {
      actionId: actionId,
      async: 'begin'
    };

    if (actionArgs) payload.actionArgs = actionArgs;

    this._dispatch(payload);

    return promise.then(function (body) {
      _this3._dispatch({
        actionId: actionId,
        body: body,
        async: 'success'
      });

      return body;
    }, function (error) {
      _this3._dispatch({
        actionId: actionId,
        error: error,
        async: 'failure'
      });
    })['catch'](function (error) {
      _this3.emit('error', error);

      throw error;
    });
  };

  Flux.prototype._dispatch = function _dispatch(payload) {
    this.dispatcher.dispatch(payload);
    this.emit('dispatch', payload);
  };

  Flux.prototype.waitFor = function waitFor(tokensOrStores) {

    if (!Array.isArray(tokensOrStores)) tokensOrStores = [tokensOrStores];

    var ensureIsToken = function ensureIsToken(tokenOrStore) {
      return tokenOrStore instanceof _Store3['default'] ? tokenOrStore._token : tokenOrStore;
    };

    var tokens = tokensOrStores.map(ensureIsToken);

    this.dispatcher.waitFor(tokens);
  };

  Flux.prototype.removeAllStoreListeners = function removeAllStoreListeners(event) {
    for (var key in this._stores) {
      if (!this._stores.hasOwnProperty(key)) continue;

      var store = this._stores[key];

      store.removeAllListeners(event);
    }
  };

  Flux.prototype.serialize = function serialize() {
    var stateTree = {};

    for (var key in this._stores) {
      if (!this._stores.hasOwnProperty(key)) continue;

      var store = this._stores[key];

      var serialize = store.constructor.serialize;

      if (typeof serialize !== 'function') continue;

      var serializedStoreState = serialize(store.state);

      if (typeof serializedStoreState !== 'string') {
        var className = store.constructor.name;

        if (process.env.NODE_ENV !== 'production') {
          console.warn('The store with key \'' + key + '\' was not serialized because the static ' + ('method `' + className + '.serialize()` returned a non-string with type ') + ('\'' + (typeof serializedStoreState === 'undefined' ? 'undefined' : _typeof(serializedStoreState)) + '\'.'));
        }
      }

      stateTree[key] = serializedStoreState;

      if (typeof store.constructor.deserialize !== 'function') {
        var _className = store.constructor.name;

        if (process.env.NODE_ENV !== 'production') {
          console.warn('The class `' + _className + '` has a `serialize()` method, but no ' + 'corresponding `deserialize()` method.');
        }
      }
    }

    return JSON.stringify(stateTree);
  };

  Flux.prototype.deserialize = function deserialize(serializedState) {
    var stateMap = void 0;

    try {
      stateMap = JSON.parse(serializedState);
    } catch (error) {
      var className = this.constructor.name;

      if (process.env.NODE_ENV !== 'production') {
        throw new Error('Invalid value passed to `' + className + '#deserialize()`: ' + ('' + serializedState));
      }
    }

    for (var key in this._stores) {
      if (!this._stores.hasOwnProperty(key)) continue;

      var store = this._stores[key];

      var deserialize = store.constructor.deserialize;

      if (typeof deserialize !== 'function') continue;

      var storeStateString = stateMap[key];
      var storeState = deserialize(storeStateString);

      store.replaceState(storeState);

      if (typeof store.constructor.serialize !== 'function') {
        var _className2 = store.constructor.name;

        if (process.env.NODE_ENV !== 'production') {
          console.warn('The class `' + _className2 + '` has a `deserialize()` method, but no ' + 'corresponding `serialize()` method.');
        }
      }
    }
  };

  return Flux;
}(_eventemitter2['default']);

// Aliases


exports['default'] = Flux;
Flux.prototype.getConstants = Flux.prototype.getActionIds;
Flux.prototype.getAllConstants = Flux.prototype.getAllActionIds;
Flux.prototype.dehydrate = Flux.prototype.serialize;
Flux.prototype.hydrate = Flux.prototype.deserialize;

function getClassName(Class) {
  return Class.prototype.constructor.name;
}

function getValues(object) {
  var values = [];

  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;

    values.push(object[key]);
  }

  return values;
}

var Flummox = Flux;

exports.Flux = Flux;
exports.Flummox = Flummox;
exports.Store = _Store3['default'];
exports.Actions = _Actions4['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GbHV4LmpzIl0sIm5hbWVzIjpbIkZsdXgiLCJkaXNwYXRjaGVyIiwiX3N0b3JlcyIsIl9hY3Rpb25zIiwiY3JlYXRlU3RvcmUiLCJrZXkiLCJfU3RvcmUiLCJwcm90b3R5cGUiLCJjbGFzc05hbWUiLCJnZXRDbGFzc05hbWUiLCJFcnJvciIsImhhc093blByb3BlcnR5IiwiY29uc3RydWN0b3JBcmdzIiwic3RvcmUiLCJ0b2tlbiIsInJlZ2lzdGVyIiwiaGFuZGxlciIsImJpbmQiLCJfd2FpdEZvciIsIndhaXRGb3IiLCJfdG9rZW4iLCJfZ2V0QWxsQWN0aW9uSWRzIiwiZ2V0QWxsQWN0aW9uSWRzIiwiZ2V0U3RvcmUiLCJ1bmRlZmluZWQiLCJyZW1vdmVTdG9yZSIsInJlbW92ZUFsbExpc3RlbmVycyIsInVucmVnaXN0ZXIiLCJjcmVhdGVBY3Rpb25zIiwiX0FjdGlvbnMiLCJwcm9wZXJ0aWVzIiwiYWN0aW9ucyIsImRpc3BhdGNoIiwiZGlzcGF0Y2hBc3luYyIsImdldEFjdGlvbnMiLCJnZXRBY3Rpb25JZHMiLCJnZXRDb25zdGFudHMiLCJyZW1vdmVBY3Rpb25zIiwiYWN0aW9uSWRzIiwiYWN0aW9uQ29uc3RhbnRzIiwiY29uY2F0IiwiZ2V0VmFsdWVzIiwiYWN0aW9uSWQiLCJib2R5IiwiX2Rpc3BhdGNoIiwicHJvbWlzZSIsImFjdGlvbkFyZ3MiLCJwYXlsb2FkIiwiYXN5bmMiLCJ0aGVuIiwiZXJyb3IiLCJlbWl0IiwidG9rZW5zT3JTdG9yZXMiLCJBcnJheSIsImlzQXJyYXkiLCJlbnN1cmVJc1Rva2VuIiwidG9rZW5PclN0b3JlIiwidG9rZW5zIiwibWFwIiwicmVtb3ZlQWxsU3RvcmVMaXN0ZW5lcnMiLCJldmVudCIsInNlcmlhbGl6ZSIsInN0YXRlVHJlZSIsImNvbnN0cnVjdG9yIiwic2VyaWFsaXplZFN0b3JlU3RhdGUiLCJzdGF0ZSIsIm5hbWUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJjb25zb2xlIiwid2FybiIsImRlc2VyaWFsaXplIiwiSlNPTiIsInN0cmluZ2lmeSIsInNlcmlhbGl6ZWRTdGF0ZSIsInN0YXRlTWFwIiwicGFyc2UiLCJzdG9yZVN0YXRlU3RyaW5nIiwic3RvcmVTdGF0ZSIsInJlcGxhY2VTdGF0ZSIsImdldEFsbENvbnN0YW50cyIsImRlaHlkcmF0ZSIsImh5ZHJhdGUiLCJDbGFzcyIsIm9iamVjdCIsInZhbHVlcyIsInB1c2giLCJGbHVtbW94IiwiU3RvcmUiLCJBY3Rpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7K2VBVkE7Ozs7OztJQVlxQkEsSTs7O0FBRW5CLGtCQUFjO0FBQUE7O0FBQUEsaURBQ1osd0JBRFk7O0FBR1osVUFBS0MsVUFBTCxHQUFrQixzQkFBbEI7O0FBRUEsVUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBTlk7QUFPYjs7aUJBRURDLFcsd0JBQVlDLEcsRUFBS0MsTSxFQUE0Qjs7QUFFM0MsUUFBSSxFQUFFQSxPQUFPQyxTQUFQLDhCQUFGLENBQUosRUFBMEM7QUFDeEMsVUFBTUMsWUFBWUMsYUFBYUgsTUFBYixDQUFsQjs7QUFFQSxZQUFNLElBQUlJLEtBQUosQ0FDSix3REFBcURGLFNBQXJELDRJQUVpREEsU0FGakQsa0NBREksQ0FBTjtBQU1EOztBQUVELFFBQUksS0FBS04sT0FBTCxDQUFhUyxjQUFiLENBQTRCTixHQUE1QixLQUFvQyxLQUFLSCxPQUFMLENBQWFHLEdBQWIsQ0FBeEMsRUFBMkQ7QUFDekQsWUFBTSxJQUFJSyxLQUFKLENBQ0osMERBQXVETCxHQUF2RCxnQ0FESSxDQUFOO0FBSUQ7O0FBbEIwQyxzQ0FBakJPLGVBQWlCO0FBQWpCQSxxQkFBaUI7QUFBQTs7QUFvQjNDLFFBQU1DLDJDQUFZUCxNQUFaLGdCQUFzQk0sZUFBdEIsS0FBTjtBQUNBLFFBQU1FLFFBQVEsS0FBS2IsVUFBTCxDQUFnQmMsUUFBaEIsQ0FBeUJGLE1BQU1H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RixLQUFLTyxTQUFMLENBQWVpRSxXQUF4Qzs7QUFFQSxTQUFTL0QsWUFBVCxDQUFzQjJFLEtBQXRCLEVBQTZCO0FBQzNCLFNBQU9BLE1BQU03RSxTQUFOLENBQWdCd0QsV0FBaEIsQ0FBNEJHLElBQW5DO0FBQ0Q7O0FBRUQsU0FBU3pCLFNBQVQsQ0FBbUI0QyxNQUFuQixFQUEyQjtBQUN6QixNQUFJQyxTQUFTLEVBQWI7O0FBRUEsT0FBSyxJQUFJakYsR0FBVCxJQUFnQmdGLE1BQWhCLEVBQXdCO0FBQ3RCLFFBQUksQ0FBQ0EsT0FBTzFFLGNBQVAsQ0FBc0JOLEdBQXRCLENBQUwsRUFBaUM7O0FBRWpDaUYsV0FBT0MsSUFBUCxDQUFZRixPQUFPaEYsR0FBUCxDQUFaO0FBQ0Q7O0FBRUQsU0FBT2lGLE1BQVA7QUFDRDs7QUFFRCxJQUFNRSxVQUFVeEYsSUFBaEI7O1FBR0VBLEksR0FBQUEsSTtRQUNBd0YsTyxHQUFBQSxPO1FBQ0FDLEs7UUFDQUMsTyIsImZpbGUiOiJGbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGbHV4XG4gKlxuICogVGhlIG1haW4gRmx1eCBjbGFzcy5cbiAqL1xuXG5pbXBvcnQgU3RvcmUgZnJvbSAnLi9TdG9yZSc7XG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuL0FjdGlvbnMnO1xuaW1wb3J0IHsgRGlzcGF0Y2hlciB9IGZyb20gJ2ZsdXgnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsdXggZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG4gICAgdGhpcy5fc3RvcmVzID0ge307XG4gICAgdGhpcy5fYWN0aW9ucyA9IHt9O1xuICB9XG5cbiAgY3JlYXRlU3RvcmUoa2V5LCBfU3RvcmUsIC4uLmNvbnN0cnVjdG9yQXJncykge1xuXG4gICAgaWYgKCEoX1N0b3JlLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN0b3JlKSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKF9TdG9yZSk7XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIGEgc3RvcmUgZnJvbSB0aGUgY2xhc3MgJHtjbGFzc05hbWV9LCB3aGljaCBgXG4gICAgICArIGBkb2VzIG5vdCBoYXZlIHRoZSBiYXNlIFN0b3JlIGNsYXNzIGluIGl0cyBwcm90b3R5cGUgY2hhaW4uIE1ha2Ugc3VyZSBgXG4gICAgICArIGB5b3UncmUgdXNpbmcgdGhlIFxcYGV4dGVuZHNcXGAga2V5d29yZDogXFxgY2xhc3MgJHtjbGFzc05hbWV9IGV4dGVuZHMgYFxuICAgICAgKyBgU3RvcmUgeyAuLi4gfVxcYGBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRoaXMuX3N0b3Jlc1trZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIGNyZWF0ZSBtdWx0aXBsZSBzdG9yZXMgd2l0aCBrZXkgJHtrZXl9LiBLZXlzIG11c3QgYFxuICAgICAgKyBgYmUgdW5pcXVlLmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgX1N0b3JlKC4uLmNvbnN0cnVjdG9yQXJncyk7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLmRpc3BhdGNoZXIucmVnaXN0ZXIoc3RvcmUuaGFuZGxlci5iaW5kKHN0b3JlKSk7XG5cbiAgICBzdG9yZS5fd2FpdEZvciA9IHRoaXMud2FpdEZvci5iaW5kKHRoaXMpO1xuICAgIHN0b3JlLl90b2tlbiA9IHRva2VuO1xuICAgIHN0b3JlLl9nZXRBbGxBY3Rpb25JZHMgPSB0aGlzLmdldEFsbEFjdGlvbklkcy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc3RvcmVzW2tleV0gPSBzdG9yZTtcblxuICAgIHJldHVybiBzdG9yZTtcbiAgfVxuXG4gIGdldFN0b3JlKGtleSkge1xuICAgIHJldHVybiB0aGlzLl9zdG9yZXMuaGFzT3duUHJvcGVydHkoa2V5KSA/IHRoaXMuX3N0b3Jlc1trZXldIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcmVtb3ZlU3RvcmUoa2V5KSB7XG4gICAgaWYgKHRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aGlzLl9zdG9yZXNba2V5XS5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hlci51bnJlZ2lzdGVyKHRoaXMuX3N0b3Jlc1trZXldLl90b2tlbik7XG4gICAgICBkZWxldGUgdGhpcy5fc3RvcmVzW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gcmVtb3ZlIHN0b3JlIHdpdGgga2V5ICR7a2V5fSB3aGljaCBkb2VzIG5vdCBleGlzdC5gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUFjdGlvbnMoa2V5LCBfQWN0aW9ucywgLi4uY29uc3RydWN0b3JBcmdzKSB7XG4gICAgaWYgKCEoX0FjdGlvbnMucHJvdG90eXBlIGluc3RhbmNlb2YgQWN0aW9ucykgJiYgX0FjdGlvbnMgIT09IEFjdGlvbnMpIHtcbiAgICAgIGlmICh0eXBlb2YgX0FjdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKF9BY3Rpb25zKTtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFlvdSd2ZSBhdHRlbXB0ZWQgdG8gY3JlYXRlIGFjdGlvbnMgZnJvbSB0aGUgY2xhc3MgJHtjbGFzc05hbWV9LCB3aGljaCBgXG4gICAgICAgICsgYGRvZXMgbm90IGhhdmUgdGhlIGJhc2UgQWN0aW9ucyBjbGFzcyBpbiBpdHMgcHJvdG90eXBlIGNoYWluLiBNYWtlIGBcbiAgICAgICAgKyBgc3VyZSB5b3UncmUgdXNpbmcgdGhlIFxcYGV4dGVuZHNcXGAga2V5d29yZDogXFxgY2xhc3MgJHtjbGFzc05hbWV9IGBcbiAgICAgICAgKyBgZXh0ZW5kcyBBY3Rpb25zIHsgLi4uIH1cXGBgXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwcm9wZXJ0aWVzID0gX0FjdGlvbnM7XG4gICAgICAgIF9BY3Rpb25zID0gY2xhc3MgZXh0ZW5kcyBBY3Rpb25zIHt9O1xuICAgICAgICBhc3NpZ24oX0FjdGlvbnMucHJvdG90eXBlLCBwcm9wZXJ0aWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHRoaXMuX2FjdGlvbnNba2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBjcmVhdGUgbXVsdGlwbGUgYWN0aW9ucyB3aXRoIGtleSAke2tleX0uIEtleXMgYFxuICAgICAgKyBgbXVzdCBiZSB1bmlxdWUuYFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3Rpb25zID0gbmV3IF9BY3Rpb25zKC4uLmNvbnN0cnVjdG9yQXJncyk7XG4gICAgYWN0aW9ucy5kaXNwYXRjaCA9IHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKTtcbiAgICBhY3Rpb25zLmRpc3BhdGNoQXN5bmMgPSB0aGlzLmRpc3BhdGNoQXN5bmMuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2FjdGlvbnNba2V5XSA9IGFjdGlvbnM7XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbiAgfVxuXG4gIGdldEFjdGlvbnMoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSA/IHRoaXMuX2FjdGlvbnNba2V5XSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEFjdGlvbklkcyhrZXkpIHtcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKGtleSk7XG5cbiAgICBpZiAoIWFjdGlvbnMpIHJldHVybjtcblxuICAgIHJldHVybiBhY3Rpb25zLmdldENvbnN0YW50cygpO1xuICB9XG5cbiAgcmVtb3ZlQWN0aW9ucyhrZXkpIHtcbiAgICBpZiAodGhpcy5fYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBkZWxldGUgdGhpcy5fYWN0aW9uc1trZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBZb3UndmUgYXR0ZW1wdGVkIHRvIHJlbW92ZSBhY3Rpb25zIHdpdGgga2V5ICR7a2V5fSB3aGljaCBkb2VzIG5vdCBleGlzdC5gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsbEFjdGlvbklkcygpIHtcbiAgICBsZXQgYWN0aW9uSWRzID0gW107XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fYWN0aW9ucykge1xuICAgICAgaWYgKCF0aGlzLl9hY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBhY3Rpb25Db25zdGFudHMgPSB0aGlzLl9hY3Rpb25zW2tleV0uZ2V0Q29uc3RhbnRzKCk7XG5cbiAgICAgIGFjdGlvbklkcyA9IGFjdGlvbklkcy5jb25jYXQoZ2V0VmFsdWVzKGFjdGlvbkNvbnN0YW50cykpO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb25JZHM7XG4gIH1cblxuICBkaXNwYXRjaChhY3Rpb25JZCwgYm9keSkge1xuICAgIHRoaXMuX2Rpc3BhdGNoKHsgYWN0aW9uSWQsIGJvZHkgfSk7XG4gIH1cblxuICBkaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBwcm9taXNlLCBhY3Rpb25BcmdzKSB7XG4gICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgIGFjdGlvbklkLFxuICAgICAgYXN5bmM6ICdiZWdpbidcbiAgICB9O1xuXG4gICAgaWYgKGFjdGlvbkFyZ3MpIHBheWxvYWQuYWN0aW9uQXJncyA9IGFjdGlvbkFyZ3M7XG5cbiAgICB0aGlzLl9kaXNwYXRjaChwYXlsb2FkKTtcblxuICAgIHJldHVybiBwcm9taXNlXG4gICAgICAudGhlbihcbiAgICAgICAgYm9keSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGlzcGF0Y2goe1xuICAgICAgICAgICAgYWN0aW9uSWQsXG4gICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgYXN5bmM6ICdzdWNjZXNzJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLl9kaXNwYXRjaCh7XG4gICAgICAgICAgICBhY3Rpb25JZCxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgYXN5bmM6ICdmYWlsdXJlJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICApXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IpO1xuXG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfSk7XG4gIH1cblxuICBfZGlzcGF0Y2gocGF5bG9hZCkge1xuICAgIHRoaXMuZGlzcGF0Y2hlci5kaXNwYXRjaChwYXlsb2FkKTtcbiAgICB0aGlzLmVtaXQoJ2Rpc3BhdGNoJywgcGF5bG9hZCk7XG4gIH1cblxuICB3YWl0Rm9yKHRva2Vuc09yU3RvcmVzKSB7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodG9rZW5zT3JTdG9yZXMpKSB0b2tlbnNPclN0b3JlcyA9IFt0b2tlbnNPclN0b3Jlc107XG5cbiAgICBjb25zdCBlbnN1cmVJc1Rva2VuID0gdG9rZW5PclN0b3JlID0+IHtcbiAgICAgIHJldHVybiB0b2tlbk9yU3RvcmUgaW5zdGFuY2VvZiBTdG9yZVxuICAgICAgICA/IHRva2VuT3JTdG9yZS5fdG9rZW5cbiAgICAgICAgOiB0b2tlbk9yU3RvcmU7XG4gICAgfTtcblxuICAgIGNvbnN0IHRva2VucyA9IHRva2Vuc09yU3RvcmVzLm1hcChlbnN1cmVJc1Rva2VuKTtcblxuICAgIHRoaXMuZGlzcGF0Y2hlci53YWl0Rm9yKHRva2Vucyk7XG4gIH1cblxuICByZW1vdmVBbGxTdG9yZUxpc3RlbmVycyhldmVudCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9zdG9yZXMpIHtcbiAgICAgIGlmICghdGhpcy5fc3RvcmVzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuX3N0b3Jlc1trZXldO1xuXG4gICAgICBzdG9yZS5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICBjb25zdCBzdGF0ZVRyZWUgPSB7fTtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9zdG9yZXMpIHtcbiAgICAgIGlmICghdGhpcy5fc3RvcmVzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuX3N0b3Jlc1trZXldO1xuXG4gICAgICBjb25zdCBzZXJpYWxpemUgPSBzdG9yZS5jb25zdHJ1Y3Rvci5zZXJpYWxpemU7XG5cbiAgICAgIGlmICh0eXBlb2Ygc2VyaWFsaXplICE9PSAnZnVuY3Rpb24nKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgc2VyaWFsaXplZFN0b3JlU3RhdGUgPSBzZXJpYWxpemUoc3RvcmUuc3RhdGUpO1xuXG4gICAgICBpZiAodHlwZW9mIHNlcmlhbGl6ZWRTdG9yZVN0YXRlICE9PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBzdG9yZS5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYFRoZSBzdG9yZSB3aXRoIGtleSAnJHtrZXl9JyB3YXMgbm90IHNlcmlhbGl6ZWQgYmVjYXVzZSB0aGUgc3RhdGljIGBcbiAgICAgICAgICArIGBtZXRob2QgXFxgJHtjbGFzc05hbWV9LnNlcmlhbGl6ZSgpXFxgIHJldHVybmVkIGEgbm9uLXN0cmluZyB3aXRoIHR5cGUgYFxuICAgICAgICAgICsgYCcke3R5cGVvZiBzZXJpYWxpemVkU3RvcmVTdGF0ZX0nLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN0YXRlVHJlZVtrZXldID0gc2VyaWFsaXplZFN0b3JlU3RhdGU7XG5cbiAgICAgIGlmICh0eXBlb2Ygc3RvcmUuY29uc3RydWN0b3IuZGVzZXJpYWxpemUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gc3RvcmUuY29uc3RydWN0b3IubmFtZTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBUaGUgY2xhc3MgXFxgJHtjbGFzc05hbWV9XFxgIGhhcyBhIFxcYHNlcmlhbGl6ZSgpXFxgIG1ldGhvZCwgYnV0IG5vIGBcbiAgICAgICAgICArIGBjb3JyZXNwb25kaW5nIFxcYGRlc2VyaWFsaXplKClcXGAgbWV0aG9kLmBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RhdGVUcmVlKTtcbiAgfVxuXG4gIGRlc2VyaWFsaXplKHNlcmlhbGl6ZWRTdGF0ZSkge1xuICAgIGxldCBzdGF0ZU1hcDtcblxuICAgIHRyeSB7XG4gICAgICBzdGF0ZU1hcCA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZFN0YXRlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgdmFsdWUgcGFzc2VkIHRvIFxcYCR7Y2xhc3NOYW1lfSNkZXNlcmlhbGl6ZSgpXFxgOiBgXG4gICAgICAgICsgYCR7c2VyaWFsaXplZFN0YXRlfWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fc3RvcmVzKSB7XG4gICAgICBpZiAoIXRoaXMuX3N0b3Jlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgICAgY29uc3Qgc3RvcmUgPSB0aGlzLl9zdG9yZXNba2V5XTtcblxuICAgICAgY29uc3QgZGVzZXJpYWxpemUgPSBzdG9yZS5jb25zdHJ1Y3Rvci5kZXNlcmlhbGl6ZTtcblxuICAgICAgaWYgKHR5cGVvZiBkZXNlcmlhbGl6ZSAhPT0gJ2Z1bmN0aW9uJykgY29udGludWU7XG5cbiAgICAgIGNvbnN0IHN0b3JlU3RhdGVTdHJpbmcgPSBzdGF0ZU1hcFtrZXldO1xuICAgICAgY29uc3Qgc3RvcmVTdGF0ZSA9IGRlc2VyaWFsaXplKHN0b3JlU3RhdGVTdHJpbmcpO1xuXG4gICAgICBzdG9yZS5yZXBsYWNlU3RhdGUoc3RvcmVTdGF0ZSk7XG5cbiAgICAgIGlmICh0eXBlb2Ygc3RvcmUuY29uc3RydWN0b3Iuc2VyaWFsaXplICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IHN0b3JlLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgVGhlIGNsYXNzIFxcYCR7Y2xhc3NOYW1lfVxcYCBoYXMgYSBcXGBkZXNlcmlhbGl6ZSgpXFxgIG1ldGhvZCwgYnV0IG5vIGBcbiAgICAgICAgICArIGBjb3JyZXNwb25kaW5nIFxcYHNlcmlhbGl6ZSgpXFxgIG1ldGhvZC5gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbi8vIEFsaWFzZXNcbkZsdXgucHJvdG90eXBlLmdldENvbnN0YW50cyA9IEZsdXgucHJvdG90eXBlLmdldEFjdGlvbklkcztcbkZsdXgucHJvdG90eXBlLmdldEFsbENvbnN0YW50cyA9IEZsdXgucHJvdG90eXBlLmdldEFsbEFjdGlvbklkcztcbkZsdXgucHJvdG90eXBlLmRlaHlkcmF0ZSA9IEZsdXgucHJvdG90eXBlLnNlcmlhbGl6ZTtcbkZsdXgucHJvdG90eXBlLmh5ZHJhdGUgPSBGbHV4LnByb3RvdHlwZS5kZXNlcmlhbGl6ZTtcblxuZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKENsYXNzKSB7XG4gIHJldHVybiBDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZTtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVzKG9iamVjdCkge1xuICBsZXQgdmFsdWVzID0gW107XG5cbiAgZm9yIChsZXQga2V5IGluIG9iamVjdCkge1xuICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgdmFsdWVzLnB1c2gob2JqZWN0W2tleV0pO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlcztcbn1cblxuY29uc3QgRmx1bW1veCA9IEZsdXg7XG5cbmV4cG9ydCB7XG4gIEZsdXgsXG4gIEZsdW1tb3gsXG4gIFN0b3JlLFxuICBBY3Rpb25zLFxufTtcbiJdfQ==