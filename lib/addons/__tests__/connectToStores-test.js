'use strict';

var _connectToStores = require('../connectToStores');

var _connectToStores2 = _interopRequireDefault(_connectToStores);

var _addContext = require('./addContext');

var _addContext2 = _interopRequireDefault(_addContext);

var _Flux = require('../../Flux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropTypes = _react2['default'].PropTypes;

var TestActions = function (_Actions) {
  _inherits(TestActions, _Actions);

  function TestActions() {
    _classCallCheck(this, TestActions);

    return _possibleConstructorReturn(this, _Actions.apply(this, arguments));
  }

  TestActions.prototype.getSomething = function getSomething(something) {
    return something;
  };

  return TestActions;
}(_Flux.Actions);

var TestStore = function (_Store) {
  _inherits(TestStore, _Store);

  function TestStore(flux) {
    _classCallCheck(this, TestStore);

    var _this2 = _possibleConstructorReturn(this, _Store.call(this));

    var testActions = flux.getActions('test');
    _this2.register(testActions.getSomething, _this2.handleGetSomething);

    _this2.state = {
      something: null
    };
    return _this2;
  }

  TestStore.prototype.handleGetSomething = function handleGetSomething(something) {
    this.setState({ something: something });
  };

  return TestStore;
}(_Flux.Store);

var Flux = function (_Flummox) {
  _inherits(Flux, _Flummox);

  function Flux() {
    _classCallCheck(this, Flux);

    var _this3 = _possibleConstructorReturn(this, _Flummox.call(this));

    _this3.createActions('test', TestActions);
    _this3.createStore('test', TestStore, _this3);
    return _this3;
  }

  return Flux;
}(_Flux.Flummox);

describe('connectToStores (HoC)', function () {
  it('gets Flux from either props or context', function () {
    var flux = new Flux();
    var contextComponent = void 0,
        propsComponent = void 0;

    var BaseComponent = function (_React$Component) {
      _inherits(BaseComponent, _React$Component);

      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
      }

      BaseComponent.prototype.render = function render() {
        return _react2['default'].createElement('div', null);
      };

      return BaseComponent;
    }(_react2['default'].Component);

    var ConnectedComponent = (0, _connectToStores2['default'])(BaseComponent, 'test');

    var ContextComponent = (0, _addContext2['default'])(ConnectedComponent, { flux: flux }, { flux: _react2['default'].PropTypes.instanceOf(_Flux.Flummox) });

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ContextComponent, null));

    contextComponent = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, ConnectedComponent);

    propsComponent = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ConnectedComponent, { flux: flux }));

    expect(contextComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
    expect(propsComponent.flux).to.be.an['instanceof'](_Flux.Flummox);
  });

  it('transfers props', function () {
    var flux = new Flux();

    var BaseComponent = function (_React$Component2) {
      _inherits(BaseComponent, _React$Component2);

      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
      }

      BaseComponent.prototype.render = function render() {
        return _react2['default'].createElement('div', null);
      };

      return BaseComponent;
    }(_react2['default'].Component);

    var ConnectedComponent = (0, _connectToStores2['default'])(BaseComponent, 'test');

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ConnectedComponent, { flux: flux, foo: 'bar', bar: 'baz' }));

    var component = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, BaseComponent);

    expect(component.props.foo).to.equal('bar');
    expect(component.props.bar).to.equal('baz');
  });

  it('syncs with store after state change', function () {
    var flux = new Flux();

    var BaseComponent = function (_React$Component3) {
      _inherits(BaseComponent, _React$Component3);

      function BaseComponent() {
        _classCallCheck(this, BaseComponent);

        return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
      }

      BaseComponent.prototype.render = function render() {
        return _react2['default'].createElement('div', null);
      };

      return BaseComponent;
    }(_react2['default'].Component);

    var ConnectedComponent = (0, _connectToStores2['default'])(BaseComponent, 'test');

    var tree = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(ConnectedComponent, { flux: flux }));

    var component = _reactAddonsTestUtils2['default'].findRenderedComponentWithType(tree, BaseComponent);

    var getSomething = flux.getActions('test').getSomething;

    expect(component.props.something).to.be['null'];

    getSomething('do');

    expect(component.props.something).to.equal('do');

    getSomething('re');

    expect(component.props.something).to.equal('re');
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hZGRvbnMvX190ZXN0c19fL2Nvbm5lY3RUb1N0b3Jlcy10ZXN0LmpzIl0sIm5hbWVzIjpbIlByb3BUeXBlcyIsIlRlc3RBY3Rpb25zIiwiZ2V0U29tZXRoaW5nIiwic29tZXRoaW5nIiwiVGVzdFN0b3JlIiwiZmx1eCIsInRlc3RBY3Rpb25zIiwiZ2V0QWN0aW9ucyIsInJlZ2lzdGVyIiwiaGFuZGxlR2V0U29tZXRoaW5nIiwic3RhdGUiLCJzZXRTdGF0ZSIsIkZsdXgiLCJjcmVhdGVBY3Rpb25zIiwiY3JlYXRlU3RvcmUiLCJkZXNjcmliZSIsIml0IiwiY29udGV4dENvbXBvbmVudCIsInByb3BzQ29tcG9uZW50IiwiQmFzZUNvbXBvbmVudCIsInJlbmRlciIsIkNvbXBvbmVudCIsIkNvbm5lY3RlZENvbXBvbmVudCIsIkNvbnRleHRDb21wb25lbnQiLCJpbnN0YW5jZU9mIiwidHJlZSIsInJlbmRlckludG9Eb2N1bWVudCIsImZpbmRSZW5kZXJlZENvbXBvbmVudFdpdGhUeXBlIiwiZXhwZWN0IiwidG8iLCJiZSIsImFuIiwiY29tcG9uZW50IiwicHJvcHMiLCJmb28iLCJlcXVhbCIsImJhciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ1FBLFMsc0JBQUFBLFM7O0lBRUZDLFc7Ozs7Ozs7Ozt3QkFDSkMsWSx5QkFBYUMsUyxFQUFXO0FBQ3RCLFdBQU9BLFNBQVA7QUFDRCxHOzs7OztJQUdHQyxTOzs7QUFDSixxQkFBWUMsSUFBWixFQUFrQjtBQUFBOztBQUFBLGtEQUNoQixpQkFEZ0I7O0FBR2hCLFFBQU1DLGNBQWNELEtBQUtFLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBcEI7QUFDQSxXQUFLQyxRQUFMLENBQWNGLFlBQVlKLFlBQTFCLEVBQXdDLE9BQUtPLGtCQUE3Qzs7QUFFQSxXQUFLQyxLQUFMLEdBQWE7QUFDWFAsaUJBQVc7QUFEQSxLQUFiO0FBTmdCO0FB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QUFFQSxRQUFNTSxPQUFPLGtDQUFVQyxrQkFBVixDQUNYLGlDQUFDLGtCQUFELElBQW9CLE1BQU1yQixJQUExQixHQURXLENBQWI7O0FBSUEsUUFBTTJCLFlBQVksa0NBQVVMLDZCQUFWLENBQ2hCRixJQURnQixFQUNWTixhQURVLENBQWxCOztBQUlBLFFBQU1qQixlQUFlRyxLQUFLRSxVQUFMLENBQWdCLE1BQWhCLEVBQXdCTCxZQUE3Qzs7QUFFQTBCLFdBQU9JLFVBQVVDLEtBQVYsQ0FBZ0I5QixTQUF2QixFQUFrQzBCLEVBQWxDLENBQXFDQyxFQUFyQzs7QUFFQTVCLGlCQUFhLElBQWI7O0FBRUEwQixXQUFPSSxVQUFVQyxLQUFWLENBQWdCOUIsU0FBdkIsRUFBa0MwQixFQUFsQyxDQUFxQ00sS0FBckMsQ0FBMkMsSUFBM0M7O0FBRUFqQyxpQkFBYSxJQUFiOztBQUVBMEIsV0FBT0ksVUFBVUMsS0FBVixDQUFnQjlCLFNBQXZCLEVBQWtDMEIsRUFBbEMsQ0FBcUNNLEtBQXJDLENBQTJDLElBQTNDO0FBQ0QsR0E5QkQ7QUErQkQsQ0F6RkQiLCJmaWxlIjoiY29ubmVjdFRvU3RvcmVzLXRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29ubmVjdFRvU3RvcmVzIGZyb20gJy4uL2Nvbm5lY3RUb1N0b3Jlcyc7XG5pbXBvcnQgYWRkQ29udGV4dCBmcm9tICcuL2FkZENvbnRleHQnO1xuaW1wb3J0IHsgQWN0aW9ucywgU3RvcmUsIEZsdW1tb3ggfSBmcm9tICcuLi8uLi9GbHV4JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGVzdFV0aWxzIGZyb20gJ3JlYWN0LWFkZG9ucy10ZXN0LXV0aWxzJztcbmNvbnN0IHsgUHJvcFR5cGVzIH0gPSBSZWFjdDtcblxuY2xhc3MgVGVzdEFjdGlvbnMgZXh0ZW5kcyBBY3Rpb25zIHtcbiAgZ2V0U29tZXRoaW5nKHNvbWV0aGluZykge1xuICAgIHJldHVybiBzb21ldGhpbmc7XG4gIH1cbn1cblxuY2xhc3MgVGVzdFN0b3JlIGV4dGVuZHMgU3RvcmUge1xuICBjb25zdHJ1Y3RvcihmbHV4KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHRlc3RBY3Rpb25zID0gZmx1eC5nZXRBY3Rpb25zKCd0ZXN0Jyk7XG4gICAgdGhpcy5yZWdpc3Rlcih0ZXN0QWN0aW9ucy5nZXRTb21ldGhpbmcsIHRoaXMuaGFuZGxlR2V0U29tZXRoaW5nKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzb21ldGhpbmc6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlR2V0U29tZXRoaW5nKHNvbWV0aGluZykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzb21ldGhpbmcgfSk7XG4gIH1cbn1cblxuY2xhc3MgRmx1eCBleHRlbmRzIEZsdW1tb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jcmVhdGVBY3Rpb25zKCd0ZXN0JywgVGVzdEFjdGlvbnMpO1xuICAgIHRoaXMuY3JlYXRlU3RvcmUoJ3Rlc3QnLCBUZXN0U3RvcmUsIHRoaXMpO1xuICB9XG59XG5cbmRlc2NyaWJlKCdjb25uZWN0VG9TdG9yZXMgKEhvQyknLCAoKSA9PiB7XG4gIGl0KCdnZXRzIEZsdXggZnJvbSBlaXRoZXIgcHJvcHMgb3IgY29udGV4dCcsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcbiAgICBsZXQgY29udGV4dENvbXBvbmVudCwgcHJvcHNDb21wb25lbnQ7XG5cbiAgICBjbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYvPjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25uZWN0ZWRDb21wb25lbnQgPSBjb25uZWN0VG9TdG9yZXMoQmFzZUNvbXBvbmVudCwgJ3Rlc3QnKTtcblxuICAgIGNvbnN0IENvbnRleHRDb21wb25lbnQgPSBhZGRDb250ZXh0KFxuICAgICAgQ29ubmVjdGVkQ29tcG9uZW50LFxuICAgICAgeyBmbHV4IH0sXG4gICAgICB7IGZsdXg6IFJlYWN0LlByb3BUeXBlcy5pbnN0YW5jZU9mKEZsdW1tb3gpIH1cbiAgICApO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Q29udGV4dENvbXBvbmVudCAvPlxuICAgICk7XG5cbiAgICBjb250ZXh0Q29tcG9uZW50ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZENvbXBvbmVudFdpdGhUeXBlKFxuICAgICAgdHJlZSwgQ29ubmVjdGVkQ29tcG9uZW50XG4gICAgKTtcblxuICAgIHByb3BzQ29tcG9uZW50ID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIDxDb25uZWN0ZWRDb21wb25lbnQgZmx1eD17Zmx1eH0gLz5cbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbnRleHRDb21wb25lbnQuZmx1eCkudG8uYmUuYW4uaW5zdGFuY2VvZihGbHVtbW94KTtcbiAgICBleHBlY3QocHJvcHNDb21wb25lbnQuZmx1eCkudG8uYmUuYW4uaW5zdGFuY2VvZihGbHVtbW94KTtcbiAgfSk7XG5cbiAgaXQoJ3RyYW5zZmVycyBwcm9wcycsICgpID0+IHtcbiAgICBjb25zdCBmbHV4ID0gbmV3IEZsdXgoKTtcblxuICAgIGNsYXNzIEJhc2VDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gPGRpdi8+O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IENvbm5lY3RlZENvbXBvbmVudCA9IGNvbm5lY3RUb1N0b3JlcyhCYXNlQ29tcG9uZW50LCAndGVzdCcpO1xuXG4gICAgY29uc3QgdHJlZSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICA8Q29ubmVjdGVkQ29tcG9uZW50IGZsdXg9e2ZsdXh9IGZvbz1cImJhclwiIGJhcj1cImJhelwiIC8+XG4gICAgKTtcblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZShcbiAgICAgIHRyZWUsIEJhc2VDb21wb25lbnRcbiAgICApO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5wcm9wcy5mb28pLnRvLmVxdWFsKCdiYXInKTtcbiAgICBleHBlY3QoY29tcG9uZW50LnByb3BzLmJhcikudG8uZXF1YWwoJ2JheicpO1xuICB9KTtcblxuICBpdCgnc3luY3Mgd2l0aCBzdG9yZSBhZnRlciBzdGF0ZSBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgY29uc3QgZmx1eCA9IG5ldyBGbHV4KCk7XG5cbiAgICBjbGFzcyBCYXNlQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYvPjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBDb25uZWN0ZWRDb21wb25lbnQgPSBjb25uZWN0VG9TdG9yZXMoQmFzZUNvbXBvbmVudCwgJ3Rlc3QnKTtcblxuICAgIGNvbnN0IHRyZWUgPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgPENvbm5lY3RlZENvbXBvbmVudCBmbHV4PXtmbHV4fSAvPlxuICAgICk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkQ29tcG9uZW50V2l0aFR5cGUoXG4gICAgICB0cmVlLCBCYXNlQ29tcG9uZW50XG4gICAgKTtcblxuICAgIGNvbnN0IGdldFNvbWV0aGluZyA9IGZsdXguZ2V0QWN0aW9ucygndGVzdCcpLmdldFNvbWV0aGluZztcblxuICAgIGV4cGVjdChjb21wb25lbnQucHJvcHMuc29tZXRoaW5nKS50by5iZS5udWxsO1xuXG4gICAgZ2V0U29tZXRoaW5nKCdkbycpO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5wcm9wcy5zb21ldGhpbmcpLnRvLmVxdWFsKCdkbycpO1xuXG4gICAgZ2V0U29tZXRoaW5nKCdyZScpO1xuXG4gICAgZXhwZWN0KGNvbXBvbmVudC5wcm9wcy5zb21ldGhpbmcpLnRvLmVxdWFsKCdyZScpO1xuICB9KTtcbn0pO1xuIl19