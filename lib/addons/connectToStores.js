'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactComponentMethods = require('./reactComponentMethods');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Higher-order component form of connectToStores
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

exports['default'] = function (BaseComponent, stores, stateGetter) {
  var ConnectedComponent = function (_React$Component) {
    _inherits(ConnectedComponent, _React$Component);

    function ConnectedComponent(props, context) {
      _classCallCheck(this, ConnectedComponent);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

      _this.initialize();

      _this.state = _this.connectToStores(stores, stateGetter);
      return _this;
    }

    ConnectedComponent.prototype.render = function render() {
      return _react2['default'].createElement(BaseComponent, _extends({}, this.state, this.props));
    };

    return ConnectedComponent;
  }(_react2['default'].Component);

  (0, _objectAssign2['default'])(ConnectedComponent.prototype, _reactComponentMethods.instanceMethods);

  (0, _objectAssign2['default'])(ConnectedComponent, _reactComponentMethods.staticProperties);

  return ConnectedComponent;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hZGRvbnMvY29ubmVjdFRvU3RvcmVzLmpzIl0sIm5hbWVzIjpbIkJhc2VDb21wb25lbnQiLCJzdG9yZXMiLCJzdGF0ZUdldHRlciIsIkNvbm5lY3RlZENvbXBvbmVudCIsInByb3BzIiwiY29udGV4dCIsImluaXRpYWxpemUiLCJzdGF0ZSIsImNvbm5lY3RUb1N0b3JlcyIsInJlbmRlciIsIkNvbXBvbmVudCIsInByb3RvdHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUE7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7OzsrZUFOQTs7OztxQkFRZSxVQUFDQSxhQUFELEVBQWdCQyxNQUFoQixFQUF3QkMsV0FBeEIsRUFBd0M7QUFDckQsTUFBTUM7QUFBQTs7QUFDSixnQ0FBWUMsS0FBWixFQUFtQkMsT0FBbkIsRUFBNEI7QUFBQTs7QUFBQSxtREFDMUIsNEJBQU1ELEtBQU4sRUFBYUMsT0FBYixDQUQwQjs7QUFHMUIsWUFBS0MsVUFBTDs7QUFFQSxZQUFLQyxLQUFMLEdBQWEsTUFBS0MsZUFBTCxDQUFxQlAsTUFBckIsRUFBNkJDLFdBQTdCLENBQWI7QUFMMEI7QUFNM0I7O0FBUEcsaUNBU0pPLE1BVEkscUJBU0s7QUFDUCxhQUFPLGlDQUFDLGFBQUQsZUFBbUIsS0FBS0YsS0FBeEIsRUFBbUMsS0FBS0gsS0FBeEMsRUFBUDtBQUNELEtBWEc7O0FBQUE7QUFBQSxJQUFtQyxtQkFBTU0sU0FBekMsQ0FBTjs7QUFjQSxpQ0FDRVAsbUJBQW1CUSxTQURyQjs7QUFLQSxpQ0FBT1Isa0JBQVA7O0FBRUEsU0FBT0Esa0JBQVA7QUFDRCxDIiwiZmlsZSI6ImNvbm5lY3RUb1N0b3Jlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSGlnaGVyLW9yZGVyIGNvbXBvbmVudCBmb3JtIG9mIGNvbm5lY3RUb1N0b3Jlc1xuICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBpbnN0YW5jZU1ldGhvZHMsIHN0YXRpY1Byb3BlcnRpZXMgfSBmcm9tICcuL3JlYWN0Q29tcG9uZW50TWV0aG9kcyc7XG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nO1xuXG5leHBvcnQgZGVmYXVsdCAoQmFzZUNvbXBvbmVudCwgc3RvcmVzLCBzdGF0ZUdldHRlcikgPT4ge1xuICBjb25zdCBDb25uZWN0ZWRDb21wb25lbnQgPSBjbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpIHtcbiAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcblxuICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLmNvbm5lY3RUb1N0b3JlcyhzdG9yZXMsIHN0YXRlR2V0dGVyKTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gPEJhc2VDb21wb25lbnQgey4uLnRoaXMuc3RhdGV9IHsuLi50aGlzLnByb3BzfSAvPjtcbiAgICB9XG4gIH07XG5cbiAgYXNzaWduKFxuICAgIENvbm5lY3RlZENvbXBvbmVudC5wcm90b3R5cGUsXG4gICAgaW5zdGFuY2VNZXRob2RzXG4gICk7XG5cbiAgYXNzaWduKENvbm5lY3RlZENvbXBvbmVudCwgc3RhdGljUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIENvbm5lY3RlZENvbXBvbmVudDtcbn07XG4iXX0=