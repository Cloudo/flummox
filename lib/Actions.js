'use strict';

exports.__esModule = true;

var _uniqueid = require('uniqueid');

var _uniqueid2 = _interopRequireDefault(_uniqueid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Actions
                                                                                                                                                           *
                                                                                                                                                           * Instances of the Actions class represent a set of actions. (In Flux parlance,
                                                                                                                                                           * these might be more accurately denoted as Action Creators, while Action
                                                                                                                                                           * refers to the payload sent to the dispatcher, but this is... confusing. We
                                                                                                                                                           * will use Action to mean the function you call to trigger a dispatch.)
                                                                                                                                                           *
                                                                                                                                                           * Create actions by extending from the base Actions class and adding methods.
                                                                                                                                                           * All methods on the prototype (except the constructor) will be
                                                                                                                                                           * converted into actions. The return value of an action is used as the body
                                                                                                                                                           * of the payload sent to the dispatcher.
                                                                                                                                                           */

var Actions = function () {
  function Actions() {
    _classCallCheck(this, Actions);

    this._baseId = (0, _uniqueid2['default'])();

    var methodNames = this._getActionMethodNames();
    for (var i = 0; i < methodNames.length; i++) {
      var methodName = methodNames[i];
      this._wrapAction(methodName);
    }

    this.getConstants = this.getActionIds;
  }

  Actions.prototype.getActionIds = function getActionIds() {
    var _this = this;

    return this._getActionMethodNames().reduce(function (result, actionName) {
      result[actionName] = _this[actionName]._id;
      return result;
    }, {});
  };

  Actions.prototype._getActionMethodNames = function _getActionMethodNames(instance) {
    var _this2 = this;

    return Object.getOwnPropertyNames(this.constructor.prototype).filter(function (name) {
      return name !== 'constructor' && typeof _this2[name] === 'function';
    });
  };

  Actions.prototype._wrapAction = function _wrapAction(methodName) {
    var _this3 = this;

    var originalMethod = this[methodName];
    var actionId = this._createActionId(methodName);

    var action = function action() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var body = originalMethod.apply(_this3, args);

      if (isPromise(body)) {
        var promise = body;
        _this3._dispatchAsync(actionId, promise, args, methodName);
      } else {
        _this3._dispatch(actionId, body, args, methodName);
      }

      // Return original method's return value to caller
      return body;
    };

    action._id = actionId;

    this[methodName] = action;
  };

  /**
   * Create unique string constant for an action method, using
   * @param {string} methodName - Name of the action method
   */


  Actions.prototype._createActionId = function _createActionId(methodName) {
    return this._baseId + '-' + methodName;
  };

  Actions.prototype._dispatch = function _dispatch(actionId, body, args, methodName) {
    if (typeof this.dispatch === 'function') {
      if (typeof body !== 'undefined') {
        this.dispatch(actionId, body, args);
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('You\'ve attempted to perform the action ' + (this.constructor.name + '#' + methodName + ', but it hasn\'t been added ') + 'to a Flux instance.');
      }
    }

    return body;
  };

  Actions.prototype._dispatchAsync = function _dispatchAsync(actionId, promise, args, methodName) {
    if (typeof this.dispatchAsync === 'function') {
      this.dispatchAsync(actionId, promise, args);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('You\'ve attempted to perform the asynchronous action ' + (this.constructor.name + '#' + methodName + ', but it hasn\'t been added ') + 'to a Flux instance.');
      }
    }
  };

  return Actions;
}();

exports['default'] = Actions;


function isPromise(value) {
  return value && typeof value.then === 'function';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BY3Rpb25zLmpzIl0sIm5hbWVzIjpbIkFjdGlvbnMiLCJfYmFzZUlkIiwibWV0aG9kTmFtZXMiLCJfZ2V0QWN0aW9uTWV0aG9kTmFtZXMiLCJpIiwibGVuZ3RoIiwibWV0aG9kTmFtZSIsIl93cmFwQWN0aW9uIiwiZ2V0Q29uc3RhbnRzIiwiZ2V0QWN0aW9uSWRzIiwicmVkdWNlIiwicmVzdWx0IiwiYWN0aW9uTmFtZSIsIl9pZCIsImluc3RhbmNlIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiZmlsdGVyIiwibmFtZSIsIm9yaWdpbmFsTWV0aG9kIiwiYWN0aW9uSWQiLCJfY3JlYXRlQWN0aW9uSWQiLCJhY3Rpb24iLCJhcmdzIiwiYm9keSIsImFwcGx5IiwiaXNQcm9taXNlIiwicHJvbWlzZSIsIl9kaXNwYXRjaEFzeW5jIiwiX2Rpc3BhdGNoIiwiZGlzcGF0Y2giLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJjb25zb2xlIiwid2FybiIsImRpc3BhdGNoQXN5bmMiLCJ2YWx1ZSIsInRoZW4iXSwibWFwcGluZ3MiOiI7Ozs7QUFjQTs7Ozs7OzBKQWRBOzs7Ozs7Ozs7Ozs7OztJQWdCcUJBLE87QUFFbkIscUJBQWM7QUFBQTs7QUFFWixTQUFLQyxPQUFMLEdBQWUsNEJBQWY7O0FBRUEsUUFBTUMsY0FBYyxLQUFLQyxxQkFBTCxFQUFwQjtBQUNBLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRixZQUFZRyxNQUFoQyxFQUF3Q0QsR0FBeEMsRUFBNkM7QUFDM0MsVUFBTUUsYUFBYUosWUFBWUUsQ0FBWixDQUFuQjtBQUNBLFdBQUtHLFdBQUwsQ0FBaUJELFVBQWpCO0FBQ0Q7O0FBRUQsU0FBS0UsWUFBTCxHQUFvQixLQUFLQyxZQUF6QjtBQUNEOztvQkFFREEsWSwyQkFBZTtBQUFBOztBQUNiLFdBQU8sS0FBS04scUJBQUwsR0FBNkJPLE1BQTdCLENBQW9DLFVBQUNDLE1BQUQsRUFBU0MsVUFBVCxFQUF3QjtBQUNqRUQsYUFBT0MsVUFBUCxJQUFxQixNQUFLQSxVQUFMLEVBQWlCQyxHQUF0QztBQUNBLGFBQU9GLE1BQVA7QUFDRCxLQUhNLEVBR0osRUFISSxDQUFQO0FBSUQsRzs7b0JBRURSLHFCLGtDQUFzQlcsUSxFQUFVO0FBQUE7O0FBQzlCLFdBQU9DLE9BQU9DLG1CQUFQLENBQTJCLEtBQUtDLFdBQUwsQ0FBaUJDLFNBQTVDLEVBQ0pDLE1BREksQ0FDRztBQUFBLGFBQ05DLFNBQVMsYUFBVCxJQUNBLE9BQU8sT0FBS0EsSUFBTCxDQUFQLEtBQXNCLFVBRmhCO0FBQUEsS0FESCxDQUFQO0FBS0QsRzs7b0JBRURiLFcsd0JBQVlELFUsRUFBWTtBQUFBOztBQUN0QixRQUFNZSxpQkFBaUIsS0FBS2YsVUFBTCxDQUF2QjtBQUNBLFFBQU1nQixXQUFXLEtBQUtDLGVBQUwsQ0FBcUJqQixVQUFyQixDQUFqQjs7QUFFQSxRQUFNa0IsU0FBUyxTQUFUQSxNQUFTLEdBQWE7QUFBQSx3Q0FBVEMsSUFBUztBQUFUQSxZQUFTO0FBQUE7O0FBQzFCLFVBQU1DLE9BQU9MLGVBQWVNLEtBQWYsU0FBMkJGLElBQTNCLENBQWI7O0FBRUEsVUFBSUcsVUFBVUYsSUFBVixDQUFKLEVBQXFCO0FBQ25CLFlBQU1HLFVBQVVILElBQWhCO0FBQ0EsZUFBS0ksY0FBTCxDQUFvQlIsUUFBcEIsRUFBOEJPLE9BQTlCLEVBQXVDSixJQUF2QyxFQUE2Q25CLFVBQTdDO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsZUFBS3lCLFNBQUwsQ0FBZVQsUUFBZixFQUF5QkksSUFBekIsRUFBK0JELElBQS9CLEVBQXFDbkIsVUFBckM7QUFDRDs7QUFFRDtBQUNBLGFBQU9vQixJQUFQO0FBQ0QsS0FaRDs7QUFjQUYsV0FBT1gsR0FBUCxHQUFhUyxRQUFiOztBQUVBLFNBQUtoQixVQUFMLElBQW1Ca0IsTUFBbkI7QUFDRCxHOztBQUVEOzs7Ozs7b0JBSUFELGUsNEJBQWdCakIsVSxFQUFZO0FBQzFCLFdBQVUsS0FBS0wsT0FBZixTQUEwQkssVUFBMUI7QUFDRCxHOztvQkFFRHlCLFMsc0JBQVVULFEsRUFBVUksSSxFQUFNRCxJLEVBQU1uQixVLEVBQVk7QUFDMUMsUUFBSSxPQUFPLEtBQUswQixRQUFaLEtBQXlCLFVBQTdCLEVBQXlDO0FBQ3ZDLFVBQUksT0FBT04sSUFBUCxLQUFnQixXQUFwQixFQUFpQztBQUMvQixhQUFLTSxRQUFMLENBQWNWLFFBQWQsRUFBd0JJLElBQXhCLEVBQThCRCxJQUE5QjtBQUNEO0FBQ0YsS0FKRCxNQUlPO0FBQ0wsVUFBSVEsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDQyxnQkFBUUMsSUFBUixDQUNFLDhDQUNHLEtBQUtwQixXQUFMLENBQWlCRyxJQURwQixTQUM0QmQsVUFENUIsMERBREY7QUFLRDtBQUNGOztBQUVELFdBQU9vQixJQUFQO0FBQ0QsRzs7b0JBRURJLGMsMkJBQWVSLFEsRUFBVU8sTyxFQUFTSixJLEVBQU1uQixVLEVBQVk7QUFDbEQsUUFBSSxPQUFPLEtBQUtnQyxhQUFaLEtBQThCLFVBQWxDLEVBQThDO0FBQzVDLFdBQUtBLGFBQUwsQ0FBbUJoQixRQUFuQixFQUE2Qk8sT0FBN0IsRUFBc0NKLElBQXRDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsVUFBSVEsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLFlBQTdCLEVBQTJDO0FBQ3pDQyxnQkFBUUMsSUFBUixDQUNFLDJEQUNHLEtBQUtwQixXQUFMLENBQWlCRyxJQURwQixTQUM0QmQsVUFENUIsMERBREY7QUFLRDtBQUNGO0FBQ0YsRzs7Ozs7cUJBM0ZrQk4sTzs7O0FBK0ZyQixTQUFTNEIsU0FBVCxDQUFtQlcsS0FBbkIsRUFBMEI7QUFDeEIsU0FBT0EsU0FBUyxPQUFPQSxNQUFNQyxJQUFiLEtBQXNCLFVBQXRDO0FBQ0QiLCJmaWxlIjoiQWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWN0aW9uc1xuICpcbiAqIEluc3RhbmNlcyBvZiB0aGUgQWN0aW9ucyBjbGFzcyByZXByZXNlbnQgYSBzZXQgb2YgYWN0aW9ucy4gKEluIEZsdXggcGFybGFuY2UsXG4gKiB0aGVzZSBtaWdodCBiZSBtb3JlIGFjY3VyYXRlbHkgZGVub3RlZCBhcyBBY3Rpb24gQ3JlYXRvcnMsIHdoaWxlIEFjdGlvblxuICogcmVmZXJzIHRvIHRoZSBwYXlsb2FkIHNlbnQgdG8gdGhlIGRpc3BhdGNoZXIsIGJ1dCB0aGlzIGlzLi4uIGNvbmZ1c2luZy4gV2VcbiAqIHdpbGwgdXNlIEFjdGlvbiB0byBtZWFuIHRoZSBmdW5jdGlvbiB5b3UgY2FsbCB0byB0cmlnZ2VyIGEgZGlzcGF0Y2guKVxuICpcbiAqIENyZWF0ZSBhY3Rpb25zIGJ5IGV4dGVuZGluZyBmcm9tIHRoZSBiYXNlIEFjdGlvbnMgY2xhc3MgYW5kIGFkZGluZyBtZXRob2RzLlxuICogQWxsIG1ldGhvZHMgb24gdGhlIHByb3RvdHlwZSAoZXhjZXB0IHRoZSBjb25zdHJ1Y3Rvcikgd2lsbCBiZVxuICogY29udmVydGVkIGludG8gYWN0aW9ucy4gVGhlIHJldHVybiB2YWx1ZSBvZiBhbiBhY3Rpb24gaXMgdXNlZCBhcyB0aGUgYm9keVxuICogb2YgdGhlIHBheWxvYWQgc2VudCB0byB0aGUgZGlzcGF0Y2hlci5cbiAqL1xuXG5pbXBvcnQgdW5pcXVlSWQgZnJvbSAndW5pcXVlaWQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpb25zIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuX2Jhc2VJZCA9IHVuaXF1ZUlkKCk7XG5cbiAgICBjb25zdCBtZXRob2ROYW1lcyA9IHRoaXMuX2dldEFjdGlvbk1ldGhvZE5hbWVzKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXRob2ROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWVzW2ldO1xuICAgICAgdGhpcy5fd3JhcEFjdGlvbihtZXRob2ROYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldENvbnN0YW50cyA9IHRoaXMuZ2V0QWN0aW9uSWRzO1xuICB9XG5cbiAgZ2V0QWN0aW9uSWRzKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRBY3Rpb25NZXRob2ROYW1lcygpLnJlZHVjZSgocmVzdWx0LCBhY3Rpb25OYW1lKSA9PiB7XG4gICAgICByZXN1bHRbYWN0aW9uTmFtZV0gPSB0aGlzW2FjdGlvbk5hbWVdLl9pZDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgX2dldEFjdGlvbk1ldGhvZE5hbWVzKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlKVxuICAgICAgLmZpbHRlcihuYW1lID0+XG4gICAgICAgIG5hbWUgIT09ICdjb25zdHJ1Y3RvcicgJiZcbiAgICAgICAgdHlwZW9mIHRoaXNbbmFtZV0gPT09ICdmdW5jdGlvbidcbiAgICAgICk7XG4gIH1cblxuICBfd3JhcEFjdGlvbihtZXRob2ROYW1lKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxNZXRob2QgPSB0aGlzW21ldGhvZE5hbWVdO1xuICAgIGNvbnN0IGFjdGlvbklkID0gdGhpcy5fY3JlYXRlQWN0aW9uSWQobWV0aG9kTmFtZSk7XG5cbiAgICBjb25zdCBhY3Rpb24gPSAoLi4uYXJncykgPT4ge1xuICAgICAgY29uc3QgYm9keSA9IG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICBpZiAoaXNQcm9taXNlKGJvZHkpKSB7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSBib2R5O1xuICAgICAgICB0aGlzLl9kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBwcm9taXNlLCBhcmdzLCBtZXRob2ROYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoKGFjdGlvbklkLCBib2R5LCBhcmdzLCBtZXRob2ROYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV0dXJuIG9yaWdpbmFsIG1ldGhvZCdzIHJldHVybiB2YWx1ZSB0byBjYWxsZXJcbiAgICAgIHJldHVybiBib2R5O1xuICAgIH07XG5cbiAgICBhY3Rpb24uX2lkID0gYWN0aW9uSWQ7XG5cbiAgICB0aGlzW21ldGhvZE5hbWVdID0gYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB1bmlxdWUgc3RyaW5nIGNvbnN0YW50IGZvciBhbiBhY3Rpb24gbWV0aG9kLCB1c2luZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSAtIE5hbWUgb2YgdGhlIGFjdGlvbiBtZXRob2RcbiAgICovXG4gIF9jcmVhdGVBY3Rpb25JZChtZXRob2ROYW1lKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuX2Jhc2VJZH0tJHttZXRob2ROYW1lfWA7XG4gIH1cblxuICBfZGlzcGF0Y2goYWN0aW9uSWQsIGJvZHksIGFyZ3MsIG1ldGhvZE5hbWUpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZGlzcGF0Y2ggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICh0eXBlb2YgYm9keSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5kaXNwYXRjaChhY3Rpb25JZCwgYm9keSwgYXJncyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBwZXJmb3JtIHRoZSBhY3Rpb24gYFxuICAgICAgICArIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0jJHttZXRob2ROYW1lfSwgYnV0IGl0IGhhc24ndCBiZWVuIGFkZGVkIGBcbiAgICAgICAgKyBgdG8gYSBGbHV4IGluc3RhbmNlLmBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYm9keTtcbiAgfVxuXG4gIF9kaXNwYXRjaEFzeW5jKGFjdGlvbklkLCBwcm9taXNlLCBhcmdzLCBtZXRob2ROYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmRpc3BhdGNoQXN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hBc3luYyhhY3Rpb25JZCwgcHJvbWlzZSwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgWW91J3ZlIGF0dGVtcHRlZCB0byBwZXJmb3JtIHRoZSBhc3luY2hyb25vdXMgYWN0aW9uIGBcbiAgICAgICAgKyBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IyR7bWV0aG9kTmFtZX0sIGJ1dCBpdCBoYXNuJ3QgYmVlbiBhZGRlZCBgXG4gICAgICAgICsgYHRvIGEgRmx1eCBpbnN0YW5jZS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuZnVuY3Rpb24gaXNQcm9taXNlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbiJdfQ==