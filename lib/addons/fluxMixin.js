'use strict';

exports.__esModule = true;
exports['default'] = fluxMixin;

var _react = require('react');

var _Flux = require('../Flux');

var _reactComponentMethods = require('./reactComponentMethods');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * fluxMixin
 *
 * Exports a function that creates a React component mixin. Implements methods
 * from reactComponentMethods.
 *
 * Any arguments passed to the mixin creator are passed to `connectToStores()`
 * and used as the return value of `getInitialState()`. This lets you handle
 * all of the state initialization and updates in a single place, while removing
 * the burden of manually adding and removing store listeners.
 *
 * @example
 * let Component = React.createClass({
 *   mixins: [fluxMixin({
 *     storeA: store => ({
 *       foo: store.state.a,
 *     }),
 *     storeB: store => ({
 *       bar: store.state.b,
 *     })
 *   }]
 * });
 */

function fluxMixin() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  function getInitialState() {
    this.initialize();
    return this.connectToStores.apply(this, args);
  }

  return (0, _objectAssign2['default'])({ getInitialState: getInitialState }, _reactComponentMethods.instanceMethods, _reactComponentMethods.staticProperties);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvZmx1eE1peGluLmpzIl0sIm5hbWVzIjpbImZsdXhNaXhpbiIsImFyZ3MiLCJnZXRJbml0aWFsU3RhdGUiLCJpbml0aWFsaXplIiwiY29ubmVjdFRvU3RvcmVzIl0sIm1hcHBpbmdzIjoiOzs7cUJBNkJ3QkEsUzs7QUFMeEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQTNCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJlLFNBQVNBLFNBQVQsR0FBNEI7QUFBQSxvQ0FBTkMsSUFBTTtBQUFOQSxRQUFNO0FBQUE7O0FBQ3pDLFdBQVNDLGVBQVQsR0FBMkI7QUFDekIsU0FBS0MsVUFBTDtBQUNBLFdBQU8sS0FBS0MsZUFBTCxhQUF3QkgsSUFBeEIsQ0FBUDtBQUNEOztBQUVELFNBQU8sK0JBQ0wsRUFBRUMsZ0NBQUYsRUFESyxrRkFBUDtBQUtEIiwiZmlsZSI6ImZsdXhNaXhpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZmx1eE1peGluXG4gKlxuICogRXhwb3J0cyBhIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIFJlYWN0IGNvbXBvbmVudCBtaXhpbi4gSW1wbGVtZW50cyBtZXRob2RzXG4gKiBmcm9tIHJlYWN0Q29tcG9uZW50TWV0aG9kcy5cbiAqXG4gKiBBbnkgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgbWl4aW4gY3JlYXRvciBhcmUgcGFzc2VkIHRvIGBjb25uZWN0VG9TdG9yZXMoKWBcbiAqIGFuZCB1c2VkIGFzIHRoZSByZXR1cm4gdmFsdWUgb2YgYGdldEluaXRpYWxTdGF0ZSgpYC4gVGhpcyBsZXRzIHlvdSBoYW5kbGVcbiAqIGFsbCBvZiB0aGUgc3RhdGUgaW5pdGlhbGl6YXRpb24gYW5kIHVwZGF0ZXMgaW4gYSBzaW5nbGUgcGxhY2UsIHdoaWxlIHJlbW92aW5nXG4gKiB0aGUgYnVyZGVuIG9mIG1hbnVhbGx5IGFkZGluZyBhbmQgcmVtb3Zpbmcgc3RvcmUgbGlzdGVuZXJzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgQ29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICBtaXhpbnM6IFtmbHV4TWl4aW4oe1xuICogICAgIHN0b3JlQTogc3RvcmUgPT4gKHtcbiAqICAgICAgIGZvbzogc3RvcmUuc3RhdGUuYSxcbiAqICAgICB9KSxcbiAqICAgICBzdG9yZUI6IHN0b3JlID0+ICh7XG4gKiAgICAgICBiYXI6IHN0b3JlLnN0YXRlLmIsXG4gKiAgICAgfSlcbiAqICAgfV1cbiAqIH0pO1xuICovXG5cbmltcG9ydCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi9GbHV4JztcbmltcG9ydCB7IGluc3RhbmNlTWV0aG9kcywgc3RhdGljUHJvcGVydGllcyB9IGZyb20gJy4vcmVhY3RDb21wb25lbnRNZXRob2RzJztcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZsdXhNaXhpbiguLi5hcmdzKSB7XG4gIGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0VG9TdG9yZXMoLi4uYXJncyk7XG4gIH1cblxuICByZXR1cm4gYXNzaWduKFxuICAgIHsgZ2V0SW5pdGlhbFN0YXRlIH0sXG4gICAgaW5zdGFuY2VNZXRob2RzLFxuICAgIHN0YXRpY1Byb3BlcnRpZXNcbiAgKTtcbn07XG4iXX0=