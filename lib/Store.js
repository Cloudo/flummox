'use strict';

exports.__esModule = true;

var _eventemitter = require('eventemitter3');

var _eventemitter2 = _interopRequireDefault(_eventemitter);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Store
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Stores hold application state. They respond to actions sent by the dispatcher
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * and broadcast change events to listeners, so they can grab the latest data.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * The key thing to remember is that the only way stores receive information
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * from the outside world is via the dispatcher.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Store = function (_EventEmitter) {
  _inherits(Store, _EventEmitter);

  /**
   * Stores are initialized with a reference
   * @type {Object}
   */
  function Store() {
    _classCallCheck(this, Store);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.state = null;

    _this._handlers = {};
    _this._asyncHandlers = {};
    _this._catchAllHandlers = [];
    _this._catchAllAsyncHandlers = {
      begin: [],
      success: [],
      failure: []
    };
    return _this;
  }

  Store.prototype.setState = function setState(newState) {
    // Do a transactional state update if a function is passed
    if (typeof newState === 'function') {
      var prevState = this._isHandlingDispatch ? this._pendingState : this.state;

      newState = newState(prevState);
    }

    if (this._isHandlingDispatch) {
      this._pendingState = this._assignState(this._pendingState, newState);
      this._emitChangeAfterHandlingDispatch = true;
    } else {
      this.state = this._assignState(this.state, newState);
      this.emit('change');
    }
  };

  Store.prototype.replaceState = function replaceState(newState) {
    if (this._isHandlingDispatch) {
      this._pendingState = this._assignState(undefined, newState);
      this._emitChangeAfterHandlingDispatch = true;
    } else {
      this.state = this._assignState(undefined, newState);
      this.emit('change');
    }
  };

  Store.prototype.getStateAsObject = function getStateAsObject() {
    return this.state;
  };

  Store.assignState = function assignState(oldState, newState) {
    return (0, _objectAssign2['default'])({}, oldState, newState);
  };

  Store.prototype._assignState = function _assignState() {
    return (this.constructor.assignState || Store.assignState).apply(undefined, arguments);
  };

  Store.prototype.forceUpdate = function forceUpdate() {
    if (this._isHandlingDispatch) {
      this._emitChangeAfterHandlingDispatch = true;
    } else {
      this.emit('change');
    }
  };

  Store.prototype.register = function register(actionId, handler) {
    actionId = ensureActionId(actionId);

    if (typeof handler !== 'function') return;

    this._handlers[actionId] = handler.bind(this);
  };

  Store.prototype.registerAsync = function registerAsync(actionId, beginHandler, successHandler, failureHandler) {
    actionId = ensureActionId(actionId);

    var asyncHandlers = this._bindAsyncHandlers({
      begin: beginHandler,
      success: successHandler,
      failure: failureHandler
    });

    this._asyncHandlers[actionId] = asyncHandlers;
  };

  Store.prototype.registerAll = function registerAll(handler) {
    if (typeof handler !== 'function') return;

    this._catchAllHandlers.push(handler.bind(this));
  };

  Store.prototype.registerAllAsync = function registerAllAsync(beginHandler, successHandler, failureHandler) {
    var _this2 = this;

    var asyncHandlers = this._bindAsyncHandlers({
      begin: beginHandler,
      success: successHandler,
      failure: failureHandler
    });

    Object.keys(asyncHandlers).forEach(function (key) {
      _this2._catchAllAsyncHandlers[key].push(asyncHandlers[key]);
    });
  };

  Store.prototype._bindAsyncHandlers = function _bindAsyncHandlers(asyncHandlers) {
    for (var key in asyncHandlers) {
      if (!asyncHandlers.hasOwnProperty(key)) continue;

      var handler = asyncHandlers[key];

      if (typeof handler === 'function') {
        asyncHandlers[key] = handler.bind(this);
      } else {
        delete asyncHandlers[key];
      }
    }

    return asyncHandlers;
  };

  Store.prototype.waitFor = function waitFor(tokensOrStores) {
    this._waitFor(tokensOrStores);
  };

  Store.prototype.handler = function handler(payload) {
    var body = payload.body,
        actionId = payload.actionId,
        _async = payload['async'],
        actionArgs = payload.actionArgs,
        error = payload.error;


    var _allHandlers = this._catchAllHandlers;
    var _handler = this._handlers[actionId];

    var _allAsyncHandlers = this._catchAllAsyncHandlers[_async];
    var _asyncHandler = this._asyncHandlers[actionId] && this._asyncHandlers[actionId][_async];

    if (_async) {
      var beginOrFailureHandlers = _allAsyncHandlers.concat([_asyncHandler]);

      switch (_async) {
        case 'begin':
          this._performHandler(beginOrFailureHandlers, actionArgs);
          return;
        case 'failure':
          this._performHandler(beginOrFailureHandlers, [error]);
          return;
        case 'success':
          this._performHandler(_allAsyncHandlers.concat([_asyncHandler || _handler].concat(_asyncHandler && [] || _allHandlers)), [body]);
          return;
        default:
          return;
      }
    }

    this._performHandler(_allHandlers.concat([_handler]), [body]);
  };

  Store.prototype._performHandler = function _performHandler(_handlers, args) {
    this._isHandlingDispatch = true;
    this._pendingState = this._assignState(undefined, this.state);
    this._emitChangeAfterHandlingDispatch = false;

    try {
      this._performHandlers(_handlers, args);
    } finally {
      if (this._emitChangeAfterHandlingDispatch) {
        this.state = this._pendingState;
        this.emit('change');
      }

      this._isHandlingDispatch = false;
      this._pendingState = undefined;
      this._emitChangeAfterHandlingDispatch = false;
    }
  };

  Store.prototype._performHandlers = function _performHandlers(_handlers, args) {
    var _this3 = this;

    _handlers.forEach(function (_handler) {
      return typeof _handler === 'function' && _handler.apply(_this3, args);
    });
  };

  return Store;
}(_eventemitter2['default']);

exports['default'] = Store;


function ensureActionId(actionOrActionId) {
  return typeof actionOrActionId === 'function' ? actionOrActionId._id : actionOrActionId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TdG9yZS5qcyJdLCJuYW1lcyI6WyJTdG9yZSIsInN0YXRlIiwiX2hhbmRsZXJzIiwiX2FzeW5jSGFuZGxlcnMiLCJfY2F0Y2hBbGxIYW5kbGVycyIsIl9jYXRjaEFsbEFzeW5jSGFuZGxlcnMiLCJiZWdpbiIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwic2V0U3RhdGUiLCJuZXdTdGF0ZSIsInByZXZTdGF0ZSIsIl9pc0hhbmRsaW5nRGlzcGF0Y2giLCJfcGVuZGluZ1N0YXRlIiwiX2Fzc2lnblN0YXRlIiwiX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2giLCJlbWl0IiwicmVwbGFjZVN0YXRlIiwidW5kZWZpbmVkIiwiZ2V0U3RhdGVBc09iamVjdCIsImFzc2lnblN0YXRlIiwib2xkU3RhdGUiLCJjb25zdHJ1Y3RvciIsImZvcmNlVXBkYXRlIiwicmVnaXN0ZXIiLCJhY3Rpb25JZCIsImhhbmRsZXIiLCJlbnN1cmVBY3Rpb25JZCIsImJpbmQiLCJyZWdpc3RlckFzeW5jIiwiYmVnaW5IYW5kbGVyIiwic3VjY2Vzc0hhbmRsZXIiLCJmYWlsdXJlSGFuZGxlciIsImFzeW5jSGFuZGxlcnMiLCJfYmluZEFzeW5jSGFuZGxlcnMiLCJyZWdpc3RlckFsbCIsInB1c2giLCJyZWdpc3RlckFsbEFzeW5jIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIndhaXRGb3IiLCJ0b2tlbnNPclN0b3JlcyIsIl93YWl0Rm9yIiwicGF5bG9hZCIsImJvZHkiLCJfYXN5bmMiLCJhY3Rpb25BcmdzIiwiZXJyb3IiLCJfYWxsSGFuZGxlcnMiLCJfaGFuZGxlciIsIl9hbGxBc3luY0hhbmRsZXJzIiwiX2FzeW5jSGFuZGxlciIsImJlZ2luT3JGYWlsdXJlSGFuZGxlcnMiLCJjb25jYXQiLCJfcGVyZm9ybUhhbmRsZXIiLCJhcmdzIiwiX3BlcmZvcm1IYW5kbGVycyIsImFwcGx5IiwiYWN0aW9uT3JBY3Rpb25JZCIsIl9p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L0IsU0FBSzlDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsU0FBS0MsYUFBTCxHQUFxQixLQUFLQyxZQUFMLENBQWtCSSxTQUFsQixFQUE2QixLQUFLakIsS0FBbEMsQ0FBckI7QUFDQSxTQUFLYyxnQ0FBTCxHQUF3QyxLQUF4Qzs7QUFFQSxRQUFJO0FBQ0YsV0FBSzRDLGdCQUFMLENBQXNCekQsU0FBdEIsRUFBaUN3RCxJQUFqQztBQUNELEtBRkQsU0FFVTtBQUNSLFVBQUksS0FBSzNDLGdDQUFULEVBQTJDO0FBQ3pDLGFBQUtkLEtBQUwsR0FBYSxLQUFLWSxhQUFsQjtBQUNBLGFBQUtHLElBQUwsQ0FBVSxRQUFWO0FBQ0Q7O0FBRUQsV0FBS0osbUJBQUwsR0FBMkIsS0FBM0I7QUFDQSxXQUFLQyxhQUFMLEdBQXFCSyxTQUFyQjtBQUNBLFdBQUtILGdDQUFMLEdBQXdDLEtBQXhDO0FBQ0Q7QUFDRixHOztrQkFFRDRDLGdCLDZCQUFpQnpELFMsRUFBV3dELEksRUFBTTtBQUFBOztBQUNoQ3hELGNBQVVzQyxPQUFWLENBQWtCO0FBQUEsYUFDZixPQUFPWSxRQUFQLEtBQW9CLFVBQXJCLElBQW9DQSxTQUFTUSxLQUFULFNBQXFCRixJQUFyQixDQURwQjtBQUFBLEtBQWxCO0FBRUQsRzs7Ozs7cUJBL0xrQjFELEs7OztBQWtNckIsU0FBUzJCLGNBQVQsQ0FBd0JrQyxnQkFBeEIsRUFBMEM7QUFDeEMsU0FBTyxPQUFPQSxnQkFBUCxLQUE0QixVQUE1QixHQUNIQSxpQkFBaUJDLEdBRGQsR0FFSEQsZ0JBRko7QUFHRCIsImZpbGUiOiJTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3RvcmVcbiAqXG4gKiBTdG9yZXMgaG9sZCBhcHBsaWNhdGlvbiBzdGF0ZS4gVGhleSByZXNwb25kIHRvIGFjdGlvbnMgc2VudCBieSB0aGUgZGlzcGF0Y2hlclxuICogYW5kIGJyb2FkY2FzdCBjaGFuZ2UgZXZlbnRzIHRvIGxpc3RlbmVycywgc28gdGhleSBjYW4gZ3JhYiB0aGUgbGF0ZXN0IGRhdGEuXG4gKiBUaGUga2V5IHRoaW5nIHRvIHJlbWVtYmVyIGlzIHRoYXQgdGhlIG9ubHkgd2F5IHN0b3JlcyByZWNlaXZlIGluZm9ybWF0aW9uXG4gKiBmcm9tIHRoZSBvdXRzaWRlIHdvcmxkIGlzIHZpYSB0aGUgZGlzcGF0Y2hlci5cbiAqL1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xuaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIC8qKlxuICAgKiBTdG9yZXMgYXJlIGluaXRpYWxpemVkIHdpdGggYSByZWZlcmVuY2VcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0gbnVsbDtcblxuICAgIHRoaXMuX2hhbmRsZXJzID0ge307XG4gICAgdGhpcy5fYXN5bmNIYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuX2NhdGNoQWxsSGFuZGxlcnMgPSBbXTtcbiAgICB0aGlzLl9jYXRjaEFsbEFzeW5jSGFuZGxlcnMgPSB7XG4gICAgICBiZWdpbjogW10sXG4gICAgICBzdWNjZXNzOiBbXSxcbiAgICAgIGZhaWx1cmU6IFtdLFxuICAgIH07XG4gIH1cblxuICBzZXRTdGF0ZShuZXdTdGF0ZSkge1xuICAgIC8vIERvIGEgdHJhbnNhY3Rpb25hbCBzdGF0ZSB1cGRhdGUgaWYgYSBmdW5jdGlvbiBpcyBwYXNzZWRcbiAgICBpZiAodHlwZW9mIG5ld1N0YXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBwcmV2U3RhdGUgPSB0aGlzLl9pc0hhbmRsaW5nRGlzcGF0Y2hcbiAgICAgICAgPyB0aGlzLl9wZW5kaW5nU3RhdGVcbiAgICAgICAgOiB0aGlzLnN0YXRlO1xuXG4gICAgICBuZXdTdGF0ZSA9IG5ld1N0YXRlKHByZXZTdGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2lzSGFuZGxpbmdEaXNwYXRjaCkge1xuICAgICAgdGhpcy5fcGVuZGluZ1N0YXRlID0gdGhpcy5fYXNzaWduU3RhdGUodGhpcy5fcGVuZGluZ1N0YXRlLCBuZXdTdGF0ZSk7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlQWZ0ZXJIYW5kbGluZ0Rpc3BhdGNoID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuX2Fzc2lnblN0YXRlKHRoaXMuc3RhdGUsIG5ld1N0YXRlKTtcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcmVwbGFjZVN0YXRlKG5ld1N0YXRlKSB7XG4gICAgaWYgKHRoaXMuX2lzSGFuZGxpbmdEaXNwYXRjaCkge1xuICAgICAgdGhpcy5fcGVuZGluZ1N0YXRlID0gdGhpcy5fYXNzaWduU3RhdGUodW5kZWZpbmVkLCBuZXdTdGF0ZSk7XG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlQWZ0ZXJIYW5kbGluZ0Rpc3BhdGNoID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuX2Fzc2lnblN0YXRlKHVuZGVmaW5lZCwgbmV3U3RhdGUpO1xuICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICBnZXRTdGF0ZUFzT2JqZWN0KCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICB9XG5cbiAgc3RhdGljIGFzc2lnblN0YXRlKG9sZFN0YXRlLCBuZXdTdGF0ZSkge1xuICAgIHJldHVybiBhc3NpZ24oe30sIG9sZFN0YXRlLCBuZXdTdGF0ZSk7XG4gIH1cblxuICBfYXNzaWduU3RhdGUoLi4uYXJncyl7XG4gICAgcmV0dXJuICh0aGlzLmNvbnN0cnVjdG9yLmFzc2lnblN0YXRlIHx8IFN0b3JlLmFzc2lnblN0YXRlKSguLi5hcmdzKTtcbiAgfVxuXG4gIGZvcmNlVXBkYXRlKCkge1xuICAgIGlmICh0aGlzLl9pc0hhbmRsaW5nRGlzcGF0Y2gpIHtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VBZnRlckhhbmRsaW5nRGlzcGF0Y2ggPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyKGFjdGlvbklkLCBoYW5kbGVyKSB7XG4gICAgYWN0aW9uSWQgPSBlbnN1cmVBY3Rpb25JZChhY3Rpb25JZCk7XG5cbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHJldHVybjtcblxuICAgIHRoaXMuX2hhbmRsZXJzW2FjdGlvbklkXSA9IGhhbmRsZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQXN5bmMoYWN0aW9uSWQsIGJlZ2luSGFuZGxlciwgc3VjY2Vzc0hhbmRsZXIsIGZhaWx1cmVIYW5kbGVyKSB7XG4gICAgYWN0aW9uSWQgPSBlbnN1cmVBY3Rpb25JZChhY3Rpb25JZCk7XG5cbiAgICBjb25zdCBhc3luY0hhbmRsZXJzID0gdGhpcy5fYmluZEFzeW5jSGFuZGxlcnMoe1xuICAgICAgYmVnaW46IGJlZ2luSGFuZGxlcixcbiAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NIYW5kbGVyLFxuICAgICAgZmFpbHVyZTogZmFpbHVyZUhhbmRsZXIsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9hc3luY0hhbmRsZXJzW2FjdGlvbklkXSA9IGFzeW5jSGFuZGxlcnM7XG4gIH1cblxuICByZWdpc3RlckFsbChoYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICB0aGlzLl9jYXRjaEFsbEhhbmRsZXJzLnB1c2goaGFuZGxlci5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQWxsQXN5bmMoYmVnaW5IYW5kbGVyLCBzdWNjZXNzSGFuZGxlciwgZmFpbHVyZUhhbmRsZXIpIHtcbiAgICBjb25zdCBhc3luY0hhbmRsZXJzID0gdGhpcy5fYmluZEFzeW5jSGFuZGxlcnMoe1xuICAgICAgYmVnaW46IGJlZ2luSGFuZGxlcixcbiAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NIYW5kbGVyLFxuICAgICAgZmFpbHVyZTogZmFpbHVyZUhhbmRsZXIsXG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyhhc3luY0hhbmRsZXJzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHRoaXMuX2NhdGNoQWxsQXN5bmNIYW5kbGVyc1trZXldLnB1c2goXG4gICAgICAgIGFzeW5jSGFuZGxlcnNba2V5XVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9iaW5kQXN5bmNIYW5kbGVycyhhc3luY0hhbmRsZXJzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFzeW5jSGFuZGxlcnMpIHtcbiAgICAgIGlmICghYXN5bmNIYW5kbGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgaGFuZGxlciA9IGFzeW5jSGFuZGxlcnNba2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGFzeW5jSGFuZGxlcnNba2V5XSA9IGhhbmRsZXIuYmluZCh0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBhc3luY0hhbmRsZXJzW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzeW5jSGFuZGxlcnM7XG4gIH1cblxuICB3YWl0Rm9yKHRva2Vuc09yU3RvcmVzKSB7XG4gICAgdGhpcy5fd2FpdEZvcih0b2tlbnNPclN0b3Jlcyk7XG4gIH1cblxuICBoYW5kbGVyKHBheWxvYWQpIHtcbiAgICBjb25zdCB7XG4gICAgICBib2R5LFxuICAgICAgYWN0aW9uSWQsXG4gICAgICAnYXN5bmMnOiBfYXN5bmMsXG4gICAgICBhY3Rpb25BcmdzLFxuICAgICAgZXJyb3JcbiAgICB9ID0gcGF5bG9hZDtcblxuICAgIGNvbnN0IF9hbGxIYW5kbGVycyA9IHRoaXMuX2NhdGNoQWxsSGFuZGxlcnM7XG4gICAgY29uc3QgX2hhbmRsZXIgPSB0aGlzLl9oYW5kbGVyc1thY3Rpb25JZF07XG5cbiAgICBjb25zdCBfYWxsQXN5bmNIYW5kbGVycyA9IHRoaXMuX2NhdGNoQWxsQXN5bmNIYW5kbGVyc1tfYXN5bmNdO1xuICAgIGNvbnN0IF9hc3luY0hhbmRsZXIgPSB0aGlzLl9hc3luY0hhbmRsZXJzW2FjdGlvbklkXVxuICAgICAgJiYgdGhpcy5fYXN5bmNIYW5kbGVyc1thY3Rpb25JZF1bX2FzeW5jXTtcblxuICAgIGlmIChfYXN5bmMpIHtcbiAgICAgIGxldCBiZWdpbk9yRmFpbHVyZUhhbmRsZXJzID0gX2FsbEFzeW5jSGFuZGxlcnMuY29uY2F0KFtfYXN5bmNIYW5kbGVyXSk7XG5cbiAgICAgIHN3aXRjaCAoX2FzeW5jKSB7XG4gICAgICAgIGNhc2UgJ2JlZ2luJzpcbiAgICAgICAgICB0aGlzLl9wZXJmb3JtSGFuZGxlcihiZWdpbk9yRmFpbHVyZUhhbmRsZXJzLCBhY3Rpb25BcmdzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgJ2ZhaWx1cmUnOlxuICAgICAgICAgIHRoaXMuX3BlcmZvcm1IYW5kbGVyKGJlZ2luT3JGYWlsdXJlSGFuZGxlcnMsIFtlcnJvcl0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgICAgdGhpcy5fcGVyZm9ybUhhbmRsZXIoX2FsbEFzeW5jSGFuZGxlcnMuY29uY2F0KFtcbiAgICAgICAgICAgIChfYXN5bmNIYW5kbGVyIHx8IF9oYW5kbGVyKVxuICAgICAgICAgIF0uY29uY2F0KF9hc3luY0hhbmRsZXIgJiYgW10gfHwgX2FsbEhhbmRsZXJzKSksIFtib2R5XSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9wZXJmb3JtSGFuZGxlcihfYWxsSGFuZGxlcnMuY29uY2F0KFtfaGFuZGxlcl0pLCBbYm9keV0pO1xuICB9XG5cbiAgX3BlcmZvcm1IYW5kbGVyKF9oYW5kbGVycywgYXJncykge1xuICAgIHRoaXMuX2lzSGFuZGxpbmdEaXNwYXRjaCA9IHRydWU7XG4gICAgdGhpcy5fcGVuZGluZ1N0YXRlID0gdGhpcy5fYXNzaWduU3RhdGUodW5kZWZpbmVkLCB0aGlzLnN0YXRlKTtcbiAgICB0aGlzLl9lbWl0Q2hhbmdlQWZ0ZXJIYW5kbGluZ0Rpc3BhdGNoID0gZmFsc2U7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fcGVyZm9ybUhhbmRsZXJzKF9oYW5kbGVycywgYXJncyk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICh0aGlzLl9lbWl0Q2hhbmdlQWZ0ZXJIYW5kbGluZ0Rpc3BhdGNoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLl9wZW5kaW5nU3RhdGU7XG4gICAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2lzSGFuZGxpbmdEaXNwYXRjaCA9IGZhbHNlO1xuICAgICAgdGhpcy5fcGVuZGluZ1N0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fZW1pdENoYW5nZUFmdGVySGFuZGxpbmdEaXNwYXRjaCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIF9wZXJmb3JtSGFuZGxlcnMoX2hhbmRsZXJzLCBhcmdzKSB7XG4gICAgX2hhbmRsZXJzLmZvckVhY2goX2hhbmRsZXIgPT5cbiAgICAgICh0eXBlb2YgX2hhbmRsZXIgPT09ICdmdW5jdGlvbicpICYmIF9oYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbnN1cmVBY3Rpb25JZChhY3Rpb25PckFjdGlvbklkKSB7XG4gIHJldHVybiB0eXBlb2YgYWN0aW9uT3JBY3Rpb25JZCA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gYWN0aW9uT3JBY3Rpb25JZC5faWRcbiAgICA6IGFjdGlvbk9yQWN0aW9uSWQ7XG59XG4iXX0=