'use strict';

exports.__esModule = true;
exports.staticProperties = exports.instanceMethods = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Flux = require('../Flux');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var instanceMethods = {
  getChildContext: function getChildContext() {
    var flux = this.getFlux();

    if (!flux) return {};

    return { flux: flux };
  },
  getFlux: function getFlux() {
    return this.props.flux || this.context.flux;
  },
  initialize: function initialize() {
    this._fluxStateGetters = [];
    this._fluxListeners = {};
    this.flux = this.getFlux();

    if (!(this.flux instanceof _Flux.Flux)) {
      // TODO: print the actual class name here
      throw new Error('fluxMixin: Could not find Flux instance. Ensure that your component ' + 'has either `this.context.flux` or `this.props.flux`.');
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    var flux = this.getFlux();

    for (var key in this._fluxListeners) {
      if (!this._fluxListeners.hasOwnProperty(key)) continue;

      var store = flux.getStore(key);
      if (typeof store === 'undefined') continue;

      var listener = this._fluxListeners[key];

      store.removeListener('change', listener);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.updateStores(nextProps);
  },
  updateStores: function updateStores() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    var state = this.getStoreState(props);
    this.setState(state);
  },
  getStoreState: function getStoreState() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

    return this._fluxStateGetters.reduce(function (result, stateGetter) {
      var getter = stateGetter.getter,
          stores = stateGetter.stores;

      var stateFromStores = getter(stores, props);
      return (0, _objectAssign2['default'])(result, stateFromStores);
    }, {});
  },


  /**
   * Connect component to stores, get the combined initial state, and
   * subscribe to future changes. There are three ways to call it. The
   * simplest is to pass a single store key and, optionally, a state getter.
   * The state getter is a function that takes the store as a parameter and
   * returns the state that should be passed to the component's `setState()`.
   * If no state getter is specified, the default getter is used, which simply
   * returns the entire store state.
   *
   * The second form accepts an array of store keys. With this form, the state
   * getter is called once with an array of store instances (in the same order
   * as the store keys). the default getter performance a reduce on the entire
   * state for each store.
   *
   * The last form accepts an object of store keys mapped to state getters. As
   * a shortcut, you can pass `null` as a state getter to use the default
   * state getter.
   *
   * Returns the combined initial state of all specified stores.
   *
   * This way you can write all the initialization and update logic in a single
   * location, without having to mess with adding/removing listeners.
   *
   * @type {string|array|object} stateGetterMap - map of keys to getters
   * @returns {object} Combined initial state of stores
   */
  connectToStores: function connectToStores() {
    var _this = this;

    var stateGetterMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var stateGetter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var flux = this.getFlux();

    var getStore = function getStore(key) {
      var store = flux.getStore(key);

      if (typeof store === 'undefined') {
        throw new Error('connectToStores(): Store with key \'' + key + '\' does not exist.');
      }

      return store;
    };

    if (typeof stateGetterMap === 'string') {
      var key = stateGetterMap;
      var store = getStore(key);
      var getter = stateGetter || defaultStateGetter;

      this._fluxStateGetters.push({ stores: store, getter: getter });
      var listener = createStoreListener(this, store, getter);

      store.addListener('change', listener);
      this._fluxListeners[key] = listener;
    } else if (Array.isArray(stateGetterMap)) {
      (function () {
        var stores = stateGetterMap.map(getStore);
        var getter = stateGetter || defaultReduceStateGetter;

        _this._fluxStateGetters.push({ stores: stores, getter: getter });
        var listener = createStoreListener(_this, stores, getter);

        stateGetterMap.forEach(function (key, index) {
          var store = stores[index];
          store.addListener('change', listener);
          _this._fluxListeners[key] = listener;
        });
      })();
    } else {
      for (var _key in stateGetterMap) {
        var _store = getStore(_key);
        var _getter = stateGetterMap[_key] || defaultStateGetter;

        this._fluxStateGetters.push({ stores: _store, getter: _getter });
        var _listener = createStoreListener(this, _store, _getter);

        _store.addListener('change', _listener);
        this._fluxListeners[_key] = _listener;
      }
    }

    return this.getStoreState();
  }
}; /**
    * React Component methods. These are the primitives used to implement
    * fluxMixin and FluxComponent.
    *
    * Exposes a Flux instance as `this.flux`. This requires that flux be passed as
    * either context or as a prop (prop takes precedence). Children also are given
    * access to flux instance as `context.flux`.
    *
    * It also adds the method `connectToStores()`, which ensures that the component
    * state stays in sync with the specified Flux stores. See the inline docs
    * of `connectToStores` for details.
    */

var staticProperties = {
  contextTypes: {
    flux: _react.PropTypes.instanceOf(_Flux.Flux)
  },

  childContextTypes: {
    flux: _react.PropTypes.instanceOf(_Flux.Flux)
  },

  propTypes: {
    connectToStores: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string), _react.PropTypes.object]),
    flux: _react.PropTypes.instanceOf(_Flux.Flux),
    render: _react2['default'].PropTypes.func,
    stateGetter: _react2['default'].PropTypes.func
  }
};

exports.instanceMethods = instanceMethods;
exports.staticProperties = staticProperties;


function createStoreListener(component, store, storeStateGetter) {
  return function () {
    var state = storeStateGetter(store, this.props);
    this.setState(state);
  }.bind(component);
}

function defaultStateGetter(store) {
  return store.getStateAsObject();
}

function defaultReduceStateGetter(stores) {
  return stores.reduce(function (result, store) {
    return (0, _objectAssign2['default'])(result, store.getStateAsObject());
  }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvcmVhY3RDb21wb25lbnRNZXRob2RzLmpzIl0sIm5hbWVzIjpbImluc3RhbmNlTWV0aG9kcyIsImdldENoaWxkQ29udGV4dCIsImZsdXgiLCJnZXRGbHV4IiwicHJvcHMiLCJjb250ZXh0IiwiaW5pdGlhbGl6ZSIsIl9mbHV4U3RhdGVHZXR0ZXJzIiwiX2ZsdXhMaXN0ZW5lcnMiLCJFcnJvciIsImNvbXBvbmVudFdpbGxVbm1vdW50Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJzdG9yZSIsImdldFN0b3JlIiwibGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJ1cGRhdGVTdG9yZXMiLCJzdGF0ZSIsImdldFN0b3JlU3RhdGUiLCJzZXRTdGF0ZSIsInJlZHVjZSIsInJlc3VsdCIsInN0YXRlR2V0dGVyIiwiZ2V0dGVyIiwic3RvcmVzIiwic3RhdGVGcm9tU3RvcmVzIiwiY29ubmVjdFRvU3RvcmVzIiwic3RhdGVHZXR0ZXJNYXAiLCJkZWZhdWx0U3RhdGVHZXR0ZXIiLCJwdXNoIiwiY3JlYXRlU3RvcmVMaXN0ZW5lciIsImFkZExpc3RlbmVyIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZGVmYXVsdFJlZHVjZVN0YXRlR2V0dGVyIiwiZm9yRWFjaCIsImluZGV4Iiwic3RhdGljUHJvcGVydGllcyIsImNvbnRleHRUeXBlcyIsImluc3RhbmNlT2YiLCJjaGlsZENvbnRleHRUeXBlcyIsInByb3BUeXBlcyIsIm9uZU9mVHlwZSIsInN0cmluZyIsImFycmF5T2YiLCJvYmplY3QiLCJyZW5kZXIiLCJQcm9wVHlwZXMiLCJmdW5jIiwiY29tcG9uZW50Iiwic3RvcmVTdGF0ZUdldHRlciIsImJpbmQiLCJnZXRTdGF0ZUFzT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7OztBQWFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGtCQUFrQjtBQUV0QkMsaUJB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NUIsRUFBbUM7QUFDakMsU0FBT0EsTUFBTTJDLGdCQUFOLEVBQVA7QUFDRDs7QUFFRCxTQUFTbEIsd0JBQVQsQ0FBa0NYLE1BQWxDLEVBQTBDO0FBQ3hDLFNBQU9BLE9BQU9KLE1BQVAsQ0FDTCxVQUFDQyxNQUFELEVBQVNYLEtBQVQ7QUFBQSxXQUFtQiwrQkFBT1csTUFBUCxFQUFlWCxNQUFNMkMsZ0JBQU4sRUFBZixDQUFuQjtBQUFBLEdBREssRUFFTCxFQUZLLENBQVA7QUFJRCIsImZpbGUiOiJyZWFjdENvbXBvbmVudE1ldGhvZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlYWN0IENvbXBvbmVudCBtZXRob2RzLiBUaGVzZSBhcmUgdGhlIHByaW1pdGl2ZXMgdXNlZCB0byBpbXBsZW1lbnRcbiAqIGZsdXhNaXhpbiBhbmQgRmx1eENvbXBvbmVudC5cbiAqXG4gKiBFeHBvc2VzIGEgRmx1eCBpbnN0YW5jZSBhcyBgdGhpcy5mbHV4YC4gVGhpcyByZXF1aXJlcyB0aGF0IGZsdXggYmUgcGFzc2VkIGFzXG4gKiBlaXRoZXIgY29udGV4dCBvciBhcyBhIHByb3AgKHByb3AgdGFrZXMgcHJlY2VkZW5jZSkuIENoaWxkcmVuIGFsc28gYXJlIGdpdmVuXG4gKiBhY2Nlc3MgdG8gZmx1eCBpbnN0YW5jZSBhcyBgY29udGV4dC5mbHV4YC5cbiAqXG4gKiBJdCBhbHNvIGFkZHMgdGhlIG1ldGhvZCBgY29ubmVjdFRvU3RvcmVzKClgLCB3aGljaCBlbnN1cmVzIHRoYXQgdGhlIGNvbXBvbmVudFxuICogc3RhdGUgc3RheXMgaW4gc3luYyB3aXRoIHRoZSBzcGVjaWZpZWQgRmx1eCBzdG9yZXMuIFNlZSB0aGUgaW5saW5lIGRvY3NcbiAqIG9mIGBjb25uZWN0VG9TdG9yZXNgIGZvciBkZXRhaWxzLlxuICovXG5cbmltcG9ydCB7IGRlZmF1bHQgYXMgUmVhY3QsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi9GbHV4JztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5cbmNvbnN0IGluc3RhbmNlTWV0aG9kcyA9IHtcblxuICBnZXRDaGlsZENvbnRleHQoKSB7XG4gICAgY29uc3QgZmx1eCA9IHRoaXMuZ2V0Rmx1eCgpO1xuXG4gICAgaWYgKCFmbHV4KSByZXR1cm4ge307XG5cbiAgICByZXR1cm4geyBmbHV4IH07XG4gIH0sXG5cbiAgZ2V0Rmx1eCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5mbHV4IHx8IHRoaXMuY29udGV4dC5mbHV4O1xuICB9LFxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fZmx1eFN0YXRlR2V0dGVycyA9IFtdO1xuICAgIHRoaXMuX2ZsdXhMaXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLmZsdXggPSB0aGlzLmdldEZsdXgoKTtcblxuICAgIGlmICghKHRoaXMuZmx1eCBpbnN0YW5jZW9mIEZsdXgpKSB7XG4gICAgICAvLyBUT0RPOiBwcmludCB0aGUgYWN0dWFsIGNsYXNzIG5hbWUgaGVyZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgZmx1eE1peGluOiBDb3VsZCBub3QgZmluZCBGbHV4IGluc3RhbmNlLiBFbnN1cmUgdGhhdCB5b3VyIGNvbXBvbmVudCBgXG4gICAgICArIGBoYXMgZWl0aGVyIFxcYHRoaXMuY29udGV4dC5mbHV4XFxgIG9yIFxcYHRoaXMucHJvcHMuZmx1eFxcYC5gXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZmx1eExpc3RlbmVycykge1xuICAgICAgaWYgKCF0aGlzLl9mbHV4TGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBzdG9yZSA9IGZsdXguZ2V0U3RvcmUoa2V5KTtcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmUgPT09ICd1bmRlZmluZWQnKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV07XG5cbiAgICAgIHN0b3JlLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy51cGRhdGVTdG9yZXMobmV4dFByb3BzKTtcbiAgfSxcblxuICB1cGRhdGVTdG9yZXMocHJvcHMgPSB0aGlzLnByb3BzKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldFN0b3JlU3RhdGUocHJvcHMpO1xuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICB9LFxuXG4gIGdldFN0b3JlU3RhdGUocHJvcHMgPSB0aGlzLnByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZsdXhTdGF0ZUdldHRlcnMucmVkdWNlKFxuICAgICAgKHJlc3VsdCwgc3RhdGVHZXR0ZXIpID0+IHtcbiAgICAgICAgY29uc3QgeyBnZXR0ZXIsIHN0b3JlcyB9ID0gc3RhdGVHZXR0ZXI7XG4gICAgICAgIGNvbnN0IHN0YXRlRnJvbVN0b3JlcyA9IGdldHRlcihzdG9yZXMsIHByb3BzKTtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihyZXN1bHQsIHN0YXRlRnJvbVN0b3Jlcyk7XG4gICAgICB9LCB7fVxuICAgICk7XG4gIH0sXG5cbiAgIC8qKlxuICAgICogQ29ubmVjdCBjb21wb25lbnQgdG8gc3RvcmVzLCBnZXQgdGhlIGNvbWJpbmVkIGluaXRpYWwgc3RhdGUsIGFuZFxuICAgICogc3Vic2NyaWJlIHRvIGZ1dHVyZSBjaGFuZ2VzLiBUaGVyZSBhcmUgdGhyZWUgd2F5cyB0byBjYWxsIGl0LiBUaGVcbiAgICAqIHNpbXBsZXN0IGlzIHRvIHBhc3MgYSBzaW5nbGUgc3RvcmUga2V5IGFuZCwgb3B0aW9uYWxseSwgYSBzdGF0ZSBnZXR0ZXIuXG4gICAgKiBUaGUgc3RhdGUgZ2V0dGVyIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc3RvcmUgYXMgYSBwYXJhbWV0ZXIgYW5kXG4gICAgKiByZXR1cm5zIHRoZSBzdGF0ZSB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIGNvbXBvbmVudCdzIGBzZXRTdGF0ZSgpYC5cbiAgICAqIElmIG5vIHN0YXRlIGdldHRlciBpcyBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IGdldHRlciBpcyB1c2VkLCB3aGljaCBzaW1wbHlcbiAgICAqIHJldHVybnMgdGhlIGVudGlyZSBzdG9yZSBzdGF0ZS5cbiAgICAqXG4gICAgKiBUaGUgc2Vjb25kIGZvcm0gYWNjZXB0cyBhbiBhcnJheSBvZiBzdG9yZSBrZXlzLiBXaXRoIHRoaXMgZm9ybSwgdGhlIHN0YXRlXG4gICAgKiBnZXR0ZXIgaXMgY2FsbGVkIG9uY2Ugd2l0aCBhbiBhcnJheSBvZiBzdG9yZSBpbnN0YW5jZXMgKGluIHRoZSBzYW1lIG9yZGVyXG4gICAgKiBhcyB0aGUgc3RvcmUga2V5cykuIHRoZSBkZWZhdWx0IGdldHRlciBwZXJmb3JtYW5jZSBhIHJlZHVjZSBvbiB0aGUgZW50aXJlXG4gICAgKiBzdGF0ZSBmb3IgZWFjaCBzdG9yZS5cbiAgICAqXG4gICAgKiBUaGUgbGFzdCBmb3JtIGFjY2VwdHMgYW4gb2JqZWN0IG9mIHN0b3JlIGtleXMgbWFwcGVkIHRvIHN0YXRlIGdldHRlcnMuIEFzXG4gICAgKiBhIHNob3J0Y3V0LCB5b3UgY2FuIHBhc3MgYG51bGxgIGFzIGEgc3RhdGUgZ2V0dGVyIHRvIHVzZSB0aGUgZGVmYXVsdFxuICAgICogc3RhdGUgZ2V0dGVyLlxuICAgICpcbiAgICAqIFJldHVybnMgdGhlIGNvbWJpbmVkIGluaXRpYWwgc3RhdGUgb2YgYWxsIHNwZWNpZmllZCBzdG9yZXMuXG4gICAgKlxuICAgICogVGhpcyB3YXkgeW91IGNhbiB3cml0ZSBhbGwgdGhlIGluaXRpYWxpemF0aW9uIGFuZCB1cGRhdGUgbG9naWMgaW4gYSBzaW5nbGVcbiAgICAqIGxvY2F0aW9uLCB3aXRob3V0IGhhdmluZyB0byBtZXNzIHdpdGggYWRkaW5nL3JlbW92aW5nIGxpc3RlbmVycy5cbiAgICAqXG4gICAgKiBAdHlwZSB7c3RyaW5nfGFycmF5fG9iamVjdH0gc3RhdGVHZXR0ZXJNYXAgLSBtYXAgb2Yga2V5cyB0byBnZXR0ZXJzXG4gICAgKiBAcmV0dXJucyB7b2JqZWN0fSBDb21iaW5lZCBpbml0aWFsIHN0YXRlIG9mIHN0b3Jlc1xuICAgICovXG4gIGNvbm5lY3RUb1N0b3JlcyhzdGF0ZUdldHRlck1hcCA9IHt9LCBzdGF0ZUdldHRlciA9IG51bGwpIHtcbiAgICBjb25zdCBmbHV4ID0gdGhpcy5nZXRGbHV4KCk7XG5cbiAgICBjb25zdCBnZXRTdG9yZSA9IChrZXkpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gZmx1eC5nZXRTdG9yZShrZXkpO1xuXG4gICAgICBpZiAodHlwZW9mIHN0b3JlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYGNvbm5lY3RUb1N0b3JlcygpOiBTdG9yZSB3aXRoIGtleSAnJHtrZXl9JyBkb2VzIG5vdCBleGlzdC5gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdG9yZTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBzdGF0ZUdldHRlck1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IGtleSA9IHN0YXRlR2V0dGVyTWFwO1xuICAgICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZShrZXkpO1xuICAgICAgY29uc3QgZ2V0dGVyID0gc3RhdGVHZXR0ZXIgfHwgZGVmYXVsdFN0YXRlR2V0dGVyO1xuXG4gICAgICB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnB1c2goeyBzdG9yZXM6IHN0b3JlLCBnZXR0ZXIgfSk7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IGNyZWF0ZVN0b3JlTGlzdGVuZXIodGhpcywgc3RvcmUsIGdldHRlcik7XG5cbiAgICAgIHN0b3JlLmFkZExpc3RlbmVyKCdjaGFuZ2UnLCBsaXN0ZW5lcik7XG4gICAgICB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV0gPSBsaXN0ZW5lcjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc3RhdGVHZXR0ZXJNYXApKSB7XG4gICAgICBjb25zdCBzdG9yZXMgPSBzdGF0ZUdldHRlck1hcC5tYXAoZ2V0U3RvcmUpO1xuICAgICAgY29uc3QgZ2V0dGVyID0gc3RhdGVHZXR0ZXIgfHwgZGVmYXVsdFJlZHVjZVN0YXRlR2V0dGVyO1xuXG4gICAgICB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnB1c2goeyBzdG9yZXMsIGdldHRlciB9KTtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gY3JlYXRlU3RvcmVMaXN0ZW5lcih0aGlzLCBzdG9yZXMsIGdldHRlcik7XG5cbiAgICAgIHN0YXRlR2V0dGVyTWFwLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSBzdG9yZXNbaW5kZXhdO1xuICAgICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV0gPSBsaXN0ZW5lcjtcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICBmb3IgKGxldCBrZXkgaW4gc3RhdGVHZXR0ZXJNYXApIHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZShrZXkpO1xuICAgICAgICBjb25zdCBnZXR0ZXIgPSBzdGF0ZUdldHRlck1hcFtrZXldIHx8IGRlZmF1bHRTdGF0ZUdldHRlcjtcblxuICAgICAgICB0aGlzLl9mbHV4U3RhdGVHZXR0ZXJzLnB1c2goeyBzdG9yZXM6IHN0b3JlLCBnZXR0ZXIgfSk7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gY3JlYXRlU3RvcmVMaXN0ZW5lcih0aGlzLCBzdG9yZSwgZ2V0dGVyKTtcblxuICAgICAgICBzdG9yZS5hZGRMaXN0ZW5lcignY2hhbmdlJywgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9mbHV4TGlzdGVuZXJzW2tleV0gPSBsaXN0ZW5lcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRTdG9yZVN0YXRlKCk7XG4gIH1cblxufTtcblxuY29uc3Qgc3RhdGljUHJvcGVydGllcyA9IHtcbiAgY29udGV4dFR5cGVzOiB7XG4gICAgZmx1eDogUHJvcFR5cGVzLmluc3RhbmNlT2YoRmx1eCksXG4gIH0sXG5cbiAgY2hpbGRDb250ZXh0VHlwZXM6IHtcbiAgICBmbHV4OiBQcm9wVHlwZXMuaW5zdGFuY2VPZihGbHV4KSxcbiAgfSxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBjb25uZWN0VG9TdG9yZXM6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgIFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgICAgUHJvcFR5cGVzLm9iamVjdFxuICAgIF0pLFxuICAgIGZsdXg6IFByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdXgpLFxuICAgIHJlbmRlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgc3RhdGVHZXR0ZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICB9LFxufTtcblxuZXhwb3J0IHsgaW5zdGFuY2VNZXRob2RzLCBzdGF0aWNQcm9wZXJ0aWVzIH07XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlTGlzdGVuZXIoY29tcG9uZW50LCBzdG9yZSwgc3RvcmVTdGF0ZUdldHRlcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3RhdGUgPSBzdG9yZVN0YXRlR2V0dGVyKHN0b3JlLCB0aGlzLnByb3BzKTtcbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgfS5iaW5kKGNvbXBvbmVudCk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRTdGF0ZUdldHRlcihzdG9yZSkge1xuICByZXR1cm4gc3RvcmUuZ2V0U3RhdGVBc09iamVjdCgpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0UmVkdWNlU3RhdGVHZXR0ZXIoc3RvcmVzKSB7XG4gIHJldHVybiBzdG9yZXMucmVkdWNlKFxuICAgIChyZXN1bHQsIHN0b3JlKSA9PiBhc3NpZ24ocmVzdWx0LCBzdG9yZS5nZXRTdGF0ZUFzT2JqZWN0KCkpLFxuICAgIHt9XG4gICk7XG59XG4iXX0=